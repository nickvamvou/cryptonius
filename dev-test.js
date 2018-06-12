const Transaction = require('./wallet/transaction');
const Wallet = require('./wallet/index');


//sender wallet
senderWallet = new Wallet();
//recipient public key address
recipientAddress = 'r3c1p13ent';
amount = 50;

transaction = Transaction.newTransaction(senderWallet, recipientAddress, amount);
