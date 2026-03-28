function calculatePosition(balance) {

    const riskPercent = 0.05
    const positionSize = balance * riskPercent

    return positionSize
}

function stopLoss(entry) {

    return entry * 0.95
}

function takeProfit(entry) {

    return entry * 1.05
}

module.exports = {

    calculatePosition,
    stopLoss,
    takeProfit
}