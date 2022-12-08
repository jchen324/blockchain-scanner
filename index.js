const express = require('express')
const app = express()
const port = 3000
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/6c45c5cbea0745da847693814b280766');
const fs = require('fs');

const filePath = './hello.txt';
const data = 'Hello world';

async function getBlockchainInfo() {
  try {
    // Get the latest block number
    const latestBlockNumber = await web3.eth.getBlockNumber();

    // Get the latest block
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);


    const blockID = latestBlock.number;
    const timestamp = latestBlock.timestamp;
    const gasUsed = latestBlock.gasUsed;
    const baseFeePerGas = latestBlock.baseFeePerGas; // in Wei
    const blockReward = baseFeePerGas / Math.pow(10, 18) * gasUsed; // in Ether
    const minerAddress = latestBlock.miner;

    // console.log(blockID);
    // console.log(timestamp);
    // console.log(blockReward);
    // console.log(minerAddress);

    writeData(`blockID: ${blockID} \n`);
    writeData(`timestamp: ${timestamp} \n`);
    writeData(`blockReward: ${blockReward} \n`);
    writeData(`minerAddress: ${minerAddress} \n\n`);


    const transactions = latestBlock.transactions;
    transactions.forEach((transactionHash) => (getTransactionInfo(transactionHash)));

  } catch (error) {
    console.error(error);
  }
}


async function getTransactionInfo(transactionHash) {
  try {
    // Get the transaction object
    const transaction = await web3.eth.getTransaction(transactionHash);
    const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
    const status = transactionReceipt.status; // TRUE if the transaction was successful, FALSE if the EVM reverted the transaction.
    const from = transaction.from;
    const to = transaction.to;
    const value = transaction.value / Math.pow(10, 18); // in Ether
    const gasUsed = transactionReceipt.gasUsed;
    const gasPrice = transaction.gasPrice; // in Wei
    const transactionFee = gasPrice / Math.pow(10, 18) * gasUsed; // in Ether
    const blockID = transaction.blockNumber;
  
    let fromBalance = await web3.eth.getBalance(from); // a String in Wei
    let toBalance = await web3.eth.getBalance(to); // a String in Wei

    // Convert to Ether
    fromBalance = Number(fromBalance) / Math.pow(10, 18);
    toBalance = Number(toBalance) / Math.pow(10, 18);

    // console.log(transactionHash);
    // console.log(value);
    // console.log(from);
    // console.log(to);
    // console.log(transactionFee);
    // console.log(gasUsed);
    // console.log(blockID);

    writeData(`transactionHash: ${transactionHash} \n`);
    writeData(`value: ${value} \n`);
    writeData(`from: ${from} \n`);
    writeData(`fromBalance: ${fromBalance} \n`);
    writeData(`to: ${to} \n`);
    writeData(`toBalance: ${toBalance} \n`);
    writeData(`transactionFee: ${transactionFee} \n`);
    writeData(`gasUsed: ${gasUsed} \n`);
    writeData(`blockID: ${blockID} \n\n`);

    
    

  } catch (error) {
    console.error(error);
  }
}

async function writeData(data) {
  fs.appendFileSync(filePath, data, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Data saved to file: ${filePath}`);
    }
  });
}

getTransactionInfo("0xfb16f2cf8bfcb1b2fa6058f6e027f20ba9d8cd0063743aa5a6e8f785c8468d8d");
// getBlockchainInfo();


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })