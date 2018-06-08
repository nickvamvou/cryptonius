//represents every P2P server
class P2pServer{

    //each p2p server has a blockchain, to share their individual chain objects
    constructor(blockchain){

        this.blockchain = blockchain;

        //a list of all servers that connect to this particular p2p server
        this.sockets = [];

    }

    //creates the server
    listen(){
        //start the server, users port or 5001
        console.log(`Port used for P2P : ${P2P_PORT}`)
        const server = new WebSocket.Server({port : P2P_PORT});

        this.connectToPeers();

        //if the server receives that message 'connection' event, fire an event when a new socket connects to the server
        //so another server wants to connect with this server
        //add that new socket address to the socket array
        //socket is the ip and port of the other server trying to connect
        server.on('connection', socket => this.connectSocket(socket));

        console.log(`Listening for peer-to-peer connections on : ${P2P_PORT}`)
    }

    //when the server is initialized and the listen function is called it connects with all the other servers
    connectToPeers(){
        peers.forEach(peer => {
            console.log("Peers", Date.now());
            //ws://localhost:5001 (address of peer)
            console.log("goes in");
            const socket = new WebSocket(peer);
            //opens the connection line 37 to the specific socket then after the call back it does the connect socket to this instance
            socket.on('open', () => this.connectSocket(socket));
        });
    }


    connectSocket(socket){
        this.sockets.push(socket);
        console.log(`Socket connected ${socket}`);
        //you add the listener of message to all the sockets and they are ready to receive message events
        this.messageHandler(socket);
        //sends a message to the socket with this chain, and the socket will in turn send its chain to this instance
        this.sendChain(socket);

    }

    //send the chain to every blockchain
    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    //sockets receive the message
    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            //data is the chain that the socket receives

            //replaces the chain only if it is bigger than the current one
            // console.log('data', data);
            this.blockchain.replaceChain(data);

        });
    }

    //when an instance has a block mined then send the new chain to all the nodes
    syncChains(){
        //for each function runs in all our sockets
        this.sockets.forEach(socket => {
            this.sockets.forEach(socket => this.sendChain(socket));
        })
    }



    //connect to peers when a server is starting
}

/**
 * Created by nikolasvamvou on 6/8/18.
 */
