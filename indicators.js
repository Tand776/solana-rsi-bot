const { RSI } = require("technicalindicators")

function calculateRSI(prices) {
    return RSI.calculate({
        values: prices,
        period: 14
    })
}

module.exports = { calculateRSI }