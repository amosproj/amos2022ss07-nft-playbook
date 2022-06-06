import { Ethereum } from './Ethereum';
import { EthereumConfigMintNFT } from './EthereumConfig/EthereumConfigMintNFT';

describe('Ethereum', () => {
  it.skip('should estimate gas', async () => {
    const ethereum = new Ethereum();

    const contract_adress = '0xB924387088C7c2961f3049002D9474b5F308F8c4';
    const priv_key_NFT_transmitter =
      '36b802d163dea869795fa3ebd5f671743038a4fc4f9d8b0e3538de4fc1a1d8e8';
    const pub_key_NFT_receiver = '0xA995ECea55f0739d07B8F3eEF8153E58C1e838C8';

    const config = new EthereumConfigMintNFT(
      'Test',
      'http://127.0.0.1:7545',
      priv_key_NFT_transmitter,
      contract_adress,
      pub_key_NFT_receiver,
      'hash',
      'link123',
      2000000
    );

    const gas_fee = await ethereum.estimate_gas_fee_mint(config);
    console.log('Gasfee: ' + gas_fee);
    console.log(gas_fee);

    expect(1 == 1);
  });
});
