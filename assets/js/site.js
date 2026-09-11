(function(){
'use strict';
var slugs={clonazepam:'clonazepam-pase-2mg',alprazolam:'alprazolam-alprax-2mg',midazolam:'midazolam-midolam-7-5mg',diazepam:'diazepam-martin-dow-10mg',lorazepam:'lorazepam-ativan-2mg',tapentadol:'tapentadol-100mg',tramadol:'tramadol-100mg',nitrazepam:'nitrazepam-noctin-5mg',zopiclone:'zopiclone-7-5mg',pregabalin:'pregabalin-pregacare-nt',ritalin:'ritalin-alaradate-10mg',etizolam:'etizolam',modifinal:'modafinil',cocodamol:'co-codamol',bromazepam:'bromazepam',benzit:'benzit',clobazam:'clobazam',mirtazapine:'mirtazapine-miramind',temazepam:'temazepam',zolpidem:'zolpidem'};
function analytics(name,url){if(typeof window.gtag==='function'){window.gtag('event',name,{link_url:url,transport_type:'beacon'})}else{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,link_url:url})}}
document.querySelectorAll('.medicine-card').forEach(function(card){var action=card.querySelector('[data-product]');if(!action)return;var product=action.getAttribute('data-product'),slug=slugs[product];if(!slug)return;var href='shop/medicine/'+slug,name=(card.querySelector('h3')||{}).textContent||'medicine';var top=card.querySelector('.medicine-icon');if(top){var image=document.createElement('a');image.className='medicine-image-link';image.href=href;image.setAttribute('aria-label','View '+name);image.innerHTML='<img src="assets/img/medicine-product.svg?v=20260911" alt="'+name+'">';top.replaceWith(image)}var heading=card.querySelector('h3');if(heading){var title=document.createElement('a');title.href=href;title.textContent=heading.textContent;heading.textContent='';heading.appendChild(title)}var button=document.createElement('a');button.className='medicine-action';button.href=href;button.setAttribute('aria-label','View '+name);button.textContent='→';action.replaceWith(button)});
document.querySelectorAll('.shop-card').forEach(function(card){var target=card.querySelector('.shop-card-footer a');if(!target)return;var href=target.getAttribute('href'),heading=card.querySelector('h2'),art=card.querySelector('.card-art');if(heading&&!heading.querySelector('a')){var title=document.createElement('a');title.href=href;title.textContent=heading.textContent;heading.textContent='';heading.appendChild(title)}if(art&&art.tagName!=='A'){var image=document.createElement('a');image.className='card-art product-card-art';image.href=href;image.setAttribute('aria-label','View '+(heading?heading.textContent:'medicine'));image.innerHTML='<img src="'+(location.pathname.indexOf('/shop/')>-1?'../':'')+'assets/img/medicine-product.svg?v=20260911" alt="'+(heading?heading.textContent:'Medicine')+'">';art.replaceWith(image)}});
document.querySelectorAll('.page-nav a,.page-mobile-nav a').forEach(function(link){if(link.textContent.trim()==='Health guides')link.textContent='Blog';if(link.textContent.trim()==='Treatments')link.textContent='Categories'});
document.addEventListener('click',function(event){var link=event.target.closest('a[href]');if(!link)return;if(link.href.indexOf('wa.me/')>-1)analytics('whatsapp_click',link.href);if(link.href.indexOf('t.me/')>-1)analytics('telegram_click',link.href)});
var dataApi=window.BELFASTMEDS_DATA_API||'';
function homeMoney(value){return '£'+Number(value).toFixed(0)}
function homeOrderMessage(order){return 'Hello BelfastMeds, my request reference is '+order.orderId+'.\n\n'+order.items.map(function(item){return '• '+item.name+' — '+item.type+', '+item.pieces+' pcs × '+item.quantity+' ('+homeMoney(item.price*item.quantity)+')'}).join('\n')+'\n\nMedicine total: '+homeMoney(order.subtotal)+'\nPostage: '+homeMoney(order.postage)+'\nTotal: '+homeMoney(order.total)+'\n\nPlease confirm availability and next steps.'}
function enhanceHomeCart(){var footer=document.querySelector('#cart-footer'),buttons=footer&&footer.querySelector('.checkout-buttons');if(!buttons||footer.querySelector('#home-postage'))return;var label=document.createElement('label');label.className='home-postage-select';label.innerHTML='Postage<select id="home-postage"><option value="12">Regular — £12</option><option value="15">Saturday Special — from £15</option></select>';buttons.parentNode.insertBefore(label,buttons)}
async function saveHomeCheckout(event,link){event.preventDefault();var status=document.querySelector('#home-checkout-status');if(!status){status=document.createElement('p');status.id='home-checkout-status';status.className='postage-note';link.closest('.checkout-buttons').after(status)}if(!dataApi){status.textContent='Checkout storage is not configured yet. Add the Apps Script /exec URL in assets/js/config.js.';return}var items=[];try{items=JSON.parse(localStorage.getItem('belfastCart')||'[]')}catch(error){}if(!items.length)return;var channel=link.href.indexOf('wa.me/')>-1?'whatsapp':'telegram',postage=Number((document.querySelector('#home-postage')||{value:12}).value),subtotal=items.reduce(function(sum,item){return sum+Number(item.price)*Number(item.quantity||1)},0),order={orderId:'BM-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),timestamp:new Date().toISOString(),channel:channel,status:'New',items:items,subtotal:subtotal,postage:postage,total:subtotal+postage,currency:'GBP',pageUrl:location.href,utmSource:new URLSearchParams(location.search).get('utm_source')||'',utmMedium:new URLSearchParams(location.search).get('utm_medium')||'',utmCampaign:new URLSearchParams(location.search).get('utm_campaign')||''};status.textContent='Saving your request securely…';try{var controller=new AbortController(),timer=setTimeout(function(){controller.abort()},12000),response=await fetch(dataApi,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'createOrder',order:order,userAgent:navigator.userAgent}),signal:controller.signal});clearTimeout(timer);var result=await response.json();if(!response.ok||!result.ok)throw new Error();localStorage.removeItem('belfastCart');if(typeof window.gtag==='function')window.gtag('event','purchase',{transaction_id:order.orderId,currency:'GBP',value:order.total,shipping:order.postage});location.href=channel==='whatsapp'?'https://wa.me/447438135064?text='+encodeURIComponent(homeOrderMessage(order)):'https://t.me/BenzoAddy'}catch(error){status.textContent='We could not save your request. Please try again.'}}
enhanceHomeCart();var cartFooter=document.querySelector('#cart-footer');if(cartFooter)new MutationObserver(enhanceHomeCart).observe(cartFooter,{childList:true,subtree:true});
document.addEventListener('click',function(event){var link=event.target.closest('.checkout-buttons a');if(link)saveHomeCheckout(event,link)});
})();
(function(){
'use strict';
var scriptPath=document.currentScript?new URL(document.currentScript.src).pathname:'/assets/js/site.js';
var sitePath=scriptPath.replace(/\/assets\/js\/site\.js$/,'');
var base=location.origin+sitePath;
var categories=[
 ['ADHD & wakefulness','adhd-and-wakefulness.html'],
 ['Anxiety & panic disorders','anxiety-and-panic-disorders.html'],
 ['Anxiety & seizure disorders','anxiety-and-seizure-disorders.html'],
 ['Moderate to severe pain','moderate-to-severe-pain.html'],
 ['Nerve pain & anxiety-related medicines','nerve-pain-and-anxiety-related-medicines.html'],
 ['Short-term sedation','short-term-sedation.html'],
 ['Sleep & insomnia medication','sleep-and-insomnia-medication.html']
];
function categoryLinks(){return categories.map(function(item){return '<a href="'+base+'/shop/category/'+item[1]+'">'+item[0]+'</a>'}).join('')}
function desktopMenu(){
 var path=location.pathname;
 function active(section){return path.indexOf(section)!==-1?' class="active"':''}
 return '<div class="nav-categories"><button type="button" aria-expanded="false">All Categories <span aria-hidden="true">&#8964;</span></button><div class="category-dropdown">'+categoryLinks()+'</div></div>'+
 '<a'+active('/shop/')+' href="'+base+'/shop/">Shop</a>'+
 '<a'+active('/blog/')+' href="'+base+'/blog/">Blog</a>'+
 '<a'+active('/about-us/')+' href="'+base+'/about-us/">About Us</a>'+
 '<a href="'+base+'/#contact">Contact Us</a>'
}
function mobileMenu(){
 return '<details class="mobile-category-menu"><summary>All Categories</summary><div>'+categoryLinks()+'</div></details>'+
 '<a href="'+base+'/shop/">Shop</a><a href="'+base+'/blog/">Blog</a><a href="'+base+'/about-us/">About Us</a><a href="'+base+'/#contact">Contact Us</a>'
}
document.querySelectorAll('.desktop-nav,.page-nav').forEach(function(nav){nav.innerHTML=desktopMenu()});
document.querySelectorAll('.mobile-nav,.page-mobile-nav').forEach(function(nav){nav.innerHTML=mobileMenu()});
document.querySelectorAll('.nav-categories>button').forEach(function(button){
 button.addEventListener('click',function(){
  var menu=button.parentElement;
  var open=!menu.classList.contains('open');
  document.querySelectorAll('.nav-categories.open').forEach(function(item){item.classList.remove('open');item.querySelector('button').setAttribute('aria-expanded','false')});
  menu.classList.toggle('open',open);
  button.setAttribute('aria-expanded',String(open))
 })
});
document.addEventListener('click',function(event){
 if(event.target.closest('.nav-categories'))return;
 document.querySelectorAll('.nav-categories.open').forEach(function(item){item.classList.remove('open');item.querySelector('button').setAttribute('aria-expanded','false')})
});
document.addEventListener('keydown',function(event){
 if(event.key!=='Escape')return;
 document.querySelectorAll('.nav-categories.open').forEach(function(item){item.classList.remove('open');item.querySelector('button').setAttribute('aria-expanded','false')})
});
})();