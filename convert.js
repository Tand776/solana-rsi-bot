const bs58 = require("bs58").default
const { Keypair } = require("@solana/web3.js")

const secret = "32t7G68mpGhTkK4WNxVukz9XMueVS6SNtQnGmhV8nf1gYysZir48auhWukU68qE3LkwujEEvreJo2sLRFNwZuu5J"

const decoded = bs58.decode(secret)
const wallet = Keypair.fromSecretKey(decoded)

console.log(JSON.stringify(Array.from(wallet.secretKey)))