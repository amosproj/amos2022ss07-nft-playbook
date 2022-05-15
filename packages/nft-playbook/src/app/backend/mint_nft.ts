import { ethers } from 'ethers';

/**
 * Mints an NFT to
 *
 * @param server_uri
 * @param private_key_transmitter
 * @param address_of_contract
 * @param pub_key_NFT_receiver
 * @param gasLimit
 */
export const mint_nft = async (
  server_uri: string,
  private_key_transmitter: string,
  address_of_contract: string,
  pub_key_NFT_receiver: string,
  gasLimit: number
) => {
  const provider = ethers.providers.getDefaultProvider(server_uri);

  const wallet = new ethers.Wallet(private_key_transmitter, provider);

  const ERC721_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function mint(address to) returns ()', // 'view' ist nur bei gettern
  ];

  const contract = new ethers.Contract(
    address_of_contract,
    ERC721_ABI,
    provider
  );

  const contractWithWallet = contract.connect(wallet);

  const tx = await contractWithWallet.mint(pub_key_NFT_receiver, {
    gasPrice: provider.getGasPrice(),
    gasLimit: gasLimit,
  });
  await tx.wait();
};
