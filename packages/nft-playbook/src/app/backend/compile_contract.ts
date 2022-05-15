import { ethers } from "ethers";
import { fstat, readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import { resolve, sep, posix } from "path";
const solc = require("solc");



// retrieves all needed content and return compiled version of contract
export const compile_contract = (path_to_contract_solidity) => {
    let merged_sources = {}; // all dependencies in one sourcecode

    // bind all the necesarry sourcecode in one <merged_sources> variable
    let prev_cwd = process.cwd();
    _rec_merge_all_solidity_sources(path_to_contract_solidity, merged_sources);
    process.chdir(prev_cwd);
    
    writeFileSync("./tmp.txt", JSON.stringify(merged_sources));

    // predefined format of the solc-input
    var input = {
        language: "Solidity",
        sources: merged_sources,
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    // compiling...
    var output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // JSON work
    var contractJSON = output["contracts"][resolve(process.cwd(), path_to_contract_solidity).split(sep).join(posix.sep)]
        [path_to_contract_solidity.substr(path_to_contract_solidity.lastIndexOf("/") + 1).split(".")[0]];

    return {
        bytecode: contractJSON["evm"]["bytecode"]["object"],
        abi: contractJSON["abi"]
    };
};

// recursive function that iterates over all dependencies and merges them into @param merged_sources
function _rec_merge_all_solidity_sources(current_file_path, merged_sources) {   
    // read the content of the current file and append it to our merged_soruces
    let current_file_content;
    try {
        // read content of file and add it to sources
        current_file_content = readFileSync(current_file_path, "utf-8");
    } catch (error) {
        console.error(error);
        exit();
    }
    merged_sources[resolve(process.cwd(), current_file_path).split(sep).join(posix.sep)] = {"content": current_file_content};

    // get all dependencies of the current file e.g. 'import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";'
    // and call recursive function on those
    let child_dependencies = retrieve_child_dependencies(current_file_path, current_file_content);
    child_dependencies.forEach(dependency => {
        // save cwd before recursion so that it can be restored after the recursion returns
        let prev_cwd = process.cwd(); 
        _rec_merge_all_solidity_sources(dependency, merged_sources);
        process.chdir(prev_cwd);
    }); 
}

// uses the parsed current_file_content to extract all dependencies e.g.'import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";'
function retrieve_child_dependencies(current_file_path, current_file_content) {
    const dependencies = new Array();
    current_file_content.toString().split(/(\r\n|\r|\n)/).forEach(line => {
        if (line.startsWith('import "')) {
            dependencies.push(line.replace('import "', "").replace('";', ""));
        }
    });

    // change the current working dir to the folder containing this file, so that all relative import path can be resolved correctly
    let new_cwd = current_file_path.substr(0, current_file_path.lastIndexOf("/"));
    process.chdir(new_cwd);
    return dependencies;
}
