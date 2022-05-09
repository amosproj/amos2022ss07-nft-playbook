const { ethers } = require("ethers")
const fs = require('fs')

const privateKey = fs.readFileSync(".secret").toString().trim() //get private key from GANACHE account (testnet)

const QUICKNODE_HTTP_ENDPOINT = "YOUR_QUICKNODE_HTTP_ENDPOINT" //http endpoint from GANACHE testnet
const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT)

const contractAddress = "0xB0C35A41994b75B98fA148b24Fcf0a84db21751D" // addr
const contractAbi = fs.readFileSync("abi.json").toString()
const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider)

async function getGasPrice() {
    let feeData = await provider.getFeeData()
    return feeData.gasPrice
}

async function getWallet(privateKey) {
    const wallet = await new ethers.Wallet(privateKey, provider)
    return wallet
}

async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
}

async function getContractInfo(index, id) {
    let contract = await contractInstance.getERC1155byIndexAndId(index, id)
    return contract;
}

async function getNonce(signer) {
    return (await signer).getTransactionCount()
}

async function mintERC1155(index, name, amount) {
    try {
        if (await getChain(provider) === 137) {
            const wallet = getWallet(privateKey)
            const nonce = await getNonce(wallet)
            const gasFee = await getGasPrice()
            let rawTxn = await contractInstance.populateTransaction.mintERC1155(index, name, amount, {
                gasPrice: gasFee, 
                nonce: nonce
            })
            console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
            let signedTxn = (await wallet).sendTransaction(rawTxn)
            let reciept = (await signedTxn).wait()
            if (reciept) {
                console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", (await signedTxn).hash + '\n' + "Block Number:" + (await reciept).blockNumber + '\n' + "Navigate to https://polygonscan.com/tx/" + (await signedTxn).hash, "to see your transaction")
            } else {
                console.log("Error submitting transaction")
            }
        }
        else {
            console.log("Wrong network - Connect to configured chain ID first!")
        }
    } catch (e) {
        console.log("Error Caught in Catch Statement: ", e)
    }
}


mintERC1155(0, "Saturn", 1)