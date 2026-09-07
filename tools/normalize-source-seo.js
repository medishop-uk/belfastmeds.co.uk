const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const primaryNav = '<nav class="source-navigation" aria-label="Primary"><span>All Categories:</span> <a href="{{ROOT}}shop/category/adhd-and-wakefulness.html">ADHD &amp; wakefulness</a> <a href="{{ROOT}}shop/category/anxiety-and-panic-disorders.html">Anxiety &amp; panic disorders</a> <a href="{{ROOT}}shop/category/anxiety-and-seizure-disorders.html">Anxiety &amp; seizure disorders</a> <a href="{{ROOT}}shop/category/moderate-to-severe-pain.html">Moderate to severe pain</a> <a href="{{ROOT}}shop/category/nerve-pain-and-anxiety-related-medicines.html">Nerve pain &amp; anxiety-related medicines</a> <a href="{{ROOT}}shop/category/short-term-sedation.html">Short-term sedation</a> <a href="{{ROOT}}shop/category/sleep-and-insomnia-medication.html">Sleep &amp; insomnia medication</a> <a href="{{ROOT}}shop/">Shop</a> <a href="{{ROOT}}blog/">Blog</a> <a href="{{ROOT}}about-us/">About Us</a> <a href="{{ROOT}}#contact">Contact Us</a></nav>';
const overrides = {
  'shop/medicine/noctin-nitrazepam-5-mg.html': {
    title: 'Noctin Nitrazepam 5mg | BelfastMeds',
    description: 'Read about Noctin Nitrazepam 5mg, available pack options, prescription requirements and UK delivery support from BelfastMeds.'
  },
  'shop/medicine/zopiclone-7-5mg-version-5.html': {
    title: 'Zopiclone 7.5mg | BelfastMeds',
    description: 'Read about Zopiclone 7.5mg, available pack options, prescription requirements and UK delivery support from BelfastMeds.'
  }
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'tools') return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : (entry.name.endsWith('.html') ? [file] : []);
  });
}
function plain(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}
function setElement(head, pattern, replacement) {
  return pattern.test(head) ? head.replace(pattern, replacement) : head.replace(/<\/head>/i, `${replacement}\n</head>`);
}

let changed = 0;
for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'index.html') continue;
  const source = fs.readFileSync(file, 'utf8');
  let html = source;
  let head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [''])[0];
  let body = (html.match(/<body\b[\s\S]*?<\/body>/i) || [''])[0];
  if (!head || !body) continue;

  let descriptionSeen = false;
  head = head.replace(/<meta\b[^>]*name=["']description["'][^>]*>\s*/gi, tag => {
    if (descriptionSeen) return '';
    descriptionSeen = true;
    return `${tag}\n`;
  });
  head = head
    .replace(/BelfasmedsUK|BelfastmedsUK|MedishopUK/gi, 'BelfastMeds')
    .replace(/Belfastmeds/gi, 'BelfastMeds')
    .replace(/https:\/\/www\.BelfastMeds\.co\.uk/g, 'https://www.belfastmeds.co.uk')
    .replace(/\s*\[[a-z]\](?=["'])/gi, '')
    .replace(/A\s+nxiety/gi, 'Anxiety');
  if (overrides[rel]) {
    head = setElement(head, /<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${overrides[rel].title}</title>`);
    head = setElement(head, /<meta\b[^>]*name=["']description["'][^>]*>/i, `<meta name="description" content="${overrides[rel].description}">`);
    head = head.replace(/(<meta\b[^>]*property=["']og:title["'][^>]*content=["'])[^"']*(["'][^>]*>)/i, `$1${overrides[rel].title}$2`)
      .replace(/(<meta\b[^>]*name=["']twitter:title["'][^>]*content=["'])[^"']*(["'][^>]*>)/i, `$1${overrides[rel].title}$2`)
      .replace(/(<meta\b[^>]*property=["']og:description["'][^>]*content=["'])[^"']*(["'][^>]*>)/i, `$1${overrides[rel].description}$2`)
      .replace(/(<meta\b[^>]*name=["']twitter:description["'][^>]*content=["'])[^"']*(["'][^>]*>)/i, `$1${overrides[rel].description}$2`);
  }

  const marker = '<!-- /BELFASTMEDS:BODY -->';
  const markerIndex = body.indexOf(marker);
  const headings = [...body.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  const realH1 = headings.find(match => !/^=+$/.test(plain(match[0])));
  const relativeRoot = '../'.repeat(rel.split('/').length - 1) || './';
  const localPrimaryNav = primaryNav.replace(/\\{\\{ROOT\\}\\}/g, relativeRoot);
  if (markerIndex >= 0 && realH1) {
    const contentStart = realH1.index;
    body = body.slice(0, markerIndex + marker.length) + `\n${localPrimaryNav}\n` + body.slice(contentStart);
  }
  const openEnd = body.indexOf('>') + 1;
  const contentEnd = body.lastIndexOf('</body>');
  let content = body.slice(openEnd, contentEnd);
  content = content
    .replace(/\sstyle=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/<\/?span\b[^>]*>/gi, '')
    .replace(/\[[a-z]\]/gi, '')
    .replace(/<p\b([^>]*)>\s*(?:&nbsp;|&#160;|\s)*<\/p>/gi, '')
    .replace(/<p\b([^>]*)>\s*<\/p>/gi, '');
  let previous = 0;
  content = content.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (all, levelText, attrs, inner) => {
    let level = Number(levelText);
    if (previous && level > previous + 1) level = previous + 1;
    previous = level;
    return `<h${level}${attrs}>${inner}</h${level}>`;
  });
  body = body.slice(0, openEnd) + content + body.slice(contentEnd);
  html = html.replace(/<head\b[\s\S]*?<\/head>/i, head).replace(/<body\b[\s\S]*?<\/body>/i, body);
  if (html !== source) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}
console.log(JSON.stringify({ changed }));
