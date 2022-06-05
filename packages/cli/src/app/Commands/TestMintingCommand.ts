import inquirer = require('inquirer');
import { Command, sleep } from './Command';

import { CliStrings } from '../CliStrings';
import { SettingsData } from '../SettingsData';
import {
  Ethereum,
  EthereumConfigDeployContract,
  EthereumConfigMintNFT,
  EthereumConfigReadTokenData,
} from '@nft-playbook/backend';

let GAS_LIMIT: number;
let server_uri: string;
let priv_key_contract_owner: string;
let priv_key_NFT_transmitter: string;
let pub_key_NFT_receiver: string;
let nft_name: string;
let nft_symbol: string;
let nft_link: string;
let selectedBlockchains: string[];

export class TestMintingCommand implements Command {
  name = CliStrings.TestMintingCommandLabel;
  help = CliStrings.TestMintingCommandHelp;

  async execute() {
    GAS_LIMIT = 2000000;
    server_uri = "http://127.0.0.1:7545";
    priv_key_contract_owner = "36b802d163dea869795fa3ebd5f671743038a4fc4f9d8b0e3538de4fc1a1d8e8";
    priv_key_NFT_transmitter = "36b802d163dea869795fa3ebd5f671743038a4fc4f9d8b0e3538de4fc1a1d8e8";
    pub_key_NFT_receiver = "0xA995ECea55f0739d07B8F3eEF8153E58C1e838C8";
    nft_name = "name";
    nft_symbol = "symbol";
    nft_link = "link";
    selectedBlockchains = ["Ethereum"];

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
      console.log(CliStrings.StartMintingMenuMissingParameter);
      await sleep(5000);
      return;
    }
    console.log(CliStrings.StartMintingFeedback01);
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.StartMintingFeedback02);
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.StartMintingFeedback03);
    console.log(CliStrings.StartMintingFeedback04);
    console.log(CliStrings.horizontalHashLine);
    console.log(CliStrings.StartMintingFeedback05);
    console.log(CliStrings.StartMintingFeedback06);
    console.log(CliStrings.StartMintingFeedback07);
    console.log(CliStrings.StartMintingFeedback08);
    console.log(CliStrings.StartMintingFeedback09);
    console.log(CliStrings.StartMintingFeedback10);
    console.log(CliStrings.StartMintingFeedback11);
    console.log(CliStrings.horizontalHashLine);

    const promptQuestion: inquirer.QuestionCollection = [
      {
        type: 'confirm',
        name: 'confirmed',
        message: CliStrings.StartMintingMenuConfirmationQuestion,
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

    await sleep(10000);
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
      './packages/backend/src/lib/contracts/simple_amos_nft_contract.sol',
      priv_key_contract_owner,
      'NFT-DEMO-CONTRACT',
      '',
      'basis-uri'
    );

    // create Ethereum object
    const eth = new Ethereum();

    // deploy contract on ethereum blockchain
    const addr = await eth.deploy_contract(ethereumConfigDeployContract);
    console.log('contract deployed');

    // mint nft on ethereum blockchain
    const ethereumConfigMintNFT = new EthereumConfigMintNFT(
      nft_name,
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      '0xBADF00D',
      nft_link,
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
  }
}
