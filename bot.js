require("dotenv").config()

const { Connection, Keypair } = require("@solana/web3.js")
const TelegramBot = require("node-telegram-bot-api")
const axios = require("axios")

const { calculateRSI } = require("./indicators")
const { STOP_LOSS, TAKE_PROFIT } = require("./riskManager")
const { saveTrade, getProfit } = require("./tradeEngine")

const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

const connection = new Connection(RPC_URL)
const wallet = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY))

const bot = new TelegramBot(TELEGRAM_TOKEN,{polling:true})

let botRunning = false
let prices = []
let lastBuy = 0

async function getPrice(){

const res = await axios.get(
"https://price.jup.ag/v4/price?ids=SOL"
)

return res.data.data.SOL.price

}

async function tradingLoop(){

while(botRunning){

try{

const price = await getPrice()

prices.push(price)

if(prices.length > 14){

prices.shift()

const rsi = calculateRSI(prices)

console.log("Price:",price,"RSI:",rsi)

if(rsi < 30 && lastBuy === 0){

lastBuy = price

bot.sendMessage(
CHAT_ID,
`🟢 BUY\nPrice: $${price}`
)

}

if(lastBuy !== 0){

if(
rsi > 70 ||
price <= lastBuy * STOP_LOSS ||
price >= lastBuy * TAKE_PROFIT
){

let profit = price - lastBuy

saveTrade({
buy:lastBuy,
sell:price,
profit:profit,
time:Date.now()
})

bot.sendMessage(
CHAT_ID,
`🔴 SELL\nPrice: $${price}\nProfit: $${profit.toFixed(2)}`
)

lastBuy = 0

}

}

}

}catch(err){

console.log(err)

}

await new Promise(r=>setTimeout(r,60000))

}

}

bot.onText(/\/startbot/,()=>{

if(botRunning) return

botRunning = true

bot.sendMessage(CHAT_ID,"🚀 Trading Bot Started")

tradingLoop()

})

bot.onText(/\/stopbot/,()=>{

botRunning = false

bot.sendMessage(CHAT_ID,"⛔ Bot Stopped")

})

bot.onText(/\/profit/,()=>{

bot.sendMessage(
CHAT_ID,
`📈 Total Profit: $${getProfit().toFixed(2)}`
)

})

console.log("Solana Trading Bot v2 Ready")