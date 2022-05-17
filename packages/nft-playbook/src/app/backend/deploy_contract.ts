import { ethers } from 'ethers';
import { compile_contract } from './compile_contract';

/**
 * Deploy a contract which is saved under path_to_contract using hostname and port
 *
 * @param server_uri
 * @param path_to_contract
 * @param private_key_of_contract_owner
 * @param name_of_contract
 * @param symbol_of_contract
 * @param baseuri_of_contract
 * @returns address of deployed contract
 */
export const deploy_contract = async (
  server_uri: string,
  path_to_contract: string,
  private_key_of_contract_owner: string,
  name_of_contract: string,
  symbol_of_contract: string,
  baseuri_of_contract: string
) => {
  // get ABI and contract byte code
  const contractInfo = compile_contract(path_to_contract);
  const provider = ethers.providers.getDefaultProvider(server_uri);

  // Use your wallet's private key to deploy the contract, private key of content owner
  const wallet = new ethers.Wallet(private_key_of_contract_owner, provider);
  const factory = new ethers.ContractFactory(
    contractInfo['abi'],
    contractInfo['bytecode'],
    wallet
  );

  // If your contract requires constructor args, you can specify them here
  let contract;
  try {
    contract = await factory.deploy(
    name_of_contract,
    symbol_of_contract,
    baseuri_of_contract
  );
    } catch (e) {
      console.log("test3")
      console.log(e);
      while (true) {}
    }
  //TODO: Introduce types for return obejcts
  return contract.address;
};
