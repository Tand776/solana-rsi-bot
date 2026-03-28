require("dotenv").config()

const TelegramBot = require("node-telegram-bot-api")

const indicators=require("./indicators")
const riskManager=require("./riskmanager")
const tradeEngine=require("./tradeEngine")

const token=process.env.TELEGRAM_TOKEN

const bot=new TelegramBot(token,{polling:true})

let running=false

console.log("Solana Auto Trader Ready 🚀")

bot.onText(/\/start/,msg=>{

bot.sendMessage(msg.chat.id,"🤖 Solana Trading Bot Online")

})

bot.onText(/\/startbot/,msg=>{

running=true

bot.sendMessage(msg.chat.id,"🚀 Trading Started")

})

bot.onText(/\/stopbot/,msg=>{

running=false

bot.sendMessage(msg.chat.id,"🛑 Trading Stopped")

})

bot.onText(/\/dashboard/,msg=>{

const history=require("./tradeHistory.json")

bot.sendMessage(msg.chat.id,
`📊 Trades Executed: ${history.length}`
)

})

bot.onText(/\/balance/, async (msg) => {

const balance = 10 // temporary example

bot.sendMessage(msg.chat.id,
`💰 Wallet Balance: ${balance} SOL`
)

})

bot.onText(/\/profit/, (msg) => {

bot.sendMessage(msg.chat.id,
`📈 Total Profit: 0 SOL`
)

})

async function tradingLoop(){

if(!running) return

const prices=[]

for(let i=0;i<20;i++){

prices.push(Math.random()*100)

}

const rsi=indicators.calculateRSI(prices)

const latestRSI=rsi[rsi.length-1]

const price=prices[prices.length-1]

if(latestRSI<30){

await tradeEngine.executeBuy(price)

bot.sendMessage(process.env.CHAT_ID,
`📉 BUY EXECUTED\nPrice: ${price}`
)

}

const exit=tradeEngine.checkExit(price)

if(exit){

bot.sendMessage(process.env.CHAT_ID,
`💰 ${exit.type}\nPrice: ${exit.price}`
)

}

}

setInterval(tradingLoop,15000)
