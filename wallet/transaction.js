/**
 * Created by nikolasvamvou on 6/11/18.
 */
const ChainUtil = require('../chain-util');

class Transaction{

    constructor(){
        //id of transaction
        this.id = ChainUtil.id();
        this.input = null;
        //how much currency the sender want to send to an individual, how much the sender gets back second element
        //stores two objects
        //first object output has the amount that must be left to the sender wwallet
        this.outputs = [];
    }//second object output has an amount to send to recipient and also the wallet of recipient

    //used to send more than one outputs to multiple individuals
    update(sendersWallet, recipientAddress, amount){
        //gets the output which specifies the amount of currency to be returned
        const senderOutput = this.outputs.find(output => output.address === sendersWallet.publicKey);

        if(amount > senderOutput.amount){
            console.log(`this ${amount} exceeds balance`);
            return;
        }

        //specify the new amount of the sender
        senderOutput.amount = senderOutput.amount - amount;

        //add the output
        this.outputs.push({amount : amount, address : recipientAddress});

        //the original signature wont be valid because we added outputs
        Transaction.signTransaction(this, sendersWallet);
        return this;
    }

    //returns a transaction object, when the user specifies his wallet the recipient wallet and the amount to transfer
    static newTransaction(sendersWallet, recipientAddress, amount){
        const transaction = new this();
        //check balance
        if(amount > sendersWallet){
            console.log(`The amount ${amountToSend} is exceeding the current balance`);
            return;
        }
        //creating the two outputs of the transaction

        //Every time the user sends the whole amount he has
        //pushing two objects
        transaction.outputs.push(...[
            //first object output has the amount that must be left to the sender wwallet
            {amount : sendersWallet.balance - amount, address: sendersWallet.publicKey},
            {amount, address: recipientAddress}
        ])


        //creating the input object and creating a signature for it. The signature is generated from the public key in wallet
        Transaction.signTransaction(transaction, sendersWallet);


        return transaction;
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            //you sign only the outputs
            signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return (ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)));
    }




}

module.exports = Transaction;
