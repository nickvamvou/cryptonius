const express = require('express');
//gets index js file by default
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');


//user can select the port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//objects that the user has
const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
console.log(tp);
//all the things that must be shared between all users
const p2pServer = new P2pServer(bc, tp);

//allows us to user json format for request
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

//add a new block to the chain, when users want to add data to blockchain
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    //inform user that the block was successful
    //send them back the new blockchain
    p2pServer.syncChains();
    res.redirect('/blocks');

});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

//add a transaction to the transaction pool
app.post('/transact', (req, res) => {
    //add transaction to the pool
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

//get request
app.get('/public-key', (req, res) => {
    res.json({publicKey : wallet.publicKey});
})



app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
//starts web socket server
p2pServer.listen();
