import inquirer = require('inquirer');
import { Command, sleep } from './Command';
import { Ethereum } from '../../backend/Ethereum/Ethereum';
import { EthereumConfigMintNFT } from '../../backend/Ethereum/EthereumConfig/EthereumConfigMintNFT';
import { EthereumConfigDeployContract } from '../../backend/Ethereum/EthereumConfig/EthereumConfigDeployContract';
import { SettingsData } from '../SettingsData';
import { EthereumConfigReadTokenData } from '../../backend/Ethereum/EthereumConfig/EthereumConfigReadTokenData';

let GAS_LIMIT: number;
let server_uri: string;
let priv_key_contract_owner: string;
let priv_key_NFT_transmitter: string;
let pub_key_NFT_receiver: string;
let nft_name: string;
let nft_symbol: string;
let nft_link: string;
let selectedBlockchains: string[];

export class StartMintingCommand implements Command {
  name = 'Start Minting';
  help = `\tStart the minting process`;

  async execute() {
    GAS_LIMIT = SettingsData.GAS_LIMIT;
    server_uri = SettingsData.server_uri;
    priv_key_contract_owner = SettingsData.priv_key_contract_owner;
    priv_key_NFT_transmitter = SettingsData.priv_key_NFT_transmitter;
    pub_key_NFT_receiver = SettingsData.pub_key_NFT_receiver;
    nft_name = SettingsData.nft_name;
    nft_symbol = SettingsData.nft_symbol;
    nft_link = SettingsData.nft_link;
    selectedBlockchains = SettingsData.selectedBlockchains;

    if (
      GAS_LIMIT === undefined ||
      server_uri === undefined ||
      priv_key_contract_owner === undefined ||
      priv_key_NFT_transmitter === undefined ||
      pub_key_NFT_receiver === undefined ||
      nft_name === undefined ||
      nft_symbol === undefined ||
      nft_link === undefined ||
      selectedBlockchains.length === 0
    ) {
      console.log(
        'Neccessary parameter missing. Please provide all required parameters.'
      );
      await sleep(5000);
      return;
    }
    console.log(`You chose the following parameters: `);
    console.log('#####################################');
    console.log(`Selected blockchains: ${SettingsData.selectedBlockchains}`);
    console.log('#####################################');
    console.log(`Gas Limit: ${GAS_LIMIT}`);
    console.log(`Server uri: ${server_uri}`);
    console.log('#####################################');
    console.log(`NFT Parameters: `);
    console.log(`Key contract owner: ${priv_key_contract_owner}`);
    console.log(`Key NFT transmitter: ${priv_key_NFT_transmitter}`);
    console.log(`Key NFT receiver: ${pub_key_NFT_receiver}`);
    console.log(`NFT Name: ${nft_name}`);
    console.log(`NFT Symbol: ${nft_symbol}`);
    console.log(`NFT Link: ${nft_link}`);
    console.log('#####################################');

    const promptQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Are you sure you want to continue with these settings?',
      },
    ];
    const answer = await inquirer.prompt(promptQuestion);
    if (answer.confirmed) {
      console.log('minting');
      await this.start_minting(
        GAS_LIMIT,
        server_uri,
        priv_key_contract_owner,
        priv_key_NFT_transmitter,
        pub_key_NFT_receiver
      );
    } else {
      console.log('abort');
    }

    await sleep(2000);
  }

  async start_minting(
    GAS_LIMIT: number,
    server_uri: string,
    priv_key_contract_owner: string,
    priv_key_NFT_transmitter: string,
    pub_key_NFT_receiver: string
  ) {
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
  }
}
