//Way of the applications (servers) communicating with each other
const WebSocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;

//string of web sockets addresses, all the addresses of the servers and their ports
//example ws://localhost:5001,ws://localhost:5002
//web socket address used to find the server

//if present store them in the array
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

//global var that has labels of various data to send over the sockets
const MESSAGE_TYPES = {
    chain : 'CHAIN',
    transaction : 'TRANSACTION'
};

class P2pServer{

    constructor(blockchain, tp){
        this.blockchain = blockchain;
        this.sockets = [];
        this.transactionPool = tp;
    }

    listen(){
        //create a web server based on the P2P_PORT
        const server = new WebSocket.Server({port : P2P_PORT});
        //connect the server with all the other servers by storing their sockets
        this.connectServerWithPeers();

        //gets the socket that performed the connection
        server.on("connection", socket => this.connectSocket(socket));
    }

    //1-1 PAEI PRWTA SE AUTO POU UPARXEI HDH (NODE-WEB SERVER) KANEI TO CONNECTION ME AUTOU TOU INSTANT TO SOCKET KAI META TO CALLBACK KANEI AUTOU TOU INSTANCE TO SOCKET CONNECT ME AUTO POU HDH UPARXEI

    //connects with all the web servers, by accessing their sockets
    connectServerWithPeers(){
        peers.forEach(peer => {
            //create the socket with the peer
            const socket = new WebSocket(peer);
            //opens the particular socket and goes to the connection listener
            //once it finishes it connects the other socket to this particular instance
            socket.on('open', () => this.connectSocket(socket));
        })
    }

    //handles the connection between sockets
    connectSocket(socket){
        console.log("Socket connected")
        this.sockets.push(socket);
        //register that this socket can receive messages
        this.handleMessage(socket);
        //send a message to the socket
        this.sendChain(socket);
    }

    //send the chain to every blockchain. Used when creating a new socket and also when this instance mines a block
    sendChain(socket){
        socket.send(JSON.stringify({type : MESSAGE_TYPES.chain,
                                    chain: this.blockchain.chain}));
    }

    //sends a transaction to other servers. Attach fields to distinguish between sending the blockchain
    sendTransaction(socket, transaction){

        socket.send(JSON.stringify({type : MESSAGE_TYPES.transaction,
                    transaction : transaction}));
    }

    //this function handles messages that a socket can receive. Distinguishes between receiving a transaction and receiving a chain
    handleMessage(socket){
        //this function handles messages between sockets
        socket.on('message', message => {
            //receive the new chain
            const data = JSON.parse(message);

            //distinguishes between a receiving chain and a transaction
            switch (data.type){
                case MESSAGE_TYPES.chain:
                    //check if the blockchain that this server receives is longer than current one
                    console.log("Received new blockchain");
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    console.log("Received Transaction to add to the transaction pool");
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    console.log(this.transactionPool.transactions[0]);
                    break;
            }
        })
    }

    //when an instance mines a block and creates a bigger chain it must synchronize all the other chains
    syncChains(){
        //iterate through all nodes and update their chains, by sending them a message with the new chain
        this.sockets.forEach(socket => {
            this.sockets.forEach(socket => this.sendChain(socket));
        })
    }

    //broadcasts the transaction when the server gets it
    broadcastTransaction(transaction){
        console.log(this.transactionPool.transactions[0]);
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }





}

module.exports = P2pServer;