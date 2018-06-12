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
    createTransaction(recipient, amount, transactionPool){
       //check if amount can be backed up by the wallet
        if(amount > this.balance){
            console.log(`${amount} exceeds current ${this.balance}`);
            return;
        }

        //check if transaction exceeds in the pool
        //so if there is a transaction with this public key we will update it
        let transaction = transactionPool.existingTransaction(this.publicKey);

        //if transaction exists we want to update the transaction in the pool
        if(transaction){
            transaction.update(this, recipient, amount);
        }
        else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }


    }

}

module.exports = Wallet;