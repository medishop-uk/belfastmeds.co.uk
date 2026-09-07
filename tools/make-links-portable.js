const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hosts = new Set(['belfastmeds.co.uk', 'www.belfastmeds.co.uk']);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'tools') return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : (entry.name.endsWith('.html') ? [file] : []);
  });
}

function relativeHref(file, href) {
  if (!/^https?:\/\//i.test(href)) return href;
  let url;
  try {
    url = new URL(href.replace(/&amp;/g, '&'));
  } catch {
    return href;
  }
  if (!hosts.has(url.hostname.toLowerCase())) return href;
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  const target = url.pathname.replace(/^\/+/, '');
  const current = rel === 'index.html' ? '' : rel.endsWith('/index.html') ? rel.slice(0, -10) : rel;
  let result;
  if (target === current && url.hash && !url.search) result = url.hash;
  else result = (target ? prefix + target : prefix || './') + url.search + url.hash;
  return result.replace(/&/g, '&amp;');
}

let filesChanged = 0;
let linksChanged = 0;
for (const file of walk(root)) {
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(/(<a\b[^>]*\bhref=)(["'])([^"']+)(\2)/gi, (all, before, quote, href) => {
    const next = relativeHref(file, href);
    if (next === href) return all;
    linksChanged++;
    return before + quote + next + quote;
  });
  if (updated !== source) {
    fs.writeFileSync(file, updated, 'utf8');
    filesChanged++;
  }
}
console.log(JSON.stringify({ filesChanged, linksChanged }));