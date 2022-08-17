const ccxt = require('ccxt')
const fs = require('fs')

const ex = new ccxt.binance()

const coinsOnTrade = require('./coinsOnTrade.json')

async function ohlcvs_gen(symbol = 'TRX', since = undefined, back = 288 , period='5m') {
   
  const pair = 'USDT'

  const now = ex.milliseconds()
  const oneDay = 60 * 60 * 24 * since * 1000 // milliseconds
  const start_date = since ? now - oneDay : undefined


  // 01m - 1440
  // 03m - 480
  // 05m - 288
  // 15m - 96

    ohlcvs_json = await ex.fetchOHLCV(symbol + pair, period, start_date, back)

    // fs.writeFile('ohlcvs.json', JSON.stringify(ohlcvs_json), 'utf8', (err) => {
    //   if (err) throw err
    //   console.log('write to ohlcvs.json')
    // })


  return ohlcvs_json
}

async function ohlcvs_gen_test(symbol = 'BTC', callback, since = undefined ) {
  const pair = 'USDT'
  const period = '5m'
  const back = 288

  // 01m - 1440
  // 03m - 480
  // 05m - 288
  // 15m - 96

  const now = ex.milliseconds()
  const oneDay = 60 * 60 * 24 * since * 1000 // milliseconds
  const start_date = since ? now - oneDay : undefined


    ohlcvs_json = await ex.fetchOHLCV(symbol + pair, period, start_date, back)
  fs.writeFile('ohlcvs.json', JSON.stringify(ohlcvs_json), 'utf8', (err) => {
    if (err) throw err
    console.log('write to ohlcvs.json')
    callback()
  })
}

async function loadMarkets() {
  result = await ex.fetchMarkets()
  coins = Object.entries(result).filter(__=> __[1]['quote'] == 'USDT').map(_=> _[1]['base'])
  fs.writeFile('markets.json', JSON.stringify(coins), 'utf8', (err) => {
    if (err) throw err
    console.log('markets write to ohlcvs.json')
  })
}

function percDiff(num1, num2) {
  var diff = num1 - num2
  var avrg = (num1 + num2) / 2
  // (Difference/Average) × 100%
  return (diff / avrg) * 100
}

function getBySelSupport(open, close, high, low) {
  byrsPush = 0
  selrsPush = 0
  if (open < close) selrsPush = high - close
  else selrsPush = high - open

  if (close < open) {
    byrsPush = close - low
  } else byrsPush = open - low

  // console.log("sell", selrsPush, ' | buy',  byrsPush);
  return byrsPush > selrsPush
}
// Draw
function Line(length) {
  var line = ''
  new Array(length).fill('_').map((_) => (line += _))
  return line
}

// remove
// function coinConvert____(buy_price = 7.5, sell_price = 7.6, invest = 12) {
//   var inr = 79.67
//   var value = invest / buy_price
//   var diff = sell_price - buy_price
//   //  console.log(value * diff * inr);
//   return value * diff * inr - 2
// }

function getProfit(buy_price = 5.659, sell_price = 5.719, invest = 12) {
  var takerMakerFee = feeCalc(sell_price, invest)
  var amount = invest/buy_price
  return (amount*sell_price - amount*buy_price)-takerMakerFee
}

function getTime(time) {
  var time = new Date(time)
  return [time.toLocaleDateString(), time.toLocaleTimeString(), time]
}

function timeDiff(timeOne, timeTwo) {
  var diffMs = timeTwo - timeOne // milliseconds between now & Christmas
  var diffDays = Math.floor(diffMs / 86400000) // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes
  // console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes :)");
  var f_time = diffHrs + ' hours, ' + diffMins + ' minutes :)'
  return diffDays ? diffDays + ' days, ' + f_time : f_time
}


function twirlTimer(){
  var P = ["||||", "||||||||||", "|||||||||||||||||||", "lodaing > >  >   >              "];
  var x = 0;
  return setInterval(function() {
    process.stdout.write("\r \x1b[33m" + P[x++]);
    x &= 3;
  }, 250);
}


function setCoinsOnTrade(coin){
  newCoinsOnTrade = coinsOnTrade
  newCoinsOnTrade.push(coin)
  fs.writeFile('coinsOnTrade.json', JSON.stringify(newCoinsOnTrade), 'utf8', (err) => {
    if (err) throw err
    // console.log('coinsOnTrade write to json file')
  })
}

function removeCoinsOnTrade(coin) {
  console.log("remove coin", coin)
}


function feeCalc(price, invest) {
  total_coins = invest/price
  totalFee = percentage(total_coins, 0.10)
 return totalFee
}
// console.log(feeCalc(1, 100))

function percentage(num, per)
{
 return (num/100)*per;
}


module.exports = {
  ohlcvs_gen,
  ohlcvs_gen_test,
  loadMarkets,
  percDiff,
  getBySelSupport,
  Line,
  // coinConvert,
  getProfit,
  getTime,
  timeDiff,
  twirlTimer,
  setCoinsOnTrade,
  removeCoinsOnTrade,
  feeCalc
}
