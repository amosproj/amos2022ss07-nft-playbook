import inquirer = require('inquirer');
import fs = require('fs');
import { Command, sleep } from './Command';
import { Ethereum } from '../../backend/Ethereum/Ethereum';
import { EthereumConfigMintNFT } from '../../backend/Ethereum/EthereumConfig/EthereumConfigMintNFT';
import { EthereumConfigDeployContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigDeployContract';
import { EthereumConfigReadSmartContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadSmartContract';
import { EthereumConfigReadUserDataFromSmartContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadUserDataFromSmartContract';

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
      './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol',
      priv_key_contract_owner,
      'NFT-DEMO-CONTRACT',
      '🚀',
      'basis-uri'
    );

    // create Ethereum object
    const eth = new Ethereum();

    // deploy contract on ethereum blockchain
    const addr = await eth.deploy_contract(ethereumConfigDeployContract);

    const ethereumConfigMintNFT = new EthereumConfigMintNFT(
      'DEMO-NFT',
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      'hash',
      'url',
      GAS_LIMIT
    );

    // mint nft on ethereum blockchain
    await eth.mint_nft(ethereumConfigMintNFT);

    const ethereumConfigReadSmartContract = new EthereumConfigReadSmartContract(
      server_uri,
      addr
    );

    eth.read_smart_contract(ethereumConfigReadSmartContract);

    const ethereumConfigReadUserDataFromSmartContract =
      new EthereumConfigReadUserDataFromSmartContract(
        server_uri,
        addr,
        pub_key_NFT_receiver
      );

    eth.read_user_data_from_smart_contract(
      ethereumConfigReadUserDataFromSmartContract
    );

    await sleep(5000);
  }
}
