const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const domain = 'https://www.belfastmeds.co.uk';
const version = '20260909-images-3';

const pageImages = {
  'blog/index.html': 'assets/img/blog/breadcrumb-1.webp',
  'blog/post/can-you-buy-medicine-without-a-prescription-in-the-uk.html': 'assets/img/blog/post/belfastmeds-blog-image-2.jpg',
  'blog/post/understanding-anxiety-and-sleep-treatments-a-guide-for-uk-patients-blm.html': 'assets/img/blog/post/understanding-anxiety-and-sleep-treatments-a-guide-for-uk-patients.jpg',
  'blog/post/how-to-safely-order-prescription-medicines-online-in-the-uk-blm.html': 'assets/img/blog/post/how-to-safely-purchase-prescription-medicines-online-in-uk-complete-guide.jpg',
  'blog/post/how-to-purchase-medicine-safely-belfast-meds.html': 'assets/img/blog/post/belfastmeds-blog-image-1.jpg',
  'shop/medicine/alprax-alprazolam-2-mg.html': 'assets/img/medicine/alprax-xr2.jpg',
  'shop/medicine/bromazepam-version-5.html': 'assets/img/medicine/broze.jpg',
  'shop/medicine/co-codamol.html': 'assets/img/medicine/co-codamol.jpg',
  'shop/medicine/diazepam-martin-dow-10mg.html': 'assets/img/medicine/valium.jpg',
  'shop/medicine/lorazepam-ativan-2-mg.html': 'assets/img/medicine/lorazepam.jpg',
  'shop/medicine/noctin-nitrazepam-5-mg.html': 'assets/img/medicine/noctin.jpg',
  'shop/medicine/rivotril-clonazepam-2mg.html': 'assets/img/medicine/rivotril-2.jpg',
  'shop/medicine/sedil-diazepam-5-mg.html': 'assets/img/medicine/sedil.jpg',
  'shop/medicine/zopiclone-7-5mg-version-5.html': 'assets/img/medicine/zopiclone-tablets.jpg',
  'service-area/best-online-drugstore-in-bangor.html': 'assets/img/service/safe-online-pharmacy-in-bangor.webp',
  'service-area/best-online-drugstore-in-belfast-belfastmeds-uk.html': 'assets/img/service/best-online-drugstore-in-belfast.webp',
  'service-area/best-online-drugstore-in-lisburn.html': 'assets/img/service/trusted-online-drugstore-in-lisburn.webp',
  'service-area/safe-online-drugstore-in-craigavon-northern-ireland.html': 'assets/img/service/safe-online-drugstore-in-craigavon.webp'
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'tools') return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

for (const [page, image] of Object.entries(pageImages)) {
  if (!fs.existsSync(path.join(root, page))) throw new Error(`Missing page: ${page}`);
  if (!fs.existsSync(path.join(root, image))) throw new Error(`Missing image: ${image}`);
}

let changed = 0;
for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/((?:pages\.css|pages\.js|product\.js|main\.js)\?v=)[^"' >]+/g, `$1${version}`);
  const image = pageImages[rel];
  if (image) {
    const absolute = `${domain}/${image}`;
    html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${absolute}$2`);
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${absolute}$2`);
  }
  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(JSON.stringify({ pagesWithMatchedImages: Object.keys(pageImages).length, htmlFilesChanged: changed }));
