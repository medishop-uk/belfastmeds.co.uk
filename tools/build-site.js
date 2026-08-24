const fs = require('fs');
const path = require('path');

const site = path.resolve(__dirname, '..');
const domain = 'https://www.belfastmeds.co.uk';

function files(dir, extension) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'tools' ? [] : files(full, extension);
    return full.endsWith(extension) ? [full] : [];
  });
}

function decode(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#x20;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function field(html, label) {
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] || html;
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(match => decode(match[1]));
  const row = paragraphs.find(text => text.toLowerCase().startsWith(label.toLowerCase()));
  return row ? row.slice(label.length).trim() : '';
}

function h1(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? decode(match[1]) : '';
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pageInfo(file) {
  const rel = path.relative(site, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const depth = parts.length - 1;
  const root = depth ? Array(depth).fill('..').join('/') : '.';
  let kind = 'article';
  if (rel === 'index.html') kind = 'home';
  else if (rel === 'shop/index.html') kind = 'shop-index';
  else if (rel === 'blog/index.html') kind = 'blog-index';
  else if (rel === 'about-us/index.html') kind = 'about';
  else if (rel.startsWith('shop/medicine/')) kind = 'product';
  else if (rel.startsWith('blog/post/')) kind = 'blog-post';
  else if (rel.startsWith('service-area/')) kind = 'service';
  else if (rel.startsWith('landing-page/')) kind = 'landing';
  const urlPath = rel.endsWith('/index.html') ? rel.slice(0, -10) : rel === 'index.html' ? '' : rel;
  return { rel, root, kind, canonical: `${domain}/${urlPath}` };
}

function cleanExisting(html) {
  return html
    .replace(/<!-- BELFASTMEDS:HEAD -->[\s\S]*?<!-- \/BELFASTMEDS:HEAD -->/gi, '')
    .replace(/<!-- BELFASTMEDS:BODY -->[\s\S]*?<!-- \/BELFASTMEDS:BODY -->/gi, '')
    .replace(/<meta name="google-site-verification"[^>]*>\s*/gi, '')
    .replace(/<!-- Google tag \(gtag\.js\) -->[\s\S]*?<!-- End Google Tag Manager -->/gi, '')
    .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/gi, '')
    .replace(/<meta name="viewport"[^>]*>\s*/gi, '')
    .replace(/<link rel="stylesheet" href="[^\"]*assets\/css\/(?:pages|belfast)\.css[^\"]*">\s*/gi, '')
    .replace(/<title\b[^>]*>.*?<\/title>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<script defer src="[^\"]*assets\/js\/(?:pages|config|product|commerce|site)\.js[^\"]*"[^>]*><\/script>\s*/gi, '');
}

for (const file of files(site, '.html')) {
  if (path.resolve(file) === path.resolve(path.join(site, 'index.html'))) continue;
  let html = cleanExisting(fs.readFileSync(file, 'utf8'))
    .replace(/ScotiaMeds/gi, match => match === match.toUpperCase() ? 'BELFASTMEDS' : 'BelfastMeds')
    .replace(/Scotiameds/gi, 'BelfastMeds')
    .replace(/scotiameds\.co\.uk/gi, 'belfastmeds.co.uk');
  const info = pageInfo(file);
  const title = field(html, 'Meta Title:') || field(html, 'Title:') || h1(html) || 'BelfastMeds';
  const description = field(html, 'Meta Description:') || `Read ${title} from BelfastMeds, with private UK-wide support and delivery information.`;
  const commercePage = info.kind === 'product' || info.kind === 'shop-index';
  const scripts = [
    commercePage ? `<script defer src="${info.root}/assets/js/config.js?v=20260827"></script>` : '',
    `<script defer src="${info.root}/assets/js/pages.js?v=20260827" data-root="${info.root}" data-kind="${info.kind}"></script>`,
    info.kind === 'product' ? `<script defer src="${info.root}/assets/js/product.js?v=20260827"></script>` : '',
    commercePage ? `<script defer src="${info.root}/assets/js/commerce.js?v=20260827"></script>` : '',
    `<script defer src="${info.root}/assets/js/site.js?v=20260827"></script>`
  ].join('');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: info.canonical, isPartOf: { '@type': 'WebSite', name: 'BelfastMeds', url: `${domain}/` } }).replace(/</g, '\\u003c');
  const head = `<!-- BELFASTMEDS:HEAD -->
<meta name="google-site-verification" content="fwrpbj_-hS3NYvaueZ7C3ByL_svKOLBw21_w4Hp50Do">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5DP4SN73YW"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-5DP4SN73YW');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-WWN4QZ4V');</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeAttr(title)}</title><meta name="description" content="${escapeAttr(description)}"><meta name="theme-color" content="#1C3E8D">
<link rel="canonical" href="${info.canonical}"><link rel="icon" href="${info.root}/assets/img/favicon.png">
<meta property="og:type" content="website"><meta property="og:locale" content="en_GB"><meta property="og:site_name" content="BelfastMeds"><meta property="og:title" content="${escapeAttr(title)}"><meta property="og:description" content="${escapeAttr(description)}"><meta property="og:url" content="${info.canonical}"><meta property="og:image" content="${domain}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeAttr(title)}"><meta name="twitter:description" content="${escapeAttr(description)}"><meta name="twitter:image" content="${domain}/assets/img/og.jpg">
<link rel="stylesheet" href="${info.root}/assets/css/pages.css?v=20260827">${scripts}<script type="application/ld+json">${schema}</script>
<!-- /BELFASTMEDS:HEAD -->`;
  const body = `<!-- BELFASTMEDS:BODY --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WWN4QZ4V" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript><!-- /BELFASTMEDS:BODY -->`;
  html = html.replace(/<html(?:\s[^>]*)?>/i, '<html lang="en-GB">');
  html = html.replace(/<\/head>/i, `${head}</head>`).replace(/<body([^>]*)>/i, `<body$1>${body}`);
  fs.writeFileSync(file, html, 'utf8');
}

for (const file of files(path.join(site, 'assets', 'js'), '.js')) {
  let value = fs.readFileSync(file, 'utf8')
    .replace(/SCOTIAMEDS/g, 'BELFASTMEDS')
    .replace(/ScotiaMeds/g, 'BelfastMeds')
    .replace(/Scotiameds/g, 'BelfastMeds')
    .replace(/scotiameds/g, 'belfastmeds')
    .replace(/scotiaCart/g, 'belfastCart')
    .replace(/SM-/g, 'BM-');
  fs.writeFileSync(file, value, 'utf8');
}

for (const file of files(path.join(site, 'google-apps-script'), '.gs')) {
  const value = fs.readFileSync(file, 'utf8').replace(/ScotiaMeds/g, 'BelfastMeds').replace(/scotiameds-data/g, 'belfastmeds-data');
  fs.writeFileSync(file, value, 'utf8');
}

const urls = files(site, '.html').map(pageInfo).map(item => item.canonical).sort();
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(site, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(site, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);

console.log(`Prepared ${urls.length} BelfastMeds pages.`);
