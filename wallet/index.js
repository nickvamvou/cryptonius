/**
 * Created by nikolasvamvou on 6/10/18.
 */
const ChainUtil = require('../chain-util');
const {INITIAL_BALANCE} = require('../config');
const Transaction = require('./transaction');

class Wallet{

    constructor(){
        //starting with an initial balance to initiate transactions
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        //store public key in hex form
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return`Wallet-
               publicKey    : ${this.publicKey.toString()}
               balance      : ${this.balance}
               `;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    //creates transaction
    createTransaction(recipient, amount, blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain);

        console.log("New balance", this.balance);
        console.log("New balance2");
       //check if amount can be backed up by the wallet
        if(amount > this.balance){
            console.log(`${amount} exceeds current ${this.balance}`);
            return;
        }


        //check if transaction exceeds in the pool
        //so if there is a transaction with this public key we will update it
        let transaction = transactionPool.existingTransaction(this.publicKey);



        if(transaction){
            //if transaction exists we want to update the transaction in the pool
            transaction.update(this, recipient, amount);
        }
        else {

            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain){

        let balance = this.balance;
        //stores all the transactions from all the blocks
        let transactions = [];
        //get all the transactions from each block
        blockchain.chain.forEach(block => block.data.forEach(
            transaction =>{
                transactions.push(transaction);
            }
        ));
        //get all the transactions that have the address of this wallet in the input [all the transactions that this wallet has sent]
        const walletInputsTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey);


        let startTime = 0;

        //get the most recent transaction to check its output
        if(walletInputsTransactions.length > 0){
            const mostRecentTransactionSentFromWallet = walletInputsTransactions.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current

            );

            balance = mostRecentTransactionSentFromWallet.outputs.find(output => output.address === this.publicKey).amount;
            startTime = mostRecentTransactionSentFromWallet.input.timestamp;

        }
            //now every transaction after this one that includes this public key as an output will be added to the balance
            transactions.forEach(transaction => {
                //we want to look at outputs that transaction timestamp is bigger than startTime
                if(transaction.input.timestamp > startTime){
                   transaction.outputs.find(output => {
                       if(output.address === this.publicKey){
                           balance+= output.amount;
                       }
                   });
                }
            });
        return balance;
    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        //change to address
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }


}

module.exports = Wallet;