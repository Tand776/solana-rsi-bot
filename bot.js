require("dotenv").config()

const TelegramBot = require("node-telegram-bot-api")

const indicators = require("./indicators")
const riskManager = require("./riskmanager")
const tradeEngine = require("./tradeEngine")

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(token,{polling:true})

let botRunning = false
let profit = 0
let balance = 10

console.log("Solana RSI Trading Bot Ready 🚀")

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id,"🤖 Solana Trading Bot Online")
})

bot.onText(/\/startbot/, (msg)=>{

    botRunning = true

    bot.sendMessage(msg.chat.id,"🚀 Trading Started")
})

bot.onText(/\/stopbot/, (msg)=>{

    botRunning = false

    bot.sendMessage(msg.chat.id,"🛑 Trading Stopped")
})

bot.onText(/\/balance/, (msg)=>{

    bot.sendMessage(msg.chat.id,"💰 Balance: "+balance+" SOL")
})

bot.onText(/\/profit/, (msg)=>{

    bot.sendMessage(msg.chat.id,"📈 Profit: "+profit+" SOL")
})

async function tradingLoop(){

    if(!botRunning) return

    const prices = []

    for(let i=0;i<20;i++){

        prices.push(Math.random()*100)
    }

    const rsi = indicators.calculateRSI(prices)

    const latestRSI = rsi[rsi.length-1]

    if(latestRSI < 30){

        const entry = prices[prices.length-1]

        const position = riskManager.calculatePosition(balance)

        const sl = riskManager.stopLoss(entry)

        const tp = riskManager.takeProfit(entry)

        const trade = {

            entry,
            sl,
            tp,
            size: position,
            time: new Date()
        }

        tradeEngine.saveTrade(trade)

        bot.sendMessage(process.env.CHAT_ID,"📉 BUY SIGNAL RSI:"+latestRSI)

    }

}

setInterval(tradingLoop,15000)