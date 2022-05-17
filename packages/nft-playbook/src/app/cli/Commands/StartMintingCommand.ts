//import inquirer = require('inquirer');
import { Command } from './Command';
//import { HelpCommand } from './HelpCommand';
//import { BackCommand } from './BackCommand';

//const SMRun = {
//  run: false,
//};

import { deploy_contract } from '../../backend/deploy_contract';
import { mint_nft } from '../../backend/mint_nft';
import {
  read_smart_contract,
  read_user_transactions_on_smart_contract,
} from '../../backend/read_smart_contract';

//const helpCommand = new HelpCommand();
//helpCommand.help = `This is the help text for the Minting menu`;
//const CommandIndex: Command[] = [helpCommand, new BackCommand(SMRun)];
//helpCommand.commandIndex = CommandIndex;

const GAS_LIMIT = 200000;
const server_uri = 'http://127.0.0.1:7545';
const priv_key_contract_owner = '5905f53ce9688f782ee5707c19c815fd02747ca239c4342e3ad3d3c586e39e33';
const priv_key_NFT_transmitter = '5905f53ce9688f782ee5707c19c815fd02747ca239c4342e3ad3d3c586e39e33';
const pub_key_NFT_receiver = '0x6645B5647d7b63C53B88EA7f74b659087180D97D';

export class StartMintingCommand implements Command {
  name = 'Start Minting';
  help = `\tStart the minting process`;



  async execute() {
    //SMRun.run = true;
    //
    //const commandChoices: string[] = [];
    //
    //for (const command of CommandIndex) {
    //  commandChoices.push(command.name);
    //}
    //
    //const promptQuestions: inquirer.QuestionCollection = [
    //  {
    //    type: 'list',
    //    name: 'selectedCommand',
    //    message: 'Please select a command',
    //    choices: commandChoices,
    //  },
    //];
    //
    //while (SMRun.run) {
    //  const answers = await inquirer.prompt(promptQuestions);
    //  const index = commandChoices.indexOf(answers.selectedCommand);
    //  console.clear();
    //  await CommandIndex.at(index).execute();
    //  console.clear();
    //}

    let contract_adress;
    let addr = undefined;
    try {
      addr = await deploy_contract(
      server_uri,
      './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol',
      priv_key_contract_owner,
      'NFT-DEMO',
      '🚀',
      'basis-uri'
    )
    } catch (e) {
      console.log(e);
    }

    console.log('Deployment successfull!');
    console.log('Deployment successfull!');

    try {
      await mint_nft(
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      GAS_LIMIT
    )
      } catch (e) {
        console.log(e);
      }
    read_smart_contract(server_uri, addr);
    read_user_transactions_on_smart_contract(
      server_uri,
      contract_adress,
      pub_key_NFT_receiver
    );
  }
}
