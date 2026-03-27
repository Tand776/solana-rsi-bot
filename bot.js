require("dotenv").config()

const { Connection, Keypair, PublicKey } = require("@solana/web3.js")
const TelegramBot = require("node-telegram-bot-api")
const axios = require("axios")

// ENV VARIABLES
const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

// SOLANA CONNECTION
const connection = new Connection(RPC_URL, "confirmed")
const wallet = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY))

// TELEGRAM BOT
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })

let botRunning = false
let lastBuyPrice = 0
let profit = 0

// TOKEN PAIR (Example SOL/USDC)
const TOKEN = "SOL"

// RSI SETTINGS
const RSI_PERIOD = 14
const RSI_BUY = 30
const RSI_SELL = 70

// STOP LOSS / TAKE PROFIT
const STOP_LOSS = 0.95
const TAKE_PROFIT = 1.05

//------------------------------------------------
// RSI CALCULATION
//------------------------------------------------

function calculateRSI(prices) {

    let gains = 0
    let losses = 0

    for (let i = 1; i < prices.length; i++) {

        let diff = prices[i] - prices[i-1]

        if(diff > 0){
            gains += diff
        } else {
            losses -= diff
        }

    }

    let avgGain = gains / RSI_PERIOD
    let avgLoss = losses / RSI_PERIOD

    if(avgLoss === 0) return 100

    let rs = avgGain / avgLoss

    return 100 - (100 / (1 + rs))
}

//------------------------------------------------
// GET MARKET PRICE
//------------------------------------------------

async function getPrice(){

    const res = await axios.get(
        "https://price.jup.ag/v4/price?ids=SOL"
    )

    return res.data.data.SOL.price
}

//------------------------------------------------
// GET BALANCE
//------------------------------------------------

async function getBalance(){

    const balance = await connection.getBalance(wallet.publicKey)

    return balance / 1e9
}

//------------------------------------------------
// TRADE FUNCTIONS (SIMULATION)
//------------------------------------------------

async function buy(price){

    lastBuyPrice = price

    bot.sendMessage(CHAT_ID,
        `🟢 BUY SIGNAL\nPrice: $${price}`
    )
}

async function sell(price){

    const tradeProfit = price - lastBuyPrice
    profit += tradeProfit

    bot.sendMessage(CHAT_ID,
        `🔴 SELL SIGNAL\nPrice: $${price}\nProfit: $${tradeProfit.toFixed(2)}`
    )

}

//------------------------------------------------
// TRADING LOOP
//------------------------------------------------

async function tradingLoop(){

    let prices = []

    while(botRunning){

        try{

            const price = await getPrice()

            prices.push(price)

            if(prices.length > RSI_PERIOD){

                prices.shift()

                const rsi = calculateRSI(prices)

                console.log("Price:", price, "RSI:", rsi)

                // BUY SIGNAL
                if(rsi < RSI_BUY && lastBuyPrice === 0){
                    await buy(price)
                }

                // SELL SIGNAL
                if(lastBuyPrice !== 0){

                    if(
                        rsi > RSI_SELL ||
                        price <= lastBuyPrice * STOP_LOSS ||
                        price >= lastBuyPrice * TAKE_PROFIT
                    ){
                        await sell(price)
                        lastBuyPrice = 0
                    }

                }

            }

        }catch(err){
            console.log(err.message)
        }

        await new Promise(r => setTimeout(r, 60000))
    }

}

//------------------------------------------------
// TELEGRAM COMMANDS
//------------------------------------------------

bot.onText(/\/startbot/, async () => {

    if(botRunning){
        bot.sendMessage(CHAT_ID,"Bot already running")
        return
    }

    botRunning = true

    bot.sendMessage(CHAT_ID,"🚀 Solana RSI Bot Started")

    tradingLoop()

})

bot.onText(/\/stopbot/, () => {

    botRunning = false

    bot.sendMessage(CHAT_ID,"⛔ Bot Stopped")

})

bot.onText(/\/balance/, async () => {

    const balance = await getBalance()

    bot.sendMessage(CHAT_ID,`💰 Wallet Balance: ${balance} SOL`)

})

bot.onText(/\/profit/, () => {

    bot.sendMessage(CHAT_ID,`📈 Total Profit: $${profit.toFixed(2)}`)

})

console.log("Solana RSI Trading Bot Ready 🚀")
