import { Command } from './Command';

import { deploy_contract } from '../../backend/deploy_contract';
import { mint_nft } from '../../backend/mint_nft';
import {
  read_smart_contract,
  read_user_transactions_on_smart_contract,
} from '../../backend/read_smart_contract';

const GAS_LIMIT = 200000;
const server_uri = 'http://127.0.0.1:7545';
const priv_key_contract_owner = 'bc257c300b897738c1f142c521609b97d17cad08093719352fb7f71fed832362';
const priv_key_NFT_transmitter = 'bc257c300b897738c1f142c521609b97d17cad08093719352fb7f71fed832362';
const pub_key_NFT_receiver = '0x726e81a71Cf0a8060e4f5C7605E70da2Acc2F407';

export class StartMintingCommand implements Command {
  name = 'Start Minting';
  help = `\tStart the minting process`;


  async execute() {
    let addr = undefined;
    addr = await deploy_contract(
      server_uri,
      './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol',
      priv_key_contract_owner,
      'NFT-DEMO',
      '🚀',
      'basis-uri'
    )

    console.log('Deployment successfull!');
    console.log('Deployment successfull!');

    await mint_nft(
      server_uri,
      priv_key_NFT_transmitter,
      addr,
      pub_key_NFT_receiver,
      GAS_LIMIT
    )

    read_smart_contract(server_uri, addr);
    read_user_transactions_on_smart_contract(
      server_uri,
      addr,
      pub_key_NFT_receiver
    );
  }
}
