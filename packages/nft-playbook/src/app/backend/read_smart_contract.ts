import { ethers } from 'ethers';
// change to ERC721
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
];

export const read_smart_contract = async (
  server_uri: string,
  address_of_contract: string
) => {
  const provider = new ethers.providers.JsonRpcProvider(server_uri);
  const contract = new ethers.Contract(
    address_of_contract,
    ERC20_ABI,
    provider
  );
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();
  console.log(`\nReading from ${contract.address}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Total number of minted NFTs (on this contract): ${totalSupply}`);
};

export const read_user_transactions_on_smart_contract = async (
  server_uri: string,
  address_of_contract: string,
  pub_key_user: string
) => {
  const provider = new ethers.providers.JsonRpcProvider(server_uri);
  const contract = new ethers.Contract(
    address_of_contract,
    ERC20_ABI,
    provider
  );
  const name = await contract.name();
  const symbol = await contract.symbol();
  const balance = await contract.balanceOf(pub_key_user);
  console.log(`\nReading from ${contract.address}\n`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`${balance} NFTs are belonging to user: ${pub_key_user}`);
};
