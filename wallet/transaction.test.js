const Transaction = require('./transaction');
const Wallet = require('./index');
const Miner = require('../app/miner')


describe('Transaction', () => {

    let transaction, senderWallet, recipientAddress, amount;
        //sender wallet
        senderWallet = new Wallet();
        //recipient public key address
        recipientAddress = 'r3c1p13ent';
        amount = 50;
        transaction = Transaction.newTransaction(senderWallet, recipientAddress, amount);


    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount).
            toEqual(senderWallet.balance - amount);
    });

    it('outputs the `amount` added to the recipeint', () => {
        expect(transaction.outputs.find(output => output.address === recipientAddress).amount)
            .toEqual(amount);
    })

    //testing whether transaction can be verified
    it('transaction verification', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    })


    describe('creating rewards transaction' , () => {
        beforeEach(() => {
            transaction = Transaction.rewardsTransaction(senderWallet, Wallet.blockchainWallet())
        })
    })

})
