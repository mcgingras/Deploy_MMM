const Veil   = require('veil-js');
const dotenv = require('dotenv').config();


class VeilStrategy {
  constructor(market){
    const m = process.env.MNEMONIC;
    const a = process.env.ADDRESS;
    const u = process.env.API_URL;
    this.veil = new Veil.default(m,a,u);
    this.market = market;
  }

  // cancel orders same for any strategy type
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

  // get orders same for any strategy type
  async getOrders(){
    try{
      const market = await this.veil.getMarket(this.market);
      const orders = await this.veil.getUserOrders(market);
      const fills = await this.veil.getOrderFills(market, "short");
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

    console.log(amount);
    console.log(bidPrice);

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
