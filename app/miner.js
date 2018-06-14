/**
 * Created by nikolasvamvou on 6/13/18.
 */
const Transaction = require('../wallet/transaction')
const Wallet = require('../wallet')
 class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer
    }

    /*
     1. Grabs transactions from the pool
     2. Take those transactions and create a block whose data consists of those transactions
     3. Tells peer to peer to synchronize the chains and include the new block
     4. Must tell the transaction pool to clear all the transactions
     */
    mine(){
        //gets all the valid transactions from the pool
        const validTransactions = this.transactionPool.validTransactions();
        //include a reward transaction for the miner and push it to the valid transactions
        validTransactions.push(Transaction.rewardsTransaction(this.wallet, Wallet.blockchainWallet()))

        //create a block consisting of the valid transactions thw whole array and his own transaction
        const block = this.blockchain.addBlock(validTransactions);

        //synchronize the chains in the p2p network
        this.p2pServer.syncChains();

        //clear the transaction pool of the miner and the system
        this.transactionPool.clear();

        //now we need to clear all the transactions in every node
        this.p2pServer.clearTransactionPool();

        return block;
    }
}

module.exports = Miner