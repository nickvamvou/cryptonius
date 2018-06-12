/**
 * Created by nikolasvamvou on 6/12/18.
 */
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
    let transaction, wallet, transactionPool;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        wallet = new Wallet();
        address = 'r3s1p13nt';
        amount = 50;
        transaction = Transaction.newTransaction(wallet, address, amount);
        transactionPool.updateOrAddTransaction(transaction);
    })

    it('Add transaction to transaction pool', () => {
        expect(transactionPool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    })

    it('updates transaction in pool', () => {
        //old transaction
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4d335', 50);
        transactionPool.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(transactionPool.transactions.find(t => t.id === newTransaction.id))).
            not.toEqual(oldTransaction);

    });



})