const fs = require("fs")

const FILE = "tradeHistory.json"

// Load existing trade history
function loadHistory() {

    try {
        const data = fs.readFileSync(FILE)
        return JSON.parse(data)
    } catch (err) {
        return []
    }

}

// Save trade history
function saveHistory(history) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(history, null, 2)
    )

}

// Add new trade
function addTrade(buyPrice, sellPrice) {

    const history = loadHistory()

    const profit = sellPrice - buyPrice

    const trade = {

        buy: buyPrice,
        sell: sellPrice,
        profit: profit,
        time: new Date().toISOString()

    }

    history.push(trade)

    saveHistory(history)

}

// Get total profit
function getTotalProfit() {

    const history = loadHistory()

    let total = 0

    history.forEach(trade => {
        total += trade.profit
    })

    return total

}

// Get all trades
function getTrades() {

    return loadHistory()

}

module.exports = {
    addTrade,
    getTotalProfit,
    getTrades
}