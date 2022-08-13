// setInterval(()=>{
//     console.log(new Date().toLocaleTimeString());
// }, 1000)

var ccxws = require('ccxws')
const ccxt = require('ccxt')

var { BinanceClient } = ccxws
const binance = new BinanceClient()

const log = require('./log')
const { ohlcvs_gen, percDiff, twirlTimer } = require('./fun_')

var coinsForTrade = [
  'BCC',
  'NANO',
  'CHZ',
  'MCO',
  'BEAR',
  'EOSBEAR',
  'XRPBULL',
  'BNBDOWN',
  'YFI',
  'EOSUP',
  'LTCDOWN',
  'SXPDOWN',
  'UNFI',
  'ROSE',
  'RAMP',
  'LPT',
  'KEEP',
  'MLN',
  'FIDA',
  'FLUX',
  'OP',
]

const config = {
  priceDiff: 1, // 100%
}

var isEntered  = false

async function run() {
  log("RUN --", isEntered)
  chances = []

  coinsForTrade.forEach(async (coin, index) => {
    totalPricePercDiffBuy = 0
    totalPricePercDiffSell = 0
    ohlcv = await ohlcvs_gen(coin, undefined, 15, '5m')
    // log(ohlcv);


    ohlcv.forEach((candle, idx) => {
      if (idx == 0) return
      kc = candle[4]
      kcp = ohlcv[idx - 1][4]

      isBull = kc > kcp
      pricePercDiff = percDiff(kc, kcp)

      if (isBull) {
        totalPricePercDiffBuy += parseFloat(pricePercDiff)
      } else {
        totalPricePercDiffBuy = 0
      }

      if (!isBull) {
        totalPricePercDiffSell += parseFloat(pricePercDiff)
      } else {
        totalPricePercDiffSell = 0
      }

      // log(candle[4], ohlcv[idx-1][4]);
      0 &&
        log(
          kc < kcp ? '~rd' : '~bl',
          kc,
          '~reset',
          totalPricePercDiffBuy > config.priceDiff ? '~b_rd' : '',
          totalPricePercDiffBuy.toFixed(1) + '%',
          totalPricePercDiffSell > config.priceDiff ? '~b_bl' : '',
          totalPricePercDiffSell.toFixed(1) + '%',
        )

      isFoundCoins = idx == ohlcv.length - 1 && totalPricePercDiffBuy > config.priceDiff
      isFoundCoins && log(coin, '----BUY-----', '~b_rd', totalPricePercDiffBuy)
      isFoundCoins && chances.push({ coin, kc, diff: totalPricePercDiffBuy })
      // idx == ohlcv.length-1 && log( coin, "-----SELL----", totalPricePercDiffSell > config.priceDiff ? '~b_rd' : '~b_bl', totalPricePercDiffSell > config.priceDiff ?  totalPricePercDiffSell :  'no chances' )
    })

    // console.log( index == coinsForTrade.length-1);
    if (index == coinsForTrade.length - 1) {
      // log('coins ------------', chances)
      // log("------------", chances.reduce((a, b)=> a.diff > b.diff));
      // buy_and_watch(0, [  { coin: 'NANO', kc: 2.224, diff: 1.5862512171729264 },
      // { coin: 'NANO', kc: 0.0524, diff: 2.1215043394407016 }])

      buy_and_watch(0, chances.sort((a, b)=> a.diff < b.diff))
    }

  })

  // setTimeout(run, 15000)
  
}

// async function buy_and_watch(coinIndex, chances) {
//   log("---",chances[coinIndex]['coin'])
//   if(chances.length-1 > coinIndex){
//     buy_and_watch(coinIndex+1, chances)
//   }
// }

async function buy_and_watch(coinIndex, chances_) {

  
  if(chances.length-1 > coinIndex){
    // log(chances.length-1 > coinIndex, chances.length-1 , coinIndex, "==============", chances_[coinIndex]['coin'])
  const ex = new ccxt.binance()
  await ex.loadMarkets()
  result = await ex.market(chances_[coinIndex]['coin'] + 'USDT')

  if (result.info.status != 'TRADING') {
    console.log('Exchange rejected')
    buy_and_watch(coinIndex+1, chances_)
  } else {
    isEntered  = true
    const market = {
      id: result.id,
      base: result.base,
      quote: result.quote,
      // type: "spot", // string - the type of market: spot, futures, option, swap
    }

    // GET OHLCVS
    // Place Buy Order
    // Watch
    // Sell

    binance.on('error', (err) => console.error(err))
    binance.on('ticker', (ticker, market) => console.log(ticker, market))

    binance.subscribeTicker(market)
  }
}else{
  !isEntered && run()
  // log("Ruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuun")
} 

}

run()


// var coins = ['NANO', 'RAMP', 'FLUX', 'ADA']
// function test(idx) {
//   if(coins.length  > idx){
//     log(coins[idx])
//     test(idx+1)
//   }
// }
// test(0)
