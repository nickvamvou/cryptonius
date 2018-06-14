const express = require('express');
//gets index js file by default
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');


//user can select the port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//objects that the user has
const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
//all the things that must be shared between all users
const p2pServer = new P2pServer(bc, tp);
//this is the users wallet
const miner = new Miner(bc, tp, wallet, p2pServer);

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
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

//get request
app.get('/public-key', (req, res) => {
    res.json({publicKey : wallet.publicKey});
});

//activates the mining process for the miner when it reaches this endpoint
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    //created block
    console.log(`New block has been added: ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/balance', (req, res) => {
    //get balance from wallet
    const balance = wallet.balance;
    console.log("Wallet balance", wallet);
    res.json({amount : balance})
});





app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
//starts web socket server
p2pServer.listen();
