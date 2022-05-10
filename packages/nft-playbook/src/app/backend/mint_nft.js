const { ethers } = require("ethers");

const main = async () => {
    const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:7545')


    // Use your wallet's private key to deploy the contract
    const privateKey = 'a9d29c98de78dd8e81c311e879cb16be6654a64578919367a35f63f0145b384c'
    const wallet = new ethers.Wallet(privateKey, provider)

    const ERC721_ABI = [    
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address to) returns ()"
    ]

    const address = '0x034B8b27C650C9cd893B7dd05284B898431aDa28' // address of the contract
    const contract = new ethers.Contract(address, ERC721_ABI, wallet)

    const name = await contract.name()
    const symbol = await contract.symbol()

    console.log(`\nReading from ${address}\n`)
    console.log(`Name: ${name}`)
    console.log(`Symbol: ${symbol}`)

    const toAddress = "0xe9d22b37404D16EFD03A732632816E10a1b4035B"; //Pub Key from wallet

    await contract.mint(toAddress);
    
    console.log(`\n mint successfull`);

}

main();