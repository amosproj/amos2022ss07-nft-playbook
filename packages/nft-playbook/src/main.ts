import { deploy_contract } from './app/backend/deploy_contract';
import { mint_nft } from './app/backend/mint_nft';
import {
  read_smart_contract,
  read_user_transactions_on_smart_contract,
} from './app/backend/read_smart_contract';

//const user_data = {"wallet_pub_key": sys_argv[n], "wallet_priv_key"};
//const contract_data = deploy_contract(path_to_contract : string);
//mint_nft(user_data, contract_data);

const GAS_LIMIT = 200000;
const server_uri = 'http://127.0.0.1:7545';
const priv_key_contract_owner =
  '486e761eba5c8bc232ebd591970661884c6748530b3215a4d2314dd8777dcd14';
const priv_key_NFT_transmitter =
  'c4f57a62425e68d0cc6335265c506a915248b95c7f7b57a34a03075bc3a12a17';
const pub_key_NFT_receiver = '0xDCe74BC1d54fBa2Dc902635e02a69df6FAFB9D97';
const ANZ_NFTS_TO_MINT = 10;

let contract_adress;
deploy_contract(
  server_uri,
  './packages/nft-playbook/src/app/backend/contracts/ERC721PresetMinterPauserAutoId.sol',
  priv_key_contract_owner,
  'NFT-DEMO',
  '🚀',
  'basis-uri'
).then((addr) => {
  console.log('Deployment successfull!');
  console.log('Deployment successfull!');

  contract_adress = addr;
  mint_nft(
    server_uri,
    priv_key_NFT_transmitter,
    addr,
    pub_key_NFT_receiver,
    GAS_LIMIT
  ).then(() => {
    read_smart_contract(server_uri, contract_adress);
    read_user_transactions_on_smart_contract(
      server_uri,
      contract_adress,
      pub_key_NFT_receiver
    );
  });
});
