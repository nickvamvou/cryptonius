/**
 * Created by nikolasvamvou on 6/12/18.
 */
const Transaction = require('../wallet/transaction');
class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        //if a transaction is updated we want to replace the previous one in the pool

        //check if the transaction already exists
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        //if exists it means that the transaction exists in the pool and will be updated
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        }
        else {
            this.transactions.push(transaction);
        }
    }

    //if the public key exists in a transaction return that transaction
    existingTransaction(publicKey) {
        return this.transactions.find(t => t.input.address === publicKey);
    }

    //returns all the valid transactions
    //validity of transaction,
    validTransactions() {
        //you check the input and the output amounts are the same

        //verify signature of every transaction to make sure that the data has not been corrupted after it was signed from the sender
        return this.transactions.filter(transaction => {
            //check matching input and output
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);

            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid Transaction from ${transaction.input.address}`);
                return;
            }

            //check that the signature is correct
            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }
            return transaction;
        });
    }

    //clears the pool after all the transaction in the data have been confirmed
    clear(){
        this.transactions = [];
    }

}

module.exports = TransactionPool;