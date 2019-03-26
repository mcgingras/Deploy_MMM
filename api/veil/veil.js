const Veil = require('veil-js');
const dotenv = require('dotenv').config();

class VeilInstance {

  constructor(m,a,u){
    this.veil = new Veil.default(m,a,u);
  }

  async run(market, spread, target){
    const halfSpread = spread / 2;
    const bidPrice = target - halfSpread;
    const askPrice = target + halfSpread;
    const m = await this.veil.getMarket(market);

    try {
      const longQuote  = await this.veil.createQuote(m, "buy", "long", amount, bidPrice);
      const shortQuote = await this.veil.createQuote(m, "buy", "short", amount, 1-askPrice);
      const longOrder = await this.veil.createOrder(longQuote, { postOnly: true });
      const shortOrder = await this.veil.createOrder(shortQuote, { postOnly: true });
    } catch(e) {
      console.log(e);
      return res.json(e);
    }
  };
}

module.exports = VeilInstance;
//
// const m = process.env.MNEMONIC;
// const a = process.env.ADDRESS;
// const u = process.env.API_URL;
// const v = new VeilInstance(m,a,u);
