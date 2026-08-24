/**
 * BelfastMeds data API.
 * Bind to the belfastmeds-data spreadsheet, run setup once, and deploy as a Web app.
 */
const ORDERS_SHEET = 'orders';
const REVIEWS_SHEET = 'reviews-ratings';
const ORDER_HEADERS = ['orderId','timestamp','channel','status','itemsJson','itemCount','subtotal','postage','total','currency','pageUrl','userAgent','utmSource','utmMedium','utmCampaign'];
const REVIEW_HEADERS = ['reviewId','timestamp','product','productName','rating','name','email','review','status'];

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#e8f3f9');
  }
  return sheet;
}
function setup() {
  const orders = sheet_(ORDERS_SHEET, ORDER_HEADERS);
  const reviews = sheet_(REVIEWS_SHEET, REVIEW_HEADERS);
  if (orders.getMaxColumns() >= 4) {
    const orderRule = SpreadsheetApp.newDataValidation().requireValueInList(['New','Contacted','Confirmed','Completed','Cancelled'],true).setAllowInvalid(false).build();
    orders.getRange(2,4,Math.max(orders.getMaxRows()-1,1),1).setDataValidation(orderRule);
  }
  if (reviews.getMaxColumns() >= 9) {
    const reviewRule = SpreadsheetApp.newDataValidation().requireValueInList(['Pending','Approved','Rejected'],true).setAllowInvalid(false).build();
    reviews.getRange(2,9,Math.max(reviews.getMaxRows()-1,1),1).setDataValidation(reviewRule);
  }
  return {ok:true,spreadsheetUrl:SpreadsheetApp.getActiveSpreadsheet().getUrl(),sheets:[ORDERS_SHEET,REVIEWS_SHEET]};
}
function doGet(e) {
  try {
    const action = String((e.parameter && e.parameter.action) || 'listReviews');
    if (action === 'health') return output_({ok:true,service:'BelfastMeds data API'});
    if (action !== 'listReviews') return output_({ok:false,error:'Unsupported action'});
    const product = String((e.parameter && e.parameter.product) || '').trim();
    const sheet = sheet_(REVIEWS_SHEET, REVIEW_HEADERS);
    if (sheet.getLastRow() < 2) return output_({ok:true,reviews:[]});
    const rows = sheet.getRange(2,1,sheet.getLastRow()-1,REVIEW_HEADERS.length).getDisplayValues();
    const reviews = rows.map(row => Object.fromEntries(REVIEW_HEADERS.map((header,index) => [header,row[index]])))
      .filter(item => item.status.toLowerCase() === 'approved' && (!product || item.product === product))
      .map(item => ({timestamp:item.timestamp,product:item.product,rating:Number(item.rating),name:item.name,review:item.review,status:item.status}));
    return output_({ok:true,reviews});
  } catch (error) {
    return output_({ok:false,error:String(error.message || error)});
  }
}
function createOrder_(value) {
  const order = value.order || {};
  const items = Array.isArray(order.items) ? order.items : [];
  if (!order.orderId || !order.channel || !items.length) return {ok:false,error:'Missing order fields'};
  const sheet = sheet_(ORDERS_SHEET, ORDER_HEADERS);
  const existing = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(String(order.orderId)).matchEntireCell(true).findNext() : null;
  if (existing) return {ok:true,orderId:order.orderId,duplicate:true};
  const itemCount = items.reduce((sum,item) => sum + Number(item.quantity || 1),0);
  sheet.appendRow([
    String(order.orderId).slice(0,80),new Date(),String(order.channel).slice(0,20),'New',JSON.stringify(items).slice(0,45000),
    itemCount,Number(order.subtotal || 0),Number(order.postage || 0),Number(order.total || 0),'GBP',
    String(order.pageUrl || '').slice(0,1000),String(value.userAgent || '').slice(0,500),
    String(order.utmSource || '').slice(0,200),String(order.utmMedium || '').slice(0,200),String(order.utmCampaign || '').slice(0,200)
  ]);
  return {ok:true,orderId:order.orderId};
}
function createReview_(value) {
  if (value.website) return {ok:true};
  const rating = Number(value.rating);
  if (!value.product || !value.name || !value.email || !value.review || rating < 1 || rating > 5) return {ok:false,error:'Missing or invalid review fields'};
  sheet_(REVIEWS_SHEET, REVIEW_HEADERS).appendRow([
    Utilities.getUuid(),new Date(),String(value.product).slice(0,100),String(value.productName || '').slice(0,150),
    rating,String(value.name).slice(0,60),String(value.email).slice(0,100),String(value.review).slice(0,1000),'Pending'
  ]);
  return {ok:true,status:'Pending'};
}
function doPost(e) {
  const lock = LockService.getDocumentLock();
  try {
    lock.waitLock(10000);
    const value = JSON.parse((e.postData && e.postData.contents) || '{}');
    const action = String(value.action || 'createReview');
    const result = action === 'createOrder' ? createOrder_(value) : action === 'createReview' ? createReview_(value) : {ok:false,error:'Unsupported action'};
    return output_(result);
  } catch (error) {
    return output_({ok:false,error:String(error.message || error)});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}