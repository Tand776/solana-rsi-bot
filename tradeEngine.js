const fs = require("fs")
const { getQuote } = require("./jupiter")

let openTrade = null

function saveTrade(trade){

let history=[]

try{
history=JSON.parse(fs.readFileSync("tradeHistory.json"))
}catch{
history=[]
}

history.push(trade)

fs.writeFileSync("tradeHistory.json",JSON.stringify(history,null,2))

}

async function executeBuy(price){

openTrade={
entry:price,
stopLoss:price*0.95,
takeProfit:price*1.05,
time:new Date()
}

saveTrade(openTrade)

}

function checkExit(price){

if(!openTrade) return null

if(price<=openTrade.stopLoss){

const result={
type:"STOP LOSS",
price
}

openTrade=null

return result
}

if(price>=openTrade.takeProfit){

const result={
type:"TAKE PROFIT",
price
}

openTrade=null

return result
}

return null
}

module.exports={
executeBuy,
checkExit
}