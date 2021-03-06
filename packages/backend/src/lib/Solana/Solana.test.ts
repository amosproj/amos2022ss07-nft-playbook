import { Solana } from './Solana';
import { SolanaConfigMintNFT } from './SolanaConfig/SolanaConfigMintNFT';

describe('Solana', () => {
  jest.setTimeout(1000000);

  it('should mint NFT to Solana using Metaplex', async () => {
    console.log('hallo');
    const solana = new Solana();
    const mintConfig = new SolanaConfigMintNFT(
      'AMOS SOLANA NFT',
      'https://api.devnet.solana.com',
      '247,142,180,40,54,232,17,194,36,49,4,191,142,5,57,32,54,214,11,202,101,107,215,203,156,248,243,157,148,108,11,24,75,237,171,63,112,111,156,176,83,78,71,150,178,195,46,226,230,56,247,77,52,193,243,137,116,114,96,219,52,121,136,191',
      '67PmqBmQiT18RGfcrJZQMcgACeMdedUD21LgZap2tMrn', //Public Key NFT Receiver
      'DEMO_HASH',
      'DEMO_URLTOFILE'
    );
    const pubKeyNFT = await solana.mint_nft(mintConfig);
    console.log('PUBKEY SOLANA NFT: ' + pubKeyNFT);
    expect(pubKeyNFT != null);
  });
});
