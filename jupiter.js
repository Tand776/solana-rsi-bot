const axios = require("axios")

async function getQuote(inputMint, outputMint, amount){

const url = `https://quote-api.jup.ag/v6/quote`

const response = await axios.get(url,{
params:{
inputMint,
outputMint,
amount,
slippageBps:50
}
})

return response.data
}

module.exports = { getQuote }