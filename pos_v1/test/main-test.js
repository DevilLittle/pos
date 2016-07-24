'use strict';

describe('pos', () => {

  it('#No.1 should format barcode',() => {

  const tags = [
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005'
  ];

  let formattedTags=getFormattedTags(tags);

  const expectFormattedTags = [ { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000003', count: 2 },
    { barcode: 'ITEM000005', count: 1 },
    { barcode: 'ITEM000005', count: 1 } ];

  expect(formattedTags).toEqual(expectFormattedTags);
});


it('#No.2 should count items number', () => {

  const formattedTags=[ { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000001', count: 1 },
    { barcode: 'ITEM000003', count: 2 },
    { barcode: 'ITEM000005', count: 1 },
    { barcode: 'ITEM000005', count: 1 },
    { barcode: 'ITEM000005', count: 1 } ];

let countedItems=getCountedItems(formattedTags);

const expectCountedItems =[ { barcode: 'ITEM000001', count: 5 },
    { barcode: 'ITEM000003', count: 2 },
    { barcode: 'ITEM000005', count: 3 } ]
  ;

expect(countedItems).toEqual(expectCountedItems);
});


it('#No.3 should build cartItems', () => {

  const countedItems=[ { barcode: 'ITEM000001', count: 5 },
    { barcode: 'ITEM000003', count: 2 },
    { barcode: 'ITEM000005', count: 3 } ];
const allItems=[
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

let cartItems=buildCartItems(countedItems,allItems);

const expectText = [ { barcode: 'ITEM000001',
  name: '雪碧',
  unit: '瓶',
  price: 3,
  count: 5 },
  { barcode: 'ITEM000003',
    name: '荔枝',
    unit: '斤',
    price: 15,
    count: 2 },
  { barcode: 'ITEM000005',
    name: '方便面',
    unit: '袋',
    price: 4.5,
    count: 3 } ];
expect(cartItems).toEqual(expectText);
});

it('#No.4 should build promotedItems', () => {

  const cartItems=[ { barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3,
    count: 5 },
    { barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15,
      count: 2 },
    { barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.5,
      count: 3 } ];
let promotions=loadPromotions();
let promotedItems=buildPromotedItems(cartItems,promotions);

const expectText = [ { barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3,
    count: 5,
    payPrice: 12,
    saved: 3 },
    { barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15,
      count: 2,
      payPrice: 30,
      saved: 0 },
    { barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.5,
      count: 3,
      payPrice: 9,
      saved: 4.5 } ]
  ;

expect(promotedItems).toEqual(expectText);
});

it('#No.5 should calculate tatalPrices', () => {

  const promotedItems=[ { barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3,
    count: 5,
    payPrice: 12,
    saved: 3 },
    { barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15,
      count: 2,
      payPrice: 30,
      saved: 0 },
    { barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.5,
      count: 3,
      payPrice: 9,
      saved: 4.5 } ];

let totalPrices=calculateTotalPrices(promotedItems);

const expectText ={ totalPayPrice: 51, totalSaved: 7.5 } ;

expect(totalPrices).toEqual(expectText);
});

it('#No.6 should build receipt', () => {

  const promotedItems=[ { barcode: 'ITEM000001',
    name: '雪碧',
    unit: '瓶',
    price: 3,
    count: 5,
    payPrice: 12,
    saved: 3 },
    { barcode: 'ITEM000003',
      name: '荔枝',
      unit: '斤',
      price: 15,
      count: 2,
      payPrice: 30,
      saved: 0 },
    { barcode: 'ITEM000005',
      name: '方便面',
      unit: '袋',
      price: 4.5,
      count: 3,
      payPrice: 9,
      saved: 4.5 } ];
const totalPrices={ totalPayPrice: 51, totalSaved: 7.5 };

let receiptModel = buildReceipt(promotedItems, totalPrices);

const expectText = { receiptItem:
  [ { name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12 },
    { name: '荔枝', unit: '斤', price: 15, count: 2, payPrice: 30 },
    { name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9 } ],
  totalPayPrice: 51,
  totalSaved: 7.5 };

expect(receiptModel).toEqual(expectText);
});

it('#No.7 should build receiptString', () => {

  const receiptModel={ receiptItem:
    [ { name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 12 },
      { name: '荔枝', unit: '斤', price: 15, count: 2, payPrice: 30 },
      { name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 9 } ],
    totalPayPrice: 51,
    totalSaved: 7.5 };

spyOn(console,'log');
let receipt = buildReceiptString(receiptModel);

const expectText =`***<没钱赚商店>收据***
名称：雪碧,数量：5瓶,单价：3.00,小计：12.00
名称：荔枝,数量：2斤,单价：15.00,小计：30.00
名称：方便面,数量：3袋,单价：4.50,小计：9.00
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

expect(receipt).toEqual(expectText);
});
});

