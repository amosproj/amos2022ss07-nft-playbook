import inquirer = require('inquirer');
import fs = require('fs');
import { Command, sleep } from './Command';

import { deploy_contract } from '../../backend/deploy_contract';
import { mint_nft } from '../../backend/mint_nft';
import {
  read_smart_contract,
  read_user_transactions_on_smart_contract,
} from '../../backend/read_smart_contract';

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

    // await this.mint();
  }

  async mint() {
    let addr = undefined;
    addr = await deploy_contract(
      server_uri,
      './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol',
      priv_key_contract_owner,
      'NFT-DEMO',
      '🚀',
      'basis-uri'
    );

    console.log('Deployment successfull!');
    console.log('Deployment successfull!');

    await mint_nft(
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      GAS_LIMIT
    );

    read_smart_contract(server_uri, addr);
    read_user_transactions_on_smart_contract(
      server_uri,
      addr,
      pub_key_NFT_receiver
    );
  }
}
