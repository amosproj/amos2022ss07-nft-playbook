import { Solana } from './Solana';

describe('Solana', () => {
  jest.setTimeout(10000);

  it.skip('should mint NFT to Solana', async () => {
    console.log('hallo');
    const solana = new Solana();
    const test = await solana.test_minting_to_solana();
    console.log(test);
    expect(1 == 1);
  });
});
