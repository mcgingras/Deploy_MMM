#!/usr/bin/env node
'use strict';

const Veil = require('veil-js');
const dotenv = require('dotenv').config();



const m = process.env.MNEMONIC;
const a = process.env.ADDRESS;
const u = process.env.API_URL;

const veil = new Veil.default(m,a,u);

async function run() {
  try {
    const market = await veil.getMarket('will-cosmos-atoms-be-listed-on-coinmarketcap-by-april-30-2019');
    const orders = await veil.getUserOrders(market);
    console.log(orders);
  } catch(e){
    console.log(e);
  }
}

run();


// veil.getMarket('cosmos-usd-2019-04-30')
// .then((res) => {
//   const market = res;
//   veil.createQuote(market, "buy", "long", 1, .5)
//   .then((res) => {
//     const quote = res;
//     const longOrder = veil.createOrder(quote, { postOnly: true })
//     .then((res) => console.log(res));
//   })
// });
