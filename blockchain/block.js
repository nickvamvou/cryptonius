const SHA256 = require('crypto-js/sha256');
class Block {

    constructor(timestamp, lastHash, hash, data){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString(){
        return`Block-
               Timestamp : ${this.timestamp}
               Last Hash : ${this.lastHash.substring(0,10)}
               Hash      : ${this.hash.substring(0,10)}
               Data      : ${this.data}`;
    }

    //we dont need to make a new instance of that function
    static genesis() {
        return new this('Genesis Time', '-----', 'f1r57-h45h', []);
    }

    //creates a new block based on the previous one
    static mineBlock(lastBlock, data){
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new Block(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data){
        return SHA256(`${timestamp} ${lastHash} ${data}`).toString();
    }

    //returns the hash of a block received
    static blockHash(block){
        return Block.hash(block.timestamp, block.lastHash, block.data);
    }


}


module.exports = Block;
