import inquirer = require('inquirer');
import fs = require('fs');
import { Command, sleep } from './Command';
import { Ethereum } from '../../backend/Ethereum/Ethereum';
import { EthereumConfigMintNFT } from '../../backend/Ethereum/EthereumConfig/EthereumConfigMintNFT';
import { EthereumConfigDeployContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigDeployContract';
import { EthereumConfigReadSmartContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadSmartContract';
import { EthereumConfigReadUserDataFromSmartContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadUserDataFromSmartContract';
import { EthereumConfigReadTokenData } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadTokenData';

let GAS_LIMIT;
let server_uri;
let priv_key_contract_owner;
let priv_key_NFT_transmitter;
let pub_key_NFT_receiver;

export class StartMintingCommand implements Command {
  name = 'Start Minting';
  help = `\tStart the minting process`;

  async execute() {
    const promptQuestion: inquirer.QuestionCollection = [
      {
        type: 'input',
        name: 'filename',
        message: 'Please provide a settings.json',
        default: './packages/nft-playbook/src/info.json',
      },
    ];
    const answer = await inquirer.prompt(promptQuestion);

    let file;
    try {
      file = fs.readFileSync(answer.filename, 'utf-8');
    } catch (e) {
      console.log('Please provide a valid filepath');
      await sleep(5000);
      return;
    }

    let info;
    try {
      info = JSON.parse(file);
    } catch (error) {
      console.log('Error parsing json file');
      await sleep(5000);
      return;
    }

    GAS_LIMIT = info.GAS_LIMIT;
    server_uri = info.server_uri;
    priv_key_contract_owner = info.priv_key_contract_owner;
    priv_key_NFT_transmitter = info.priv_key_NFT_transmitter;
    pub_key_NFT_receiver = info.pub_key_NFT_receiver;

    if (
      GAS_LIMIT === undefined ||
      server_uri === undefined ||
      priv_key_contract_owner === undefined ||
      priv_key_NFT_transmitter === undefined ||
      pub_key_NFT_receiver === undefined
    ) {
      console.log(
        'Neccessary parameter missing. Please provide all required parameters in the json file.'
      );
      await sleep(5000);
      return;
    }

    console.log(GAS_LIMIT);
    console.log(server_uri);
    console.log(priv_key_contract_owner);
    console.log(priv_key_NFT_transmitter);
    console.log(pub_key_NFT_receiver);

    await sleep(5000);

    const ethereumConfigDeployContract = new EthereumConfigDeployContract(
      server_uri,
      './packages/nft-playbook/src/app/backend/contracts/simple_amos_nft_contract.sol',
      priv_key_contract_owner,
      'NFT-DEMO-CONTRACT',
      '🚀',
      'basis-uri'
    );

    // create Ethereum object
    const eth = new Ethereum();

    // deploy contract on ethereum blockchain
    const addr = await eth.deploy_contract(ethereumConfigDeployContract);
    console.log('contract deployed');

    // mint nft on ethereum blockchain
    const ethereumConfigMintNFT = new EthereumConfigMintNFT(
      'DEMO-NFT',
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      '0xBADFOOD',
      'https://user-images.githubusercontent.com/92869397/166645877-e8570f35-82fd-41cb-a702-3b5d1a3068a0.JPG',
      GAS_LIMIT
    );
    const token_id = await eth.mint_nft(ethereumConfigMintNFT);
    console.log('first NFT minted');

    // mint second nft on ethereum blockchain
    const ethereumConfigMintNFT1 = new EthereumConfigMintNFT(
      'DEMO-NFT',
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      '0xCAFEE',
      'https://user-images.githubusercontent.com/92869397/166645877-e8570f35-82fd-41cb-a702-3b5d1a3068a0.JPG',
      GAS_LIMIT
    );
    const token_id1 = await eth.mint_nft(ethereumConfigMintNFT1);
    console.log('second NFT minted');

    const ethereumConfigReadTokenData = new EthereumConfigReadTokenData(
      server_uri,
      addr,
      token_id
    );
    await eth.read_pic_data_from_smart_contract(ethereumConfigReadTokenData);

    const ethereumConfigReadTokenData1 = new EthereumConfigReadTokenData(
      server_uri,
      addr,
      token_id1
    );
    await eth.read_pic_data_from_smart_contract(ethereumConfigReadTokenData1);

    /*
    const ethereumConfigReadSmartContract = new EthereumConfigReadSmartContract(
      server_uri,
      addr,
    );
    await eth.read_smart_contract(ethereumConfigReadSmartContract);



    const ethereumConfigReadUserDataFromSmartContract =
      new EthereumConfigReadUserDataFromSmartContract(
        server_uri,
        addr,
        pub_key_NFT_receiver
      );
    await eth.read_user_data_from_smart_contract(
      ethereumConfigReadUserDataFromSmartContract
    );
    */

    await sleep(5000);
  }
}
