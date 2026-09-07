const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const origin = 'https://www.belfastmeds.co.uk';
const exact = new Map(Object.entries({
  '/blog/buy-medicine-online-without-prescription-uk': '/blog/post/can-you-buy-medicine-without-a-prescription-in-the-uk.html',
  '/blog/how-to-safely-order-prescription-medicines-online-in-the-uk': '/blog/post/how-to-safely-order-prescription-medicines-online-in-the-uk-blm.html',
  '/blog/modafinil-for-wakefulness-uses-dosage-and-is-it-safe': '/blog/post/modafinil-for-wakefulness-uses-dosage-is-it-safe.html',
  '/blog/natural-anxiety-remedies-what-actually-works': '/blog/post/natural-anxiety-remedies-what-actually-works.html',
  '/blog/neuropathy-causes-symptoms-and-treatment-options': '/blog/post/neuropathy-causes-symptoms-treatment-options-belfastmeds.html',
  '/blog/nhs-gphc-laws-online-pharmacies-uk': '/blog/post/nhs-gphc-law-online-pharmacy-in-the-united-kingdom-belfastmeds.html',
  '/blog/panic-attack-causes-symptoms-and-what-to-do': '/blog/',
  '/blog/purchase-medicine-safely-northern-ireland': '/blog/post/how-to-purchase-medicine-safely-belfast-meds.html',
  '/blog/understanding-anxiety-and-sleep-treatments-a-guide-for-uk-patients': '/blog/post/understanding-anxiety-and-sleep-treatments-a-guide-for-uk-patients-blm.html',
  '/service-area//trusted-drug-shop-in-northern-ireland': '/service-area/trusted-online-drug-shop-in-northern-ireland.html',
  '/shop/alprax-alprazolam-2-mg': '/shop/medicine/alprax-alprazolam-2-mg.html',
  '/shop/clonazepam-rivotril-2-mg': '/shop/medicine/rivotril-clonazepam-2mg.html',
  '/shop/diazepam-easium-10mg': '/shop/medicine/easium-diazepam-10mg.html',
  '/shop/diazepam-martin-dows-10mg': '/shop/medicine/diazepam-martin-dow-10mg.html',
  '/shop/diazepam-sedil-5mg': '/shop/medicine/sedil-diazepam-5-mg.html',
  '/shop/item/quickview/modafinil': '/shop/medicine/modafinil-version-5.html',
  '/shop/midazolam-midolam-75-mg': '/shop/medicine/midolam-midazolam-7-5-mg.html',
  '/shop/nervasin-pregabalin': '/shop/medicine/pregabalin-pregacare-nt.html',
  '/shop/nitrazepam-noctin-5mg': '/shop/medicine/noctin-nitrazepam-5-mg.html',
  '/shop/pregabalin-neurabalin-75mg': '/shop/medicine/pregabalin-pregacare-nt.html',
  '/shop/pregacare-nt-pregabalin': '/shop/medicine/pregabalin-pregacare-nt.html',
  '/shop/temazepam': '/shop/medicine/temazepam.html',
  '/shop/zopiclone-7-5mg': '/shop/medicine/zopiclone-7-5mg-version-5.html'
}));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'tools') return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : (entry.name.endsWith('.html') ? [file] : []);
  });
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&#38;/g, '&');
}

function canonicalize(value) {
  let href = decodeEntities(value);
  try {
    const parsed = new URL(href);
    if (parsed.hostname === 'www.google.com' && parsed.pathname === '/url') href = parsed.searchParams.get('q') || href;
  } catch {}
  try {
    const parsed = new URL(href, origin);
    if (parsed.hostname === 'belfastmeds.co.uk' || parsed.hostname === 'www.belfastmeds.co.uk') {
      return `${origin}${exact.get(parsed.pathname) || parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return href;
  }
}

let filesChanged = 0;
let linksChanged = 0;
for (const file of walk(root)) {
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(/(<a\b[^>]*\bhref=["'])([^"']+)(["'])/gi, (all, before, href, quote) => {
    const next = canonicalize(href);
    if (next === decodeEntities(href)) return all;
    linksChanged++;
    return `${before}${next.replace(/&/g, '&amp;')}${quote}`;
  });
  if (updated !== source) {
    fs.writeFileSync(file, updated, 'utf8');
    filesChanged++;
  }
}
console.log(JSON.stringify({ filesChanged, linksChanged }));
