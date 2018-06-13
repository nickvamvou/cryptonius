/**
 * Created by nikolasvamvou on 6/12/18.
 */

class TransactionPool{
    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
        //if a transaction is updated we want to replace the previous one in the pool

        //check if the transaction already exists
        let transactionWithId = this.transactions.find(t => t.id ===  transaction.id);

        //if exists it means that the transaction exists in the pool and will be updated
        if(transactionWithId){
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


}

module.exports = TransactionPool;