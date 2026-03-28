const fs = require("fs")

function saveTrade(trade){

    let history = []

    try {

        history = JSON.parse(fs.readFileSync("tradeHistory.json"))

    } catch {

        history = []

    }

    history.push(trade)

    fs.writeFileSync("tradeHistory.json", JSON.stringify(history,null,2))
}

module.exports = {

    saveTrade
}