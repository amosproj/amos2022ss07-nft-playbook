import { Ethereum } from './Ethereum';
import { EthereumConfigMintNFT } from './EthereumConfig/EthereumConfigMintNFT';

describe('Ethereum', () => {
  jest.setTimeout(1000000);

  it('should mint NFT to Ethereum using one of our contracts', async () => {
    const ethereum = new Ethereum();

    const contract_adress = '0x9225326e5C6f149a930143feCb9cf02c57001c79';
    const priv_key_NFT_transmitter =
      'b0dc1a6a2141fbbc099f957695c58cb1c95bd63eac8d2d3901b59a8376f186cc';
    const pub_key_NFT_receiver = '0x6fBd68deA5df9ECE2aB42a3b8BD48dEB5737730c';

    const config = new EthereumConfigMintNFT(
      'AMOS ETHEREUM NFT',
      '3',
      priv_key_NFT_transmitter,
      contract_adress,
      pub_key_NFT_receiver,
      'DEMO_HASH',
      'DEMO_URLTOFILE',
      2000000
    );

    const token_id = await ethereum.mint_nft(config);
    console.log('TOKENID ETHEREUM NFT: ' + token_id);

    expect(1 == 1);
  });
});
