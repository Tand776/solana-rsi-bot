require("dotenv").config()

const TelegramBot = require("node-telegram-bot-api")

const riskManager = require("./riskmanager")
const riskManager = require("./riskmanager")
const tradeEngine = require("./tradeEngine")
const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(token, { polling: true })

let botRunning = false
let profit = 0

console.log("Solana RSI Trading Bot Ready 🚀")

// START BOT
bot.onText(/\/startbot/, (msg) => {

    botRunning = true

    bot.sendMessage(msg.chat.id, "🤖 Trading bot started")

})

// STOP BOT
bot.onText(/\/stopbot/, (msg) => {

    botRunning = false

    bot.sendMessage(msg.chat.id, "🛑 Trading bot stopped")

})

// BALANCE
bot.onText(/\/balance/, async (msg) => {

    const balance = await tradeEngine.getBalance()

    bot.sendMessage(msg.chat.id, "💰 Balance: " + balance + " SOL")

})

// PROFIT
bot.onText(/\/profit/, (msg) => {

    bot.sendMessage(msg.chat.id, "📈 Profit: " + profit + " SOL")

})

// TRADING LOOP
async function startTrading() {

    setInterval(async () => {

        if (!botRunning) return

        try {

            const price = await indicators.getPrice()

            const rsi = await indicators.getRSI()

            console.log("Price:", price, "RSI:", rsi)

            const decision = riskManager.checkTrade(rsi)

            if (decision === "BUY") {

                await tradeEngine.buy()

                bot.sendMessage(process.env.CHAT_ID, "🟢 BUY signal executed")

            }

            if (decision === "SELL") {

                await tradeEngine.sell()

                bot.sendMessage(process.env.CHAT_ID, "🔴 SELL signal executed")

            }

        } catch (error) {

            console.log("Trading error:", error)

        }

    }, 15000)

}

startTrading()
