const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const domain = 'https://www.belfastmeds.co.uk';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  if (entry.name === '.git' || entry.name === 'tools') return [];
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : (entry.name.endsWith('.html') ? [file] : []);
});
const text = html => html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i')) || [,''])[1];
const files = walk(root);
const rows = [];
const titleMap = new Map(), descriptionMap = new Map(), canonicalMap = new Map();
const canonicals = new Set();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [''])[0];
  const body = (html.match(/<body\b[\s\S]*?<\/body>/i) || [''])[0];
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(x => text(x[1]));
  const descriptions = [...head.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)].map(x => attr(x[0], 'content'));
  const canonicalTags = [...head.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map(x => attr(x[0], 'href'));
  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(x => ({ level: +x[1], value: text(x[2]) }));
  const images = [...body.matchAll(/<img\b[^>]*>/gi)];
  const anchors = [...body.matchAll(/<a\b[^>]*>/gi)];
  const jsonScripts = [...head.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let jsonErrors = 0;
  for (const script of jsonScripts) try { JSON.parse(script[1]); } catch { jsonErrors++; }
  const skips = [];
  for (let i = 1; i < headings.length; i++) if (headings[i].level > headings[i - 1].level + 1) skips.push(`${headings[i - 1].level}>${headings[i].level}`);
  const editorial = (body.match(/\b(?:Meta Title|Meta Description|URL|Revision|Tags):|={8,}|\[Insert\b|cmnt_ref/gi) || []).length;
  const row = {
    file: rel, titleCount: titles.length, title: titles[0] || '', descriptionCount: descriptions.length,
    description: descriptions[0] || '', canonicalCount: canonicalTags.length, canonical: canonicalTags[0] || '',
    h1: headings.filter(x => x.level === 1).length, headingSkips: skips.length, sourceText: text(body).length,
    images: images.length, missingAlt: images.filter(x => !/\balt\s*=/.test(x[0])).length,
    anchors: anchors.length, missingHref: anchors.filter(x => !/\bhref\s*=/.test(x[0])).length,
    jsonErrors, editorial
  };
  rows.push(row);
  if (row.title) titleMap.set(row.title, [...(titleMap.get(row.title) || []), rel]);
  if (row.description) descriptionMap.set(row.description, [...(descriptionMap.get(row.description) || []), rel]);
  if (row.canonical) { canonicalMap.set(row.canonical, [...(canonicalMap.get(row.canonical) || []), rel]); canonicals.add(row.canonical); }
}
const duplicates = map => [...map].filter(([, list]) => list.length > 1).map(([value, list]) => ({ value, files: list }));
const issues = rows.filter(r => r.titleCount !== 1 || r.descriptionCount !== 1 || r.canonicalCount !== 1 || r.h1 !== 1 || r.headingSkips || r.missingAlt || r.missingHref || r.jsonErrors || r.editorial || r.sourceText < 120);
console.log(JSON.stringify({
  pages: rows.length,
  totals: {
    badTitleCount: rows.filter(r => r.titleCount !== 1).length,
    badDescriptionCount: rows.filter(r => r.descriptionCount !== 1).length,
    badCanonicalCount: rows.filter(r => r.canonicalCount !== 1).length,
    badH1: rows.filter(r => r.h1 !== 1).length,
    headingSkips: rows.filter(r => r.headingSkips).length,
    missingAlt: rows.reduce((n, r) => n + r.missingAlt, 0),
    missingHref: rows.reduce((n, r) => n + r.missingHref, 0),
    jsonErrors: rows.reduce((n, r) => n + r.jsonErrors, 0),
    editorialArtifacts: rows.filter(r => r.editorial).length,
    thinSource: rows.filter(r => r.sourceText < 120).length,
    duplicateTitles: duplicates(titleMap).length,
    duplicateDescriptions: duplicates(descriptionMap).length,
    duplicateCanonicals: duplicates(canonicalMap).length
  },
  issues,
  duplicates: { titles: duplicates(titleMap), descriptions: duplicates(descriptionMap), canonicals: duplicates(canonicalMap) }
}, null, 2));
