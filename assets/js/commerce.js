(function(){
'use strict';
var whatsapp='https://wa.me/447438135064';
var telegram='https://t.me/BenzoAddy';
var DATA_API_URL=window.BELFASTMEDS_DATA_API||'';
var pricing={
 clonazepam:[['Pase 2 / Rnaze 2mg / Revotril 2mg',[[10,20],[15,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,595]]]],
 alprazolam:[['Alprax 2mg / Kasol 1mg / Rlam 1mg',[[10,20],[30,45],[60,70],[100,100],[300,210],[500,300],[1000,500]]],['Alprax 1mg / Alpraem 1mg',[[10,20],[30,45],[60,60],[100,85],[300,210],[500,310],[1000,495]]]],
 midazolam:[['Benquil 7.5mg',[[10,20],[30,45],[60,65],[100,100],[300,240],[500,310],[1000,500]]]],
 diazepam:[['Valium (Martin Dow) / Bensedin / Dizpam',[[10,20],[30,45],[60,70],[100,100],[300,240],[500,320],[1000,550]]],['Sedil 5mg',[[20,30],[40,50],[60,60],[100,85],[300,210],[500,350],[1000,490]]],['Easium 5mg',[[40,50],[80,90],[120,110],[320,240],[500,350],[1000,480]]]],
 lorazepam:[['2mg',[[10,20],[30,45],[60,65],[100,100],[300,210],[500,310],[1000,500]]],['3mg',[[10,30],[30,60],[60,80],[100,120],[200,200],[500,350],[1000,595]]]],
 tapentadol:[['100mg',[[10,25],[30,50],[60,75],[100,130],[200,200],[500,350],[1000,595]]],['200mg / 225mg',[[10,30],[30,60],[60,90],[100,130],[200,200],[500,350],[1000,595]]]],
 tramadol:[['100mg',[[10,20],[30,45],[60,65],[100,100],[300,225],[500,350],[1000,500]]]],
 nitrazepam:[['Noctin 5mg',[[10,20],[30,45],[60,65],[100,85],[300,195],[500,295],[1000,450]]],['Nitrazepam 10mg',[[10,30],[30,60],[60,80],[100,120],[200,190],[500,380],[1000,595]]]],
 zopiclone:[['7.5mg',[[10,20],[30,45],[60,65],[100,85],[300,195],[500,280],[1000,450]]],['10mg',[[10,20],[30,45],[60,70],[100,100],[300,210],[500,295],[1000,450]]],['20mg',[[10,30],[30,60],[60,85],[100,130],[300,240],[500,350],[1000,650]]]],
 pregabalin:[['300mg — Nervegesic / Pregagesic / Pregacare / Neurabalin',[[15,30],[30,40],[60,70],[100,85],[300,210],[500,310],[1000,450]]],['450mg',[[15,35],[30,55],[60,90],[105,130],[210,200],[510,350],[1005,595]]]],
 ritalin:[['10mg (Alaradate)',[[10,40],[30,95],[60,165],[100,250],[200,400],[500,700],[1000,1100]]]],
 etizolam:[['Standard',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]],
 modafinil:[['Modifinal',[[10,25],[30,45],[60,70],[100,100],[300,210],[500,310],[1000,450]]]],
 cocodamol:[['Standard',[[10,25],[30,45],[60,70],[100,90],[300,210],[500,310],[1000,450]]]],
 bromazepam:[['Standard',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]],
 benzit:[['Standard',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]],
 clobazam:[['Standard',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]],
 mirtazapine:[['Miramind',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]],
 temazepam:[['Standard',[[14,28],[28,42],[56,70],[100,100],[300,240],[500,350],[1000,600]]]],
 zolpidem:[['Standard',[[10,25],[30,45],[60,70],[100,100],[300,240],[500,350],[1000,600]]]]
};
var slugMap={
'alprazolam-alprax-2mg':'alprazolam','alprax-alprazolam-2-mg':'alprazolam','alprazolam-alprax-1mg':'alprazolam','alprax-1-mg-alprazolam':'alprazolam','alprazolam-rlam-1mg':'alprazolam','rlam-alprazolam-1-mg':'alprazolam','bromazepam':'bromazepam','bromazepam-version-5':'bromazepam',
'clonazepam-pase-2mg':'clonazepam','clonazepam-rivotril-2mg':'clonazepam','rivotril-clonazepam-2mg':'clonazepam','diazepam-easium-10mg':'diazepam','easium-diazepam-10mg':'diazepam','diazepam-martin-dow-10mg':'diazepam',
'diazepam-sedil-5mg':'diazepam','sedil-diazepam-5-mg':'diazepam','lorazepam-ativan-2mg':'lorazepam','lorazepam-ativan-2-mg':'lorazepam','midazolam-midolam-7-5mg':'midazolam','midolam-midazolam-7-5-mg':'midazolam','modafinil':'modafinil','modafinil-version-5':'modafinil',
'nitrazepam-noctin-5mg':'nitrazepam','noctin-nitrazepam-5-mg':'nitrazepam','pregabalin-pregacare-nt':'pregabalin','zopiclone-7-5mg':'zopiclone','zopiclone-7-5mg-version-5':'zopiclone','tapentadol-100mg':'tapentadol',
'tramadol-100mg':'tramadol','ritalin-alaradate-10mg':'ritalin','etizolam':'etizolam','co-codamol':'cocodamol','benzit':'benzit',
'clobazam':'clobazam','mirtazapine-miramind':'mirtazapine','temazepam':'temazepam','zolpidem':'zolpidem'
};
var productSlug=location.pathname.split('/').filter(Boolean).pop().replace(/\.html$/,'');
var productKey=slugMap[productSlug],variants=pricing[productKey]||pricing.benzit,selectedVariant=0,selectedPack=0;
var productName=(document.querySelector('.product-breadcrumb span:last-child')||{}).textContent||productKey;
var cart=[];
try{cart=JSON.parse(localStorage.getItem('belfastCart')||'[]')}catch(error){cart=[]}
function money(value){return '£'+Number(value).toFixed(0)}
function saveCart(){localStorage.setItem('belfastCart',JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){var count=cart.reduce(function(sum,item){return sum+Number(item.quantity||1)},0);document.querySelectorAll('[data-commerce-count]').forEach(function(node){node.textContent=count})}
function current(){return {variant:variants[selectedVariant],pack:variants[selectedVariant][1][selectedPack]}}
function renderChooser(){
 var host=document.querySelector('[data-price-chooser]');if(!host)return;var value=current();
 host.innerHTML='<label class="commerce-label" for="product-variant">Choose variant</label><select id="product-variant" class="commerce-select">'+variants.map(function(item,index){return '<option value="'+index+'" '+(index===selectedVariant?'selected':'')+'>'+item[0]+'</option>'}).join('')+'</select><span class="commerce-label">Choose pack</span><div class="tier-grid">'+value.variant[1].map(function(pack,index){return '<button type="button" class="tier-option '+(index===selectedPack?'active':'')+'" data-tier="'+index+'"><span>'+pack[0]+' pcs</span><strong>'+money(pack[1])+'</strong></button>'}).join('')+'</div><div class="selected-price"><span>Selected price</span><strong>'+money(value.pack[1])+'</strong></div><button class="page-cta add-basket" type="button" data-add-basket>Add to basket</button>';
 document.querySelector('#product-variant').addEventListener('change',function(event){selectedVariant=Number(event.target.value);selectedPack=0;renderChooser()});
 document.querySelectorAll('[data-tier]').forEach(function(button){button.addEventListener('click',function(){selectedPack=Number(button.getAttribute('data-tier'));renderChooser()})});
 document.querySelector('[data-add-basket]').addEventListener('click',addBasket)
}
function addBasket(){
 var value=current(),key=productSlug+'-'+selectedVariant+'-'+selectedPack,found=cart.find(function(item){return item.key===key});
 if(found)found.quantity=Number(found.quantity||1)+1;else cart.push({key:key,slug:productSlug,name:productName,type:value.variant[0],pieces:value.pack[0],price:value.pack[1],quantity:1});
 saveCart();openCart();if(typeof window.gtag==='function')window.gtag('event','add_to_cart',{currency:'GBP',value:value.pack[1],items:[{item_id:productSlug,item_name:productName,item_variant:value.variant[0],price:value.pack[1],quantity:1}]})
}
function orderMessage(order,channel){return 'Hello BelfastMeds, my request reference is '+order.orderId+'.\n\n'+order.items.map(function(item){return '• '+item.name+' — '+item.type+', '+item.pieces+' pcs × '+item.quantity+' ('+money(item.price*item.quantity)+')'}).join('\n')+'\n\nMedicine total: '+money(order.subtotal)+'\nPostage: '+money(order.postage)+'\nTotal: '+money(order.total)+'\n\nPlease confirm availability and next steps.'}
function newOrder(channel){
 var postageSelect=document.querySelector('#commerce-postage'),postage=Number(postageSelect?postageSelect.value:12),subtotal=cart.reduce(function(sum,item){return sum+Number(item.price)*Number(item.quantity||1)},0);
 return {orderId:'BM-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),timestamp:new Date().toISOString(),channel:channel,status:'New',items:cart,subtotal:subtotal,postage:postage,total:subtotal+postage,currency:'GBP',pageUrl:location.href,utmSource:new URLSearchParams(location.search).get('utm_source')||'',utmMedium:new URLSearchParams(location.search).get('utm_medium')||'',utmCampaign:new URLSearchParams(location.search).get('utm_campaign')||''}
}
async function checkout(channel){
 var status=document.querySelector('[data-checkout-status]');if(!cart.length)return;
 if(!DATA_API_URL){var directOrder=newOrder(channel),directTarget=channel==='whatsapp'?whatsapp+'?text='+encodeURIComponent(orderMessage(directOrder,channel)):telegram;location.href=directTarget;return}
 var order=newOrder(channel);status.textContent='Saving your request securely…';document.querySelectorAll('[data-checkout]').forEach(function(button){button.disabled=true});
 try{
  var controller=new AbortController(),timer=setTimeout(function(){controller.abort()},12000);
  var response=await fetch(DATA_API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'createOrder',order:order,userAgent:navigator.userAgent}),signal:controller.signal});clearTimeout(timer);
  var result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Could not save request');
  localStorage.removeItem('belfastCart');cart=[];if(typeof window.gtag==='function')window.gtag('event','purchase',{transaction_id:order.orderId,currency:'GBP',value:order.total,shipping:order.postage,items:order.items.map(function(item){return {item_id:item.slug||item.key,item_name:item.name,item_variant:item.type,price:item.price,quantity:item.quantity}})});
  var target=channel==='whatsapp'?whatsapp+'?text='+encodeURIComponent(orderMessage(order,channel)):telegram;location.href=target
 }catch(error){status.textContent='We could not save your request. Please try again.';document.querySelectorAll('[data-checkout]').forEach(function(button){button.disabled=false})}
}
function renderCart(){
 var items=document.querySelector('[data-commerce-items]'),footer=document.querySelector('[data-commerce-footer]');if(!items||!footer)return;
 if(!cart.length){items.innerHTML='<div class="commerce-empty"><h3>Your basket is empty</h3><p>Select a variant and pack to begin.</p></div>';footer.innerHTML='';return}
 items.innerHTML=cart.map(function(item,index){return '<article class="commerce-item"><span>'+item.quantity+'</span><div><h3>'+item.name+'</h3><p>'+item.type+' · '+item.pieces+' pcs</p><button type="button" data-remove-item="'+index+'">Remove</button></div><strong>'+money(item.price*item.quantity)+'</strong></article>'}).join('');
 var subtotal=cart.reduce(function(sum,item){return sum+Number(item.price)*Number(item.quantity||1)},0);
 footer.innerHTML='<div class="commerce-total"><span>Medicine total</span><strong>'+money(subtotal)+'</strong></div><label class="commerce-postage">Postage<select id="commerce-postage"><option value="12">Regular — £12</option><option value="15">Saturday Special — from £15</option></select></label><p class="commerce-postage-note">Saturday Special Delivery is £15–£20. Our team confirms any difference before completion.</p><div class="commerce-checkout"><button type="button" class="page-cta" data-checkout="whatsapp">Continue on WhatsApp</button><button type="button" class="page-cta secondary" data-checkout="telegram">Continue on Telegram</button></div><p class="checkout-status" data-checkout-status role="status"></p>';
 document.querySelectorAll('[data-remove-item]').forEach(function(button){button.addEventListener('click',function(){cart.splice(Number(button.getAttribute('data-remove-item')),1);saveCart()})});
 document.querySelectorAll('[data-checkout]').forEach(function(button){button.addEventListener('click',function(){checkout(button.getAttribute('data-checkout'))})})
}
function openCart(){document.querySelector('.commerce-drawer').classList.add('open');document.querySelector('.commerce-overlay').classList.add('open');document.body.classList.add('drawer-open')}
function closeCart(){document.querySelector('.commerce-drawer').classList.remove('open');document.querySelector('.commerce-overlay').classList.remove('open');document.body.classList.remove('drawer-open')}
function init(){
 document.querySelectorAll('.rx-badge,.rx-callout').forEach(function(node){node.remove()});
 document.querySelectorAll('.spec-list div').forEach(function(row){if((row.querySelector('dt')||{}).textContent==='Prescription')row.remove()});
 var actions=document.querySelector('.page-actions');
 if(actions&&!document.querySelector('[data-commerce-open]')){var basket=document.createElement('button');basket.type='button';basket.className='commerce-basket';basket.setAttribute('data-commerce-open','');basket.innerHTML='Basket <b data-commerce-count>0</b>';actions.insertBefore(basket,actions.firstChild)}
 if(!document.querySelector('.commerce-drawer'))document.body.insertAdjacentHTML('beforeend','<div class="commerce-overlay"></div><aside class="commerce-drawer" aria-label="Medicine basket"><div class="commerce-head"><div><p>YOUR REQUEST</p><h2>Medicine basket</h2></div><button type="button" data-commerce-close aria-label="Close basket">×</button></div><div class="commerce-items" data-commerce-items></div><div class="commerce-footer" data-commerce-footer></div></aside>');
 document.querySelector('[data-commerce-open]').addEventListener('click',openCart);document.querySelector('[data-commerce-close]').addEventListener('click',closeCart);document.querySelector('.commerce-overlay').addEventListener('click',closeCart);
 renderCart();updateCount();
 var summary=document.querySelector('.product-summary');if(!summary)return;
 document.querySelectorAll('.product-price,.product-request-row,.telegram-product-link').forEach(function(node){node.remove()});
 var assurance=document.querySelector('.product-assurance'),chooser=document.createElement('div');chooser.className='price-chooser';chooser.setAttribute('data-price-chooser','');summary.insertBefore(chooser,assurance);
 renderChooser()
}
init()
})();
