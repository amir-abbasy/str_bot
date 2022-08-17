const { getBySelSupport } = require('./fun_')
const log = require('./log')
const ccxt = require('ccxt')
const fs = require('fs')
var exec = require('child_process').exec;

// const ex = new ccxt.binance({
//   api_key : 'Zm736zqFfeUpi2n2wRCIt0TIzIpl9rUm3gYZDndj382iSz4V9tbh5LBU1udtDdMo',
//   api_secret : '7xD8hcp2NleymDO5EQ2UCIbg3D07xBN50xfgxi9du0JYeVBEHZA1fE7kw6xkNlRC',
//   verbose: true 
// })

var ex = new ccxt.phemex({
  //   enableRateLimit: true,
  apiKey: 'ba9237f1-1902-4297-a1ea-f1d26ac8ac0f',
  secret:
    'fPUOp4fONIhYvy5PNT30kJ9ZSMYNp8q6vspcCHYbwX1iMWIzZDA0NS1hMzRhLTQyNjUtYjE4MC1mYzBmYjI0ZWVjY2I',
})
ex.setSandboxMode(true)


async function ohlcvs_gen(symbol = 'TRX', since = undefined ) {
  const pair = 'USDT'
  const period = '5m'
  const back = 288
  
  // var date = new Date()
  // const start_date = since ? Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()-since, 22, 00, 00, 00) / 1000 ): undefined

  const now = ex.milliseconds()
  const oneDay = 60 * 60 * 24 * since * 1000 // milliseconds
  // const oneWeek = 60 * 60 * 24 * 7 * 1000 // milliseconds
  const start_date = since ? now - oneDay : undefined

  // 01m - 1440
  // 03m - 480
  // 05m - 288
  // 15m - 96
// console.log("->", date.getFullYear(), date.getMonth(), date.getDate()-since, 22, 00, 00, 00);
    ohlcvs_json = await ex.fetchOHLCV(symbol + pair, period, start_date, back)
  return ohlcvs_json
}

// 1 /  2.189061 
// 3 /  996391

// ohlcvs_gen(undefined, 2).then(data => log(data[0]));


const ohlcvs = [
  [1657652400000, 0.0403, 0.0404, 0.0401, 0.0402, 41396.4],
  [1657653300000, 0.0403, 0.0403, 0.0401, 0.0401, 124476.3],
  [1657654200000, 0.0401, 0.0403, 0.0401, 0.0411, 70640.4],
  [1657655100000, 0.0401, 0.0406, 0.0401, 0.0403, 116042.5],
  [1657656000000, 0.0403, 0.0404, 0.0401, 0.0404, 48936.5],
  [1657656900000, 0.0404, 0.0404, 0.0403, 0.0413, 28672.1],
  [1657657800000, 0.0405, 0.0408, 0.0405, 0.0406, 49776.2],
  [1657658700000, 0.0405, 0.0405, 0.0402, 0.0405, 68214.8],
]
var prevSupports = []
var backSupport = 0
for (const key in ohlcvs) {
  const k = ohlcvs[key]
  var buyersSupport = getBySelSupport(k[1], k[2], k[3], k[4])

  //   prevSupports.push(buyersSupport ? 1 : 0)
  //   backSupport += 1

  //   if (backSupport == 3) {
  //     backSupport = 0
  //     log(prevSupports)
  //     prevSupports = []
  //   }

  //   prevSupports.push(buyersSupport ? 1 : 0)
  //   backSupport += 1
  if (key > 1) {
    var array = [1, 2, 3]
    for (let index = 0; index < array.length; index++) {
      // const element = array[index]
      prevSupports[index] = getBySelSupport(
        ohlcvs[key - index][1],
        ohlcvs[key - index][2],
        ohlcvs[key - index][3],
        ohlcvs[key - index][4],
      )
        ? 1
        : 0
    }
  }
  // console.log(prevSupports.length > 2 && prevSupports.reduce((a,b)=> a+b))
  //   prevSupports[0]=getBySelSupport(k[1], k[2], k[3], k[4])
}

// var i = 1;

// function myLoop() {
//   setTimeout(function() {
//     console.log('hello');
//     i++;
//     if (i < 10) {
//       myLoop();
//     }
//   }, 800)
// }

// myLoop();





// {
//   buy_price: 0.01808,
//   sell_price: 0.01792,
//   profit: '-0.00016',
//   inrProfit: -10.46053097345135,
//   date_time: '8/12/2022 7:15:00 AM',
//   hold_time: '0 hours, 5 minutes :)'
// }


function coinConvert_(buy_price = 100, sell_price = 101, invest = 12) {
  var inr = 79.67
  var takerMakerFee = 2
  var diff = sell_price - buy_price
  return (diff * invest) * inr - takerMakerFee
}


// {
//   buy_price: 0.3802,
//   sell_price: 0.3798,
//   profit: -0.26262493424513345,
//   inrProfit: -20.923328511309784,
//   date_time: '8/11/2022 8:35:00 PM',
//   hold_time: '0 hours, 20 minutes :)'
// }


function coinConvert(buy_price = 0.3802, sell_price = 0.3798, invest = 12) {
  var takerMakerFee = 0.024
  var amount = invest/buy_price
  return (amount*sell_price - amount*buy_price)-takerMakerFee
}


async function test(){
  account_balance = await ex.fetch_balance()
  log(account_balance)

  const symbol = 'ADA/USDT'
  const amount = 5 // BTC
  const price = 0 // USD
  // cost = amount * price = 2 * 9000 = 18000 (USD)
  
  // createOrder('WAVES/USDN', 'limit', 'buy', 0.5, 1.05)
  
  // BUY 
  // const order = await ex.createOrder (symbol, 'market', 'buy', amount, undefined)
  
  // SELL 
  // const order = await ex.createOrder (symbol, 'market', 'sell', amount,  undefined, {positionSide: "LONG"})
  // console.log (order)
}



function live() {
  
}
live()



function curl_run(args_) {
  exec(args_, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      // console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
  })
  

}
// curl_run("gnome-terminal")


// For example:
// You place an order to buy 10 ETH for 3,452.55 USDT each:
// Trading fee = 10 ETH * 0.1% = 0.01 ETH
// Or you place an order to sell 10 ETH for 3,452.55 USDT each:
// Trading fee = (10 ETH * 3,452.55 USDT) * 0.1% = 34.5255 USDT


function feeCals(price, invest) {
   total_coins = invest/price
   totalFee = percentage(total_coins, 0.10)
  return totalFee
}

console.log(feeCals(0.06904000, 12))
function percentage(num, per)
{
  return (num/100)*per;
}
// % = 34.5255 U
// console.log((250 - percentage(0.10, 250)))

// sell
// console.log(percentage((10*1876), 0.10))




// var child_process = require('child_process');
// // console.log("Node Version: ", process.version);

// run_script("node", ["ccxt.js"], function(output, exit_code) {
//     console.log("Process Finished.");
//     console.log('closing code: ' + exit_code);
//     // console.log('Full output of script: ',output);
// });

// console.log ("Continuing to do node things while the process runs at the same time...");

// // This function will output the lines from the script 
// // AS is runs, AND will return the full combined output
// // as well as exit code when it's done (using the callback).
// function run_script(command, args, callback) {
//     console.log("Starting Process.");
//     var child = child_process.spawn(command, args);

//     // var scriptOutput = "";

//     child.stdout.setEncoding('utf8');
//     child.stdout.on('data', function(data) {
//         console.log(data);

//         data=data.toString();
//         // scriptOutput+=data;
//     });

//     child.stderr.setEncoding('utf8');
//     child.stderr.on('data', function(data) {
//         console.log('stderr: ' + data);

//         data=data.toString();
//         // scriptOutput+=data;
//     });

//     child.on('close', function(code) {
//         // callback(scriptOutput,code);
//     });
// }