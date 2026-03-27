const MAX_RISK_PER_TRADE = 0.02
const STOP_LOSS = 0.95
const TAKE_PROFIT = 1.05

function calculatePositionSize(balance){

return balance * MAX_RISK_PER_TRADE

}

module.exports = {
STOP_LOSS,
TAKE_PROFIT,
calculatePositionSize
}