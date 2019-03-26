const Veil = require('veil-js');

class VeilInstance {
  constructor(m,a,u){
    this.veil = new Veil.default(m,a,u);
  }
}

class VeilStrategy {
  // fill this out.
  constructor(v,m){
    this.veil = v;
    this.market = m;
  }

  async openOrders(market, target, spread, amount){
    // make this the most basic order
  };

  // cancels orders
  // could make market a part of veil strategy
  async cancelOrders(market){
    try{
      const m = await this.veil.getMarket(market);
      const orders = await this.veil.getUserOrders(m);
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
}

class SimpleBinaryStrategy extends VeilStrategy {
  constructor(v,m){
    super(v,m);
  }

  async openOrders(market, target, spread, amount){
    const halfSpread = spread / 2;
    const bidPrice = target - halfSpread;
    const askPrice = target + halfSpread;
    const m = await this.veil.getMarket(market);

    try {
      const longQuote  = await this.veil.createQuote(m, "buy", "long", amount, bidPrice);
      const shortQuote = await this.veil.createQuote(m, "buy", "short", amount, 1-askPrice);
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
  constructor(v,m){
    super(v,m);
  }

  async openOrders(market, target, spread, amount){
    // pass
  }
}

class LMBinaryStrategy extends VeilStrategy {
  constructor(v,m){
    super(v,m);
  }
}

module.exports = {
  VeilInstance: VeilInstance,
  VeilStrategy: VeilStrategy,
  SimpleBinaryStrategy: SimpleBinaryStrategy,
  EMABinaryStrategy: EMABinaryStrategy,
  LMBinaryStrategy: LMBinaryStrategy
}
