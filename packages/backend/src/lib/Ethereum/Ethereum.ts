import { ethers, utils } from 'ethers';
import { Blockchain } from '../Blockchain';
import { EthereumConfigDeployContract } from './EthereumConfig/EthereumConfigDeployContract';
import { EthereumConfigMintNFT } from './EthereumConfig/EthereumConfigMintNFT';
import { EthereumConfigReadSmartContract } from './EthereumConfig/EthereumConfigReadSmartContract';
import { EthereumConfigReadUserDataFromSmartContract } from './EthereumConfig/EthereumConfigReadUserDataFromSmartContract';
import { readFileSync } from 'fs';
import { exit } from 'process';
import { resolve, sep, posix } from 'path';
import * as solc from 'solc';
import { EthereumConfigReadTokenData } from './EthereumConfig/EthereumConfigReadTokenData';
import CoinGecko = require('coingecko-api');

// TODO: Check the type of the ConfigArguments!!!!!

export class Ethereum implements Blockchain {
  async estimate_gas_fee_mint(config: EthereumConfigMintNFT): Promise<number> {
    const provider = ethers.providers.getDefaultProvider(
      isNaN(Number(config.endPoint)) ? config.endPoint : Number(config.endPoint)
    );

    const contract = new ethers.Contract(
      config.address_of_contract,
      this.SIMPLE_AMOS_NFT_CONTRACT_ABI,
      provider
    );

    //Estimated Gas for mint()-call in Gas
    const estimated_gas: number = (
      await contract.estimateGas.mint(
        config.pub_key_NFT_receiver,
        config.nftLink,
        config.nftHash,
        {
          gasPrice: provider.getGasPrice(),
          gasLimit: config.gas_limit,
        }
      )
    ).toNumber();

    // get gasprice in gwei
    const gas_price_in_gwei: number = +utils.formatUnits(
      await provider.getGasPrice(),
      'gwei'
    );

    return estimated_gas * gas_price_in_gwei;
  }

  /**
   * ABI for Smart Contract
   */
  private SIMPLE_AMOS_NFT_CONTRACT_ABI = [
    'function name() view returns (string)',
    'function balanceOf(address) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function mint(address pub_key_receiver, string memory pic_uri, string memory pic_hash) returns (uint256)', // 'view' ist nur bei gettern
    'function read_pic_uri(uint256 token_counter) view returns (string)',
    'function read_pic_hash(uint256 token_counter) view returns (string)',
    'event MintedEvent(uint256 token_counter)',
  ];

  async deploy_contract(config: EthereumConfigDeployContract): Promise<string> {
    // get ABI and contract byte code
    const contractInfo = Ethereum._compile_contract(config.path_to_contract);
    const provider = ethers.providers.getDefaultProvider(
      isNaN(Number(config.server_uri))
        ? config.server_uri
        : Number(config.server_uri)
    );

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
      contract = await factory.deploy(config.name_of_contract);
    } catch (e) {
      console.log(e);
      exit(1);
    }
    //TODO: Introduce types for return objects
    return contract.address;
  }

  /**
   * Mints an NFT to Ethereum
   * @param config
   * @returns
   */
  async mint_nft(config: EthereumConfigMintNFT): Promise<string> {
    //await sleep(10000);
    const provider = ethers.providers.getDefaultProvider(
      isNaN(Number(config.endPoint)) ? config.endPoint : Number(config.endPoint)
    );

    const wallet = new ethers.Wallet(config.private_key_transmitter, provider);

    const contract = new ethers.Contract(
      config.address_of_contract,
      this.SIMPLE_AMOS_NFT_CONTRACT_ABI,
      provider
    );

    const contractWithWallet = contract.connect(wallet);

    const tx = await contractWithWallet.mint(
      config.pub_key_NFT_receiver,
      config.nftLink,
      config.nftHash,
      {
        gasPrice: provider.getGasPrice(),
        gasLimit: config.gas_limit,
      }
    );

    const receipt = await tx.wait();
    const ret = receipt;
    //writeFileSync('./receipt_2.json', JSON.stringify(receipt));
    const token_id = parseInt(ret['events'][1]['args'][0]['_hex']);
    return token_id.toString();
  }

  /**
   * Reads a smart contract from Ethereum
   * @param config
   */
  async read_smart_contract(
    config: EthereumConfigReadSmartContract
  ): Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider(config.server_uri);
    const contract = new ethers.Contract(
      config.address_of_contract,
      this.SIMPLE_AMOS_NFT_CONTRACT_ABI,
      provider
    );
    const name = await contract.name();
    const totalSupply = await contract.totalSupply();
    console.log(`\nReading from Contract Address: ${contract.address}\n`);
    console.log(`Contract Name: ${name}`);
    console.log(
      `Total number of minted NFTs (on this contract): ${totalSupply}`
    );
  }

  /**
   * Reads User data from Ethereum smart contract
   * @param config
   */
  async read_user_data_from_smart_contract(
    config: EthereumConfigReadUserDataFromSmartContract
  ): Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider(config.server_uri);
    const contract = new ethers.Contract(
      config.address_of_contract,
      this.SIMPLE_AMOS_NFT_CONTRACT_ABI,
      provider
    );
    const name = await contract.name();
    const balance = await contract.balanceOf(config.pub_key_user);
    console.log(`\nReading from ${contract.address}\n`);
    console.log(`Name: ${name}`);
    console.log(
      `${balance} NFTs are belonging to user: ${config.pub_key_user}`
    );
  }

  /**
   * Reads pic data from Ethereum smart contract
   * @param config
   */
  async read_pic_data_from_smart_contract(config: EthereumConfigReadTokenData) {
    const provider = new ethers.providers.JsonRpcProvider(config.server_uri);
    const contract = new ethers.Contract(
      config.address_of_contract,
      this.SIMPLE_AMOS_NFT_CONTRACT_ABI,
      provider
    );

    console.log('TOKENID: ' + config.token_id);
    await contract.read_pic_uri(config.token_id);

    console.log(
      `Picture URI: <${await contract.read_pic_uri(config.token_id)}>`
    );

    console.log(
      `Picture hash: <${await contract.read_pic_hash(config.token_id)}>`
    );
  }

  async convert_gwei_to_euro(amount_of_gwei: number): Promise<number> {
    // Get CoinGecko object
    const CoinGeckoClient = new CoinGecko();

    // retrieve cryptocurrency price data for ethereum in euro
    const data = await CoinGeckoClient.simple.price({
      ids: ['ethereum'],
      vs_currencies: ['eur'],
    });

    // return the price in euro mit the maximum amount of digits
    return (data.data.ethereum.eur / Math.pow(10, 9)) * amount_of_gwei;
  }

  /**
   * Binds & Compiles a contract from .sol-file
   * @param path_to_contract_solidity
   * @returns
   */
  private static _compile_contract(path_to_contract_solidity: string) {
    const merged_sources = {}; //{ name: { content: string } }; // all dependencies in one sourcecode

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

    // compile and retrieve needed contract source
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

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
    current_file_path: string,
    merged_sources: { [x: string]: { content: string } }
  ) {
    // read the content of the current file and append it to our merged_soruces
    let current_file_content: string;
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
    current_file_path: string,
    current_file_content: string
  ) {
    const dependencies: string[] = [];
    current_file_content
      .toString()
      .split(/(\r\n|\r|\n)/)
      .forEach((line: string) => {
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

  /*
  retrocycle($) {
    const px =
      // eslint-disable-next-line no-control-regex
      /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

    (function rez(value) {
      // The rez function walks recursively through the object looking for $ref
      // properties. When it finds one that has a value that is a path, then it
      // replaces the $ref object with a reference to the value that is found by
      // the path.

      let i, item, name, path;
      if (value && typeof value === 'object') {
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          for (i = 0; i < value.length; i += 1) {
            item = value[i];
            if (item && typeof item === 'object') {
              path = item.$ref;
              if (typeof path === 'string' && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(item);
              }
            }
          }
        } else {
          for (name in value) {
            if (typeof value[name] === 'object') {
              item = value[name];
              if (item) {
                path = item.$ref;
                if (typeof path === 'string' && px.test(path)) {
                  value[name] = eval(path);
                } else {
                  rez(item);
                }
              }
            }
          }
        }
      }
    })($);
    return $;
  }

  decycle(object) {
    const objects = [], // Keep a reference to each unique object or array
      paths = []; // Keep the path to each unique object or array

    return (function derez(value, path) {
      // The derez recurses through the object, producing the deep copy.

      let i, // The loop counter
        name, // Property name
        nu; // The new object or array

      const _value =
        value && value.toJSON instanceof Function ? value.toJSON() : value;
      // typeof null === 'object', so go on if this value is really an object but not
      // one of the weird builtin objects.

      if (typeof _value === 'object' && _value !== null) {
        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a $ref/path object. This is a hard way,
        // linear search that will get slower as the number of unique objects grows.

        for (i = 0; i < objects.length; i += 1) {
          if (objects[i] === _value) {
            return { $ref: paths[i] };
          }
        }

        // Otherwise, accumulate the unique value and its path.

        objects.push(_value);
        paths.push(path);

        // If it is an array, replicate the array.

        if (Object.prototype.toString.apply(_value) === '[object Array]') {
          nu = [];
          for (i = 0; i < _value.length; i += 1) {
            nu[i] = derez(_value[i], path + '[' + i + ']');
          }
        } else {
          // If it is an object, replicate the object.

          nu = {};
          for (name in _value) {
            if (Object.prototype.hasOwnProperty.call(_value, name)) {
              nu[name] = derez(
                _value[name],
                path + '[' + JSON.stringify(name) + ']'
              );
            }
          }
        }
        return nu;
      }
      return _value;
    })(object, '$');
  }


   */
  //This function is the result of our test for wallet integration. This feauture is not longer maintained but is still part of the repository for documenation reasons.
  /*
  async deploy_contract(config: EthereumConfigDeployContract): Promise<string> {
    // get ABI and contract byte code
    const contractInfo = Ethereum._compile_contract(config.path_to_contract);

    const provider = ethers.providers.getDefaultProvider(
      isNaN(Number(config.server_uri))
        ? config.server_uri
        : Number(config.server_uri)
    );

    // Use your wallet's private key to deploy the contract, private key of content owner

    let html_content;
    fs.readFile(
      'packages/backend/src/lib/Ethereum/wallet_integration.html',
      (err, html) => {
        if (err) {
          console.log(
            'missing html file that should contain the ethereum - metamask integration\n' +
              err
          );
        } else {
          html_content = html;
        }
      }
    );

    let server = http
      .createServer(async (request, response) => {
        console.log('\nRequest Path: ' + request.url);
        // initial http request from browser (html file containing the eth wallet integration)
        if (request.url == '/ethereum_wallet_service') {
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.write(html_content);
          response.end();

          // secondary answer containing the necessary and serialized objects
        } else if (request.url == '/ethereum_data_receiver') {
          const buffers = [];
          for await (const chunk of request) {
            buffers.push(chunk);
          }

          const data = Buffer.concat(buffers).toString();
          let provider = this.retrocycle(JSON.parse(data));

          const test = new ethers.providers.JsonRpcProvider();
          Object.assign(test, provider);
          let signer = test.getSigner();
          console.log('signer: ' + signer.constructor.name);
          // console.log("test: " + test.constructor.name);
          // console.log(JSON.stringify(this.decycle(signer)));

          const factory = new ethers.ContractFactory(
            contractInfo['abi'],
            contractInfo['bytecode'],
            signer
          );

          let contract = await factory.deploy(config.name_of_contract);

          response.end();
        }
      })
      .listen(8000);

    open('http://localhost:8000/ethereum_wallet_service');

    await sleep(20000);
    return 'asdf';

    const factory = new ethers.ContractFactory(
      contractInfo['abi'],
      contractInfo['bytecode']
      // wallet
    );

    // If your contract requires constructor args, you can specify them here
    let contract;
    try {
      contract = await factory.deploy(config.name_of_contract);
    } catch (e) {
      console.log(e);
      exit(1);
    }
    //TODO: Introduce types for return objects
    return contract.address;
  }

  */
}

/*
function sleep(ms: number) {
  return new Promise((x) => setTimeout(x, ms));
}
*/
