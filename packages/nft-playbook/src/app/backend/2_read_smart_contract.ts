import { ethers } from 'ethers';
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
// change to ERC721
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];
const address = '0xc98324Cd610D5Bf332057F98A52Fa4DC9ef05390'; // address of the contract
const contract = new ethers.Contract(address, ERC20_ABI, provider);
const main = async () => {
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();
  console.log(`\nReading from ${address}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total Supply: ${totalSupply}\n`);
  const ownerAddress = '0xD0024F0BA3d9B8d83B8E9F287b7a9150327b0de6'; // public key from wallet (user)
  const balance = await contract.balanceOf(ownerAddress);
  console.log(`Number NFTs: ${balance}`);
};

main();
