import { ethers } from 'ethers';
import { Blockchain } from '../Blockchain';
import { EthereumConfigDeployContract } from './EthereumConfig/EthereumConfigDeployContract';
import { EthereumConfigMintNFT } from './EthereumConfig/EthereumConfigMintNFT';
import { EthereumConfigReadSmartContract } from './EthereumConfig/EthereumConfigReadSmartContract';
import { EthereumConfigReadUserDataFromSmartContract } from './EthereumConfig/EthereumConfigReadUserDataFromSmartContract';
import { readFileSync } from 'fs';
import { exit } from 'process';
import { resolve, sep, posix } from 'path';
import solc = require('solc');

export class Ethereum implements Blockchain {
  /* deploys the contract to ethereum*/
  async deploy_contract(config: EthereumConfigDeployContract): Promise<string> {
    // get ABI and contract byte code
    const contractInfo = Ethereum._compile_contract(config.path_to_contract);
    const provider = ethers.providers.getDefaultProvider(config.server_uri);

    // Use your wallet's private key to deploy the contract, private key of content owner
    const wallet = new ethers.Wallet(
      config.private_key_of_contract_owner,
      provider
    );
    const factory = new ethers.ContractFactory(
      contractInfo['abi'],
      contractInfo['bytecode'],
      wallet
    );

    // If your contract requires constructor args, you can specify them here
    let contract;
    try {
      contract = await factory.deploy(
        config.name_of_contract,
        config.symbol_of_contract,
        config.baseuri_of_contract
      );
    } catch (e) {
      console.log(e);
    }
    //TODO: Introduce types for return objects
    return contract.address;
  }

  async mint_nft(config: EthereumConfigMintNFT): Promise<void> {
    const provider = ethers.providers.getDefaultProvider(config.server_uri);

    const wallet = new ethers.Wallet(config.private_key_transmitter, provider);

    const ERC721_ABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function mint(address to) returns ()', // 'view' ist nur bei gettern
    ];

    const contract = new ethers.Contract(
      config.address_of_contract,
      ERC721_ABI,
      provider
    );

    const contractWithWallet = contract.connect(wallet);

    const tx = await contractWithWallet.mint(config.pub_key_NFT_receiver, {
      gasPrice: provider.getGasPrice(),
      gasLimit: config.gas_limit,
    });
    await tx.wait();
  }

  async read_smart_contract(
    config: EthereumConfigReadSmartContract
  ): Promise<void> {
    // change to ERC721
    const ERC20_ABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
    ];

    const provider = new ethers.providers.JsonRpcProvider(config.server_uri);
    const contract = new ethers.Contract(
      config.address_of_contract,
      ERC20_ABI,
      provider
    );
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    console.log(`\nReading from ${contract.address}\n`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(
      `Total number of minted NFTs (on this contract): ${totalSupply}`
    );
  }
  async read_user_data_from_smart_contract(
    config: EthereumConfigReadUserDataFromSmartContract
  ): Promise<void> {
    // change to ERC721
    const ERC20_ABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
    ];

    const provider = new ethers.providers.JsonRpcProvider(config.server_uri);
    const contract = new ethers.Contract(
      config.address_of_contract,
      ERC20_ABI,
      provider
    );
    const name = await contract.name();
    const symbol = await contract.symbol();
    const balance = await contract.balanceOf(config.pub_key_user);
    console.log(`\nReading from ${contract.address}\n`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(
      `${balance} NFTs are belonging to user: ${config.pub_key_user}`
    );
  }

  private static _compile_contract(path_to_contract_solidity) {
    const merged_sources = {}; // all dependencies in one sourcecode

    // bind all the necesarry sourcecode in one <merged_sources> variable
    const prev_cwd = process.cwd();
    Ethereum._rec_merge_all_solidity_sources(
      path_to_contract_solidity,
      merged_sources
    );
    process.chdir(prev_cwd);

    // predefined format of the solc-input
    const input = {
      language: 'Solidity',
      sources: merged_sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    // compiling...
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // JSON work
    const contractJSON =
      output['contracts'][
        resolve(process.cwd(), path_to_contract_solidity)
          .split(sep)
          .join(posix.sep)
      ][
        path_to_contract_solidity
          .substr(path_to_contract_solidity.lastIndexOf('/') + 1)
          .split('.')[0]
      ];

    return {
      bytecode: contractJSON['evm']['bytecode']['object'],
      abi: contractJSON['abi'],
    };
  }

  // recursive function that iterates over all dependencies and merges them into @param merged_sources
  private static _rec_merge_all_solidity_sources(
    current_file_path,
    merged_sources
  ) {
    // read the content of the current file and append it to our merged_soruces
    let current_file_content;
    try {
      // read content of file and add it to sources
      current_file_content = readFileSync(current_file_path, 'utf-8');
    } catch (error) {
      console.error(error);
      exit();
    }
    merged_sources[
      resolve(process.cwd(), current_file_path).split(sep).join(posix.sep)
    ] = { content: current_file_content };

    // get all dependencies of the current file e.g. 'import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";'
    // and call recursive function on those
    const child_dependencies = Ethereum._retrieve_child_dependencies(
      current_file_path,
      current_file_content
    );
    child_dependencies.forEach((dependency) => {
      // save cwd before recursion so that it can be restored after the recursion returns
      const prev_cwd = process.cwd();
      Ethereum._rec_merge_all_solidity_sources(dependency, merged_sources);
      process.chdir(prev_cwd);
    });
  }

  // uses the parsed current_file_content to extract all dependencies e.g.'import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";'
  private static _retrieve_child_dependencies(
    current_file_path,
    current_file_content
  ) {
    const dependencies = [];
    current_file_content
      .toString()
      .split(/(\r\n|\r|\n)/)
      .forEach((line) => {
        if (line.startsWith('import "')) {
          dependencies.push(line.replace('import "', '').replace('";', ''));
        }
      });

    // change the current working dir to the folder containing this file, so that all relative import path can be resolved correctly
    const new_cwd = current_file_path.substr(
      0,
      current_file_path.lastIndexOf('/')
    );
    process.chdir(new_cwd);
    return dependencies;
  }
}
