/**
 * Created by nikolasvamvou on 6/13/18.
 */
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
        
    }
}