(function(){
'use strict';
var whatsapp='https://wa.me/447438135064';
var telegram='https://t.me/BenzoAddy';
var REVIEW_API_URL=window.BELFASTMEDS_DATA_API||'';
var catalog={
'alprax-alprazolam-2-mg':['Alprax Alprazolam 2mg','Alprax','Torrent Pharmaceuticals','Anxiety & panic',20],
'alprax-1-mg-alprazolam':['Alprazolam Alprax 1mg','Alprax','Torrent Pharmaceuticals','Anxiety & panic',20],
'rlam-alprazolam-1-mg':['Rlam Alprazolam 1mg','Rlam','Arrios Pharma','Anxiety & panic',20],
'bromazepam-version-5':['Bromazepam','Bromazepam','Verified manufacturer','Short-term anxiety',25],
'pase-clonazepam-2mg':['Pase Clonazepam 2mg','Pase','Verified manufacturer','Anxiety & seizures',20],
'rivotril-clonazepam-2mg':['Rivotril Clonazepam 2mg','Rivotril','Roche','Anxiety & seizures',20],
'easium-diazepam-10mg':['Easium Diazepam','Easium','Verified manufacturer','Anxiety & sedative',50],
'diazepam-martin-dow-10mg':['Diazepam Martin Dow 10mg','Martin Dow','Martin Dow','Anxiety & sedative',20],
'sedil-diazepam-5-mg':['Sedil Diazepam 5mg','Sedil','Square Pharmaceuticals','Anxiety & sedative',30],
'lorazepam-ativan-2-mg':['Lorazepam Ativan 2mg','Ativan','Verified manufacturer','Short-term anxiety',20],
'midolam-midazolam-7-5-mg':['Midolam Midazolam 7.5mg','Midolam','Verified manufacturer','Sedation',20],
'modafinil-version-5':['Modafinil','Modafinil','','Wakefulness',25],
'noctin-nitrazepam-5-mg':['Noctin Nitrazepam 5mg','Noctin','Verified manufacturer','Sleep & insomnia',20],
'pregabalin-pregacare-nt':['Pregabalin Pregacare','Pregacare','Verified manufacturer','Nerve pain',30],
'zopiclone-7-5mg-version-5':['Zopiclone 7.5mg','Zopiclone','Verified manufacturer','Sleep & insomnia',20],
'tapentadol-100mg':['Tapentadol 100mg','Tapentadol','Verified manufacturer','Pain management',25],
'tramadol-100mg':['Tramadol 100mg','Tramadol','Verified manufacturer','Pain management',20],
'ritalin-alaradate-10mg':['Ritalin Alaradate 10mg','Alaradate','Verified manufacturer','ADHD & wakefulness',40],
'etizolam':['Etizolam','Etizolam','Verified manufacturer','Anxiety & sedative',25],
'co-codamol':['Co-codamol','Co-codamol','Verified manufacturer','Pain management',25],
'benzit':['Benzit','Benzit','Verified manufacturer','Specialist medicine',25],
'clobazam':['Clobazam','Clobazam','Verified manufacturer','Anxiety & seizures',25],
'mirtazapine-miramind':['Miramind Mirtazapine','Miramind','Verified manufacturer','Mental health & sleep',25],
'temazepam':['Temazepam','Temazepam','Verified manufacturer','Sleep & insomnia',28],
'zolpidem':['Zolpidem','Zolpidem','Verified manufacturer','Sleep & insomnia',25]
};
function text(value){return String(value||'').replace(/\s+/g,' ').trim()}
function slug(){return location.pathname.split('/').filter(Boolean).pop().replace(/\.html$/,'')}
function field(label,scope){var nodes=scope.querySelectorAll('li,p');for(var i=0;i<nodes.length;i++){var value=text(nodes[i].textContent);if(value.toLowerCase().indexOf(label.toLowerCase()+':')===0)return text(value.slice(value.indexOf(':')+1))}return ''}
function stars(value){var html='<span class="review-stars" aria-label="'+value+' out of 5 stars">';for(var i=1;i<=5;i++)html+='<span class="'+(i<=value?'filled':'')+'">\u2605</span>';return html+'</span>'}
function safe(value){var node=document.createElement('div');node.textContent=value||'';return node.innerHTML}
function message(name,qty){return encodeURIComponent('Hello BelfastMeds, I would like to request '+name+'. Quantity: '+qty+'. Please confirm available packs, prescription requirements and delivery options.')}
function spec(brand,manufacturer,vendor,category){return '<dl class="spec-list"><div><dt>Brand name</dt><dd>'+safe(brand)+'</dd></div><div><dt>Manufacturer</dt><dd>'+safe(manufacturer)+'</dd></div><div><dt>Vendor</dt><dd>'+safe(vendor)+'</dd></div><div><dt>Category</dt><dd>'+safe(category)+'</dd></div><div><dt>Prescription</dt><dd>Required</dd></div></dl>'}
function setTab(name){document.querySelectorAll('[data-product-tab]').forEach(function(button){var active=button.getAttribute('data-product-tab')===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});document.querySelectorAll('[data-product-panel]').forEach(function(panel){panel.classList.toggle('active',panel.getAttribute('data-product-panel')===name)})}
function key(productSlug){return 'belfastReviews:'+productSlug}
function displayReviews(items){var list=document.querySelector('[data-review-list]');if(!list)return;var approved=(items||[]).filter(function(item){return !item.status||String(item.status).toLowerCase()==='approved'});if(!approved.length)return;list.innerHTML=approved.map(function(item){return '<article class="review-item">'+stars(Number(item.rating))+'<h3>'+safe(item.name||'Customer')+'</h3><time>'+safe(item.timestamp?new Date(item.timestamp).toLocaleDateString('en-GB'):'')+'</time><p>'+safe(item.review)+'</p></article>'}).join('')}
function loadReviews(productSlug){var local=[];try{local=JSON.parse(localStorage.getItem(key(productSlug))||'[]')}catch(error){}displayReviews(local);if(!REVIEW_API_URL)return;fetch(REVIEW_API_URL+'?action=listReviews&product='+encodeURIComponent(productSlug)).then(function(response){return response.json()}).then(function(data){displayReviews(Array.isArray(data)?data:(data.reviews||[]))}).catch(function(){})}
function submitReview(form,productSlug,productName){var status=form.querySelector('.review-status');var payload={};new FormData(form).forEach(function(value,name){payload[name]=value});if(payload.website)return;payload.product=productSlug;payload.productName=productName;payload.timestamp=new Date().toISOString();payload.status=REVIEW_API_URL?'Pending':'Approved';status.textContent='Submitting your review…';form.querySelector('button[type="submit"]').disabled=true;var done=function(message){status.textContent=message;form.reset();form.querySelector('button[type="submit"]').disabled=false};if(REVIEW_API_URL){fetch(REVIEW_API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)}).then(function(response){if(!response.ok)throw new Error();done('Thank you. Your review was submitted for moderation.')}).catch(function(){status.textContent='We could not submit your review. Please try again.';form.querySelector('button[type="submit"]').disabled=false})}else{var items=[];try{items=JSON.parse(localStorage.getItem(key(productSlug))||'[]')}catch(error){}items.unshift(payload);localStorage.setItem(key(productSlug),JSON.stringify(items));displayReviews(items);done('Thank you. Your review has been saved.')}}
function init(){
 var pageSlug=slug(),defaults=catalog[pageSlug]||['Prescription medicine','See product information','Verified manufacturer','Prescription medicine',20];
 var article=document.querySelector('.article-content'),main=document.querySelector('.page-main'),hero=document.querySelector('.page-hero');
 if(!article||!main)return;
 var process=article.querySelector('.order-process');if(process)process.remove();var sourceRx=article.querySelector('.rx-callout');if(sourceRx)sourceRx.remove();
 var title=text(hero&&hero.querySelector('h1')?hero.querySelector('h1').textContent:defaults[0]);
 var lead=text(hero&&hero.querySelector('.page-hero-lead')?hero.querySelector('.page-hero-lead').textContent:'Review information, availability and prescription requirements for '+defaults[0]+'.');
 var brand=field('Brand Name',article)||defaults[1],manufacturer=field('Manufacturer',article)||defaults[2],vendor=field('Vendor',article)||'BelfastMeds',category=field('Categories',article)||field('Category',article)||defaults[3];
 article.querySelectorAll('ul').forEach(function(list){if(/brand name:|manufacturer:|vendor:|categories?:/i.test(text(list.textContent)))list.remove()});
 var openingParagraph=article.querySelector('p');
 if(openingParagraph&&text(openingParagraph.textContent).toLowerCase()===text(lead).toLowerCase())openingParagraph.remove();
 var description=article.innerHTML,details=spec(brand,manufacturer,vendor,category);
 var ratingInputs='';for(var rating=5;rating>=1;rating--)ratingInputs+='<input type="radio" name="rating" id="rating-'+rating+'" value="'+rating+'" '+(rating===5?'required':'')+'><label for="rating-'+rating+'" title="'+rating+' stars">\u2605</label>';
 var html='<main class="product-page" id="page-content"><div class="page-container"><nav class="product-breadcrumb" aria-label="Breadcrumb"><a href="'+root+'/">Home</a><span>›</span><a href="'+root+'/shop/">Shop</a><span>›</span><span>'+safe(defaults[0])+'</span></nav><section class="product-overview"><div class="product-gallery"><div class="product-main-image"><img src="'+root+'/assets/img/medicine-product.svg" alt="'+safe(defaults[0])+'"></div><p>Product imagery is for presentation purposes. Packaging may vary.</p></div><div class="product-summary"><span class="rx-badge">PRESCRIPTION REQUIRED</span><h1>'+safe(title)+'</h1><div class="rating-summary">'+stars(5)+' <a href="#product-reviews" data-open-review-tab>Read or write a review</a></div><p class="product-lead">'+safe(lead)+'</p>'+details+'<div class="product-price"><small>Price from</small><strong>£'+defaults[4]+'</strong><span>Pack options confirmed by our team</span></div><div class="product-request-row"><div class="quantity-picker" aria-label="Quantity"><button type="button" data-qty-minus aria-label="Decrease quantity">−</button><input id="product-qty" type="number" min="1" max="99" value="1" aria-label="Quantity"><button type="button" data-qty-plus aria-label="Increase quantity">+</button></div><a class="page-cta product-whatsapp" href="'+whatsapp+'?text='+message(defaults[0],1)+'" target="_blank" rel="noopener">Contact on WhatsApp</a></div><a class="telegram-product-link" href="'+telegram+'" target="_blank" rel="noopener">Continue on Telegram →</a><div class="product-assurance"><span>✓ Discreet packaging</span><span>✓ UK-wide delivery</span><span>✓ Prescription checks</span></div></div></section><section class="product-information"><div class="product-tabs" role="tablist"><button class="active" role="tab" aria-selected="true" data-product-tab="description">Description & FAQs</button><button role="tab" aria-selected="false" data-product-tab="specifications">Specifications</button><button role="tab" aria-selected="false" data-product-tab="reviews">Reviews & ratings</button></div><div class="product-panel active article-content" data-product-panel="description">'+description+'</div><div class="product-panel" data-product-panel="specifications">'+details+'<div class="rx-callout"><b>Rx</b><p><strong>Prescription required.</strong><br>Availability and dispatch are subject to eligibility, prescription and stock checks.</p></div></div><div class="product-panel" id="product-reviews" data-product-panel="reviews"><div class="reviews-layout"><div><p class="page-kicker">CUSTOMER FEEDBACK</p><h2>Reviews and ratings</h2><div class="review-list" data-review-list><p class="review-empty">No approved reviews yet. Be the first to share your experience.</p></div></div><form class="review-form" data-review-form><h2>Write a review</h2><label>Your rating<span class="rating-input">'+ratingInputs+'</span></label><label>Name<input name="name" maxlength="60" required autocomplete="name"></label><label>Email<input name="email" type="email" maxlength="100" required autocomplete="email"><small>Your email will not be published.</small></label><label>Review<textarea name="review" rows="5" minlength="10" maxlength="1000" required></textarea></label><input type="text" name="website" class="review-honeypot" tabindex="-1" autocomplete="off"><button class="page-cta" type="submit">Submit review</button><p class="review-status" role="status"></p></form></div></div></section></div></main>';
 if(hero)hero.remove();main.outerHTML=html;
 document.querySelectorAll('[data-product-tab]').forEach(function(button){button.addEventListener('click',function(){setTab(button.getAttribute('data-product-tab'))})});
 document.querySelector('[data-open-review-tab]').addEventListener('click',function(event){event.preventDefault();setTab('reviews');document.querySelector('#product-reviews').scrollIntoView({behavior:'smooth'})});
 var qty=document.querySelector('#product-qty'),wa=document.querySelector('.product-whatsapp');
 function updateQty(){qty.value=Math.min(99,Math.max(1,Number(qty.value)||1));wa.href=whatsapp+'?text='+message(defaults[0],qty.value)}
 document.querySelector('[data-qty-minus]').addEventListener('click',function(){qty.value=Number(qty.value)-1;updateQty()});
 document.querySelector('[data-qty-plus]').addEventListener('click',function(){qty.value=Number(qty.value)+1;updateQty()});qty.addEventListener('change',updateQty);
 document.querySelector('[data-review-form]').addEventListener('submit',function(event){event.preventDefault();submitReview(event.currentTarget,pageSlug,defaults[0])});
 loadReviews(pageSlug)
}
init()
})();
