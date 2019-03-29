const Veil   = require('veil-js');
const dotenv = require('dotenv').config();


class VeilStrategy {
  // fill this out.
  constructor(market){
    const m = process.env.MNEMONIC;
    const a = process.env.ADDRESS;
    const u = process.env.API_URL;
    this.veil = new Veil.default(m,a,u);
    this.market = market;
  }

  async openOrders(market, target, spread, amount){
    // make this the most basic order
  };

  // cancels orders
  // could make market a part of veil strategy
  async cancelOrders(){
    try{
      const market = await this.veil.getMarket(this.market);
      const orders = await this.veil.getUserOrders(market);
      // prob want to check for orders first before mapping
      orders.results.map((order) => {
        if(order.status === 'open'){
          this.veil.cancelOrder(order.uid);
        }
      })
      return "orders canceled"
    } catch(e) {
      console.log("error " + e);
      return e;
    }
  }

  async getOrders(){
    try{
      const market = await this.veil.getMarket(this.market);
      const orders = await this.veil.getUserOrders(market);
      console.log(orders);
      return orders;
    } catch(e) {
      console.log("error " + e);
      return e;
    }
  }
}

class SimpleBinaryStrategy extends VeilStrategy {
  constructor(market){
    super(market);
  }

  async openOrders(target, spread, amount){
    const halfSpread = spread / 2;
    const bidPrice = target - halfSpread;
    const askPrice = target + halfSpread;
    const market = await this.veil.getMarket(this.market);

    try {
      const longQuote  = await this.veil.createQuote(market, "buy", "long", amount, bidPrice);
      const shortQuote = await this.veil.createQuote(market, "buy", "short", amount, 1-askPrice);
      const longOrder = await this.veil.createOrder(longQuote, { postOnly: true });
      const shortOrder = await this.veil.createOrder(shortQuote, { postOnly: true });
      return "created successfully"
    } catch(e) {
      console.log(e);
      return e;
    }
  }
}


class EMABinaryStrategy extends VeilStrategy {
  constructor(market){
    super(market);
  }

  async openOrders(target, spread, amount){
    // pass
  }
}

class LMBinaryStrategy extends VeilStrategy {
  constructor(market){
    super(market);
  }
}

module.exports = {
  VeilStrategy: VeilStrategy,
  SimpleBinaryStrategy: SimpleBinaryStrategy,
  EMABinaryStrategy: EMABinaryStrategy,
  LMBinaryStrategy: LMBinaryStrategy
}
