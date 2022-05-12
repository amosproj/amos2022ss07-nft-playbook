import { ethers } from 'ethers';

const main = async () => {
  const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:7545');

  // Use your wallet's private key to deploy the contract
  const privateKey =
    '8f4c50b53ed98b1d4fecb7cff1dc601bf7c92d1709c681d65238d8fa0536b0a9';
  const wallet = new ethers.Wallet(privateKey, provider);

  const ERC721_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function mint(address to) returns ()', // 'view' ist nur bei gettern
  ];

  const address = '0xc98324Cd610D5Bf332057F98A52Fa4DC9ef05390'; // address of the contract
  const contract = new ethers.Contract(address, ERC721_ABI, provider);

  const name = await contract.name();
  const symbol = await contract.symbol();

  console.log(`\nReading from ${address}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);

  const toAddress = '0xD0024F0BA3d9B8d83B8E9F287b7a9150327b0de6'; //Pub Key from wallet

  const contractWithWallet = contract.connect(wallet);

  const tx = await contractWithWallet.mint(toAddress, {
    gasPrice: provider.getGasPrice(),
    gasLimit: 2000000,
  });
  await tx.wait();

  console.log(tx);

  console.log(`\n mint successfull`);
};

main();
