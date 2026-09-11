(function(){
'use strict';
var script=document.currentScript;
var root=script.getAttribute('data-root')||'../..';
var categories=[
 {name:'ADHD & wakefulness',slug:'adhd-and-wakefulness'},
 {name:'Anxiety & panic disorders',slug:'anxiety-and-panic-disorders'},
 {name:'Anxiety & seizure disorders',slug:'anxiety-and-seizure-disorders'},
 {name:'Moderate to severe pain',slug:'moderate-to-severe-pain'},
 {name:'Nerve pain & anxiety-related medicines',slug:'nerve-pain-and-anxiety-related-medicines'},
 {name:'Short-term sedation',slug:'short-term-sedation'},
 {name:'Sleep & insomnia medication',slug:'sleep-and-insomnia-medication'}
];
var products=[
 ['Alprax Alprazolam 2mg','alprax-alprazolam-2-mg','Anxiety & panic',20,['anxiety-and-panic-disorders']],
 ['Alprazolam Alprax 1mg','alprax-1-mg-alprazolam','Anxiety & panic',20,['anxiety-and-panic-disorders']],
 ['Rlam Alprazolam 1mg','rlam-alprazolam-1-mg','Anxiety & panic',20,['anxiety-and-panic-disorders']],
 ['Bromazepam','bromazepam-version-5','Anxiety',25,['anxiety-and-panic-disorders']],
 ['Pase Clonazepam 2mg','pase-clonazepam-2mg','Anxiety & seizures',20,['anxiety-and-seizure-disorders']],
 ['Rivotril Clonazepam 2mg','rivotril-clonazepam-2mg','Anxiety & seizures',20,['anxiety-and-seizure-disorders']],
 ['Easium Diazepam','easium-diazepam-10mg','Anxiety & sedation',50,['anxiety-and-panic-disorders','anxiety-and-seizure-disorders','short-term-sedation']],
 ['Diazepam Martin Dow 10mg','diazepam-martin-dow-10mg','Anxiety & sedation',20,['anxiety-and-panic-disorders','anxiety-and-seizure-disorders','short-term-sedation']],
 ['Sedil Diazepam 5mg','sedil-diazepam-5-mg','Anxiety & sedation',30,['anxiety-and-panic-disorders','anxiety-and-seizure-disorders','short-term-sedation']],
 ['Lorazepam Ativan 2mg','lorazepam-ativan-2-mg','Anxiety',20,['anxiety-and-panic-disorders']],
 ['Midolam Midazolam 7.5mg','midolam-midazolam-7-5-mg','Short-term sedation',20,['short-term-sedation']],
 ['Modafinil','modafinil-version-5','Wakefulness',25,['adhd-and-wakefulness']],
 ['Noctin Nitrazepam 5mg','noctin-nitrazepam-5-mg','Sleep & insomnia',20,['sleep-and-insomnia-medication']],
 ['Pregabalin Pregacare','pregabalin-pregacare-nt','Nerve pain',30,['nerve-pain-and-anxiety-related-medicines']],
 ['Zopiclone 7.5mg','zopiclone-7-5mg-version-5','Sleep & insomnia',20,['sleep-and-insomnia-medication']],
 ['Tapentadol 100mg','tapentadol-100mg','Pain management',25,['moderate-to-severe-pain']],
 ['Tramadol 100mg','tramadol-100mg','Pain management',20,['moderate-to-severe-pain']],
 ['Ritalin Alaradate 10mg','ritalin-alaradate-10mg','ADHD',40,['adhd-and-wakefulness']],
 ['Etizolam','etizolam','Anxiety & sedation',25,['anxiety-and-panic-disorders','short-term-sedation']],
 ['Co-codamol','co-codamol','Pain management',25,['moderate-to-severe-pain']],
 ['Benzit','benzit','Specialist medicine',25,[]],
 ['Clobazam','clobazam','Anxiety & seizures',25,['anxiety-and-seizure-disorders']],
 ['Miramind Mirtazapine','mirtazapine-miramind','Mental health & sleep',25,['sleep-and-insomnia-medication']],
 ['Temazepam','temazepam','Sleep & insomnia',28,['sleep-and-insomnia-medication']],
 ['Zolpidem','zolpidem','Sleep & insomnia',25,['sleep-and-insomnia-medication']]
];
function safe(value){var node=document.createElement('div');node.textContent=value;return node.innerHTML}
function currentSlug(){return location.pathname.split('/').pop().replace(/\.html$/,'')}
function categoryList(active){
 return '<details class="category-list-dropdown" open><summary>All categories</summary><nav aria-label="Medicine categories">'+categories.map(function(item){return '<a href="'+root+'/shop/category/'+item.slug+'.html"'+(item.slug===active?' aria-current="page"':'')+'>'+item.name+'<span>&rarr;</span></a>'}).join('')+'</nav></details>'
}
function cards(active){
 var items=products.filter(function(item){return item[4].indexOf(active)!==-1});
 return '<div class="category-medicine-grid">'+items.map(function(item){var url=root+'/shop/medicine/'+item[1]+'.html';return '<article class="category-medicine-card"><a class="category-product-image" href="'+url+'" aria-label="View '+safe(item[0])+'"><img src="'+root+'/assets/img/medicine-product.svg?v=20260911" alt="'+safe(item[0])+' product"></a><div><span>'+safe(item[2])+'</span><h3><a href="'+url+'">'+safe(item[0])+'</a></h3><p>Review medicine information, available pack options and safety guidance.</p><footer><small>Prices from</small><strong>&pound;'+item[3]+'</strong><a href="'+url+'" aria-label="View '+safe(item[0])+'">&rarr;</a></footer></div></article>'}).join('')+'</div>'
}
function fallbackContent(name,hasWhy,hasFaq){
 var html='';
 if(!hasWhy)html+='<section class="category-support"><h2>Why choose BelfastMeds?</h2><p>Our team provides clear product information, discreet UK-wide delivery support and help throughout the request process. Medicine requests remain subject to availability, eligibility and any required prescription checks.</p><ul><li>Clear medicine and pack information</li><li>Discreet packaging and delivery support</li><li>Private help through WhatsApp and Telegram</li><li>Responsible checks before fulfilment</li></ul></section>';
 if(!hasFaq)html+='<section class="category-faq"><h2>Frequently asked questions about '+safe(name.toLowerCase())+'</h2><h3>How do I choose a medicine in this category?</h3><p>Review the individual medicine page and discuss suitability with a qualified healthcare professional before making a request.</p><h3>Are prescription checks required?</h3><p>Where a medicine requires a prescription, availability and dispatch depend on the appropriate eligibility and prescription checks.</p><h3>Can I ask about availability or delivery?</h3><p>Yes. Contact the BelfastMeds team for current pack availability and delivery information before completing a request.</p></section>';
 return html
}
function init(){
 var active=currentSlug();
 var category=categories.find(function(item){return item.slug===active});
 if(!category)return;
 var main=document.querySelector('.page-main');
 var article=main&&main.querySelector('.article-content');
 if(!main||!article)return;
 var source=article.innerHTML;
 var plain=article.textContent.toLowerCase();
 document.body.classList.add('category-page');
 main.innerHTML='<div class="page-container"><section class="category-catalogue" aria-labelledby="category-products-title"><div class="category-section-heading"><p class="page-kicker">BROWSE THIS CATEGORY</p><h2 id="category-products-title">Relevant medicines</h2><p>Compare the medicines listed for this treatment area and open a product page for complete information.</p></div><div class="category-catalogue-row"><aside>'+categoryList(active)+'</aside><div class="category-products">'+cards(active)+'</div></div></section><article class="article-content category-long-content">'+source+fallbackContent(category.name,plain.indexOf('why choose')!==-1,plain.indexOf('faq')!==-1||plain.indexOf('frequently asked')!==-1)+'</article></div>'
}
init()
})();