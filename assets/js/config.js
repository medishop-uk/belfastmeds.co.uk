// Google Apps Script deployment ID or full /exec URL.
(function(){
  var value='AKfycbydYsbnXru9yp6mHRSN2vWSoK6Y7upVncG09IOoS95yC50Gj6FWdhSAS-5ecnjYuk_-';
  if(!value){window.BELFASTMEDS_DATA_API='';return}
  window.BELFASTMEDS_DATA_API=/^https:\/\/script\.google\.com\/macros\/s\//.test(value)
    ? value
    : 'https://script.google.com/macros/s/'+value.replace(/^\/+|\/+$/g,'')+'/exec';
})();
