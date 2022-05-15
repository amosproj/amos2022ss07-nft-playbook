import { ethers } from 'ethers';
import { compile_contract } from './compile_contract';

export const deploy_contract = async () => {
  // get ABI and contract byte code
  const contractInfo = compile_contract(
    './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol'
  );
  console.log(contractInfo['abi']);

  const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:7545');

  // Use your wallet's private key to deploy the contract, private key of content owner
  const privateKey =
    '1d7e1d43a7db52ce032125a3a467d118555d0b3d617d10800cc0080e0394b990';
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(
    contractInfo['abi'],
    contractInfo['bytecode'],
    wallet
  ); // TODO

  // If your contract requires constructor args, you can specify them here
  const contract = await factory.deploy(
    'NFTPLAYBOOK_DEMO_NFT',
    '🚀',
    'baseURI'
  );

  console.log(contract.address);
  console.log(contract.deployTransaction);
};
