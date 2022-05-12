import { ethers } from 'ethers';
import path = require('path');
import fs = require('fs');
import solc = require('solc');

// returns a contract object compiled using solc
// baseContractPath: relative path of the base contract, i.e. "./BaseContract.sol"
const instantiateContract = (baseContractPath) => {
  const sources = {};
  compileImports(baseContractPath, sources);

  const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const funcJson =
    output['contracts']['./examples/ERC721PresetMinterPauserAutoId.sol'][
      'ERC721PresetMinterPauserAutoId'
    ];

  return {
    bytecode: funcJson['evm']['bytecode']['object'],
    abi: funcJson['abi'],
  };
};

// returns sources: { "Contract.sol": { content: fs.readFileSync("pathName.sol",utf8)...}}
// using recursion
const compileImports = (root, sources) => {
  root = root.replace('"', ''); // TODO fix this!!!

  sources[root] = { content: fs.readFileSync(root, 'utf8') };
  const imports = getNeededImports(root);
  for (let i = 0; i < imports.length; i++) {
    compileImports(imports[i], sources);
  }
};

// returns all the import paths in absolute path
const getNeededImports = (path) => {
  const file = fs.readFileSync(path, 'utf8');
  const files = [];
  file
    .toString()
    .split('\n')
    .forEach(function (line, index, arr) {
      if (
        (index === arr.length - 1 && line === '') ||
        !line.trim().startsWith('import')
      ) {
        return;
      }
      // the import is legit
      const relativePath = line.substring(8, line.length - 2);
      const fullPath = buildFullPath(path, relativePath);
      files.push(fullPath);
    });
  return files;
};

// parent: node_modules/.../ERC721/ERC721.sol
// returns absolute path of a relative one using the parent path
const buildFullPath = (parent, path) => {
  let curDir = parent.substr(0, parent.lastIndexOf('/')); //i.e. ./node/.../ERC721
  if (path.startsWith('./')) {
    return curDir + '/' + path.substr(2);
  }

  while (path.startsWith('../')) {
    curDir = curDir.substr(0, curDir.lastIndexOf('/'));
    path = path.substr(3);
  }

  return curDir + '/' + path;
};

export const deploy_contract = async () => {
  // get ABI and contract byte code
  const contractInfo = instantiateContract(
    './examples/ERC721PresetMinterPauserAutoId.sol'
  );
  console.log(contractInfo['abi']);
  //console.log(contractInfo["bytecode"]);

  const provider = ethers.providers.getDefaultProvider('http://127.0.0.1:7545');

  // Use your wallet's private key to deploy the contract, private key of content owner
  const privateKey =
    '8f1851169fd5bb25e52737199d23b031c1b08f4d521d6c42fcf29b02e12f0240';
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(
    contractInfo['abi'],
    contractInfo['bytecode'],
    wallet
  ); // TODO

  // If your contract requires constructor args, you can specify them here
  const contract = await factory.deploy(
    'NFTPLAYBOOK_DEMO_NFT',
    '🚀',
    'baseURI'
  );

  console.log(contract.address);
  console.log(contract.deployTransaction);
};
