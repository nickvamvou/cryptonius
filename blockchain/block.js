const SHA256 = require('crypto-js/sha256');

//difficult of mining, you need to find a hash with 0 zeroes in the beginning
const DIFICULTY = 4;

class Block {

    constructor(timestamp, lastHash, hash, data, nonce){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString(){
        return`Block-
               Timestamp : ${this.timestamp}
               Last Hash : ${this.lastHash.substring(0,10)}
               Hash      : ${this.hash.substring(0,10)}
               Nonce     : ${this.nonce}
               Data      : ${this.data}`;
    }

    //we dont need to make a new instance of that function
    static genesis() {
        return new this('Genesis Time', '-----', 'f1r57-h45h', [], 0);
    }

    //creates a new block based on the previous one. Tries to mine a block by finding a hash value
    static mineBlock(lastBlock, data){
        let hash, timestamp;

        const lastHash = lastBlock.hash;
        let nonce = 0; //beginning nonce you can access it outside
        //proof of work by checking with all the nonces
        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);

        } while (hash.substring(0, DIFICULTY) !== '0'.repeat(DIFICULTY));
        //runs until the first hash symbols are zero.
        return new Block(timestamp, lastHash, hash, data, nonce);
    }


    static hash(timestamp, lastHash, data, nonce){
        return SHA256(`${timestamp} ${lastHash} ${data} ${nonce}`).toString();
    }

    //returns the hash of a block received
    static blockHash(block){
        return Block.hash(block.timestamp, block.lastHash, block.data, block.nonce);
    }


}


module.exports = Block;
