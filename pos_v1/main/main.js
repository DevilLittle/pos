'use strict';

//#No.1
function getFormattedTags(tags) {

  return tags.map((tag)=>{
      if(tag.includes('-')){
    let temps=tag.split('-');
    return {barcode:temps[0],count:parseInt(temps[1])};
  }else {
    return {barcode:tag,count:1};
  }
});
}

//#No.2
function _getExistElementByBarcodes(array,barcode) {
  return array.find((countItem)=>{
      return countItem.barcode===barcode;
})
}

function getCountedItems(formattedTags) {
  let result=[];

  formattedTags.map((formattedTag)=>{
    let countItem=_getExistElementByBarcodes(result,formattedTag.barcode);
  if(countItem){
    countItem.count+=formattedTag.count
  }else {
    // result.push({barcode:formattedTag.barcode,count:formattedTag.count});
    result.push(formattedTag);
  }
})
  return result;
}
//#No.3
function buildCartItems(countedItems,allItems) {
  // console.log(allItems);
  return countedItems.map((countedItem)=>{
      let item=_getExistElementByBarcodes(allItems,countedItem.barcode);

  return {
    barcode:item.barcode,
    name:item.name,
    unit:item.unit,
    price:item.price,
    count:countedItem.count
  }
})
}

//No.4
function _fixPrice(number) {
  return parseFloat(number.toFixed(2));
}
function buildPromotedItems(cartItems,promotions) {
  let currentPromotion=promotions.find((promotion)=>{
      return promotion;
})
  let saved=0;
  let hasPromoted=false;
  return cartItems.map((cartItem)=>{
      let totalPrices=cartItem.count*cartItem.price;

  for(let barcode of currentPromotion.barcodes){
    if(cartItem.barcode===barcode){
      hasPromoted=true;
    }
  }

  if(currentPromotion.type==='BUY_TWO_GET_ONE_FREE'&&hasPromoted){
    let savedCount=Math.floor(cartItem.count/3);
    saved=cartItem.price*savedCount;
  }

  let payPrice=totalPrices-saved;
  return Object.assign({},cartItem,{payPrice,saved:_fixPrice(saved)});
})

}

//#No.5
function calculateTotalPrices(promotedItems) {
  let result={
    totalPayPrice:0,
    totalSaved:0
  }

  promotedItems.map((promotedItem)=>{
    result.totalPayPrice+=promotedItem.payPrice;
  result.totalSaved+=promotedItem.saved;
});

  return result;
}
//#No.6
function buildReceipt(promotedItems,totalPrices) {
  let receiptItem=[];

  promotedItems.map((promotedItem)=>{
    receiptItem.push({
    name:promotedItem.name,
    unit:promotedItem.unit,
    price:promotedItem.price,
    count:promotedItem.count,
    payPrice:promotedItem.payPrice
  });
})
  return {
    receiptItem,
    totalPayPrice:totalPrices.totalPayPrice,
    totalSaved:totalPrices.totalSaved
  }
}

//#No.7
function buildReceiptString(receiptModel) {
  let totalPayPrice=receiptModel.totalPayPrice;

  let totalSaved=receiptModel.totalSaved;
  let receiptItemsString='';

  receiptModel.receiptItem.map((receiptItems)=>{
    receiptItemsString+=`名称：${receiptItems.name},数量：${receiptItems.count}${receiptItems.unit},单价：${receiptItems.price.toFixed(2)},小计：${receiptItems.payPrice.toFixed(2)}`;
  receiptItemsString+="\n";
});

  const result=`***<没钱赚商店>收据***
${receiptItemsString}----------------------
总计：${totalPayPrice.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;

  return result;

}

//No.main
function prinReceipt(tags) {
  let formattedTags=getFormattedTags(tags);
  // console.log(formattedTags);
  let countedItems=getCountedItems(formattedTags);
  // console.log(countedItems);
  let allItems=loadAllItems();
  let cartItems=buildCartItems(countedItems,allItems);
  // console.log(cartItems);
  let promotions=loadPromotions();
  let promotedItems=buildPromotedItems(cartItems,promotions);
  // console.log(promotedItems);
  let totalPrices=calculateTotalPrices(promotedItems);
  // console.log(totalPrices);
  let receiptModel=buildReceipt(promotedItems,totalPrices);
  // console.log(receiptModel);
  let receipt=buildReceiptString(receiptModel);
  console.log(receipt);
}
let tags=[
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
];
function loadAllItems() {
  return [
    {
      barcode: 'ITEM000000',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'ITEM000002',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'ITEM000004',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}
function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ];
}
prinReceipt(tags);
