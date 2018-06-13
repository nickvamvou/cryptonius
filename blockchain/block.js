const ChainUtil = require('../chain-util');
//difficult of mining, you need to find a hash with 0 zeroes in the beginning

const {DIFFICULTY, MINE_RATE} = require('../config');
class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        //if its our first block genesis give the difficulty of the system
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return`Block-
               Timestamp    : ${this.timestamp}
               Last Hash    : ${this.lastHash.substring(0,10)}
               Hash         : ${this.hash.substring(0,10)}
               Nonce        : ${this.nonce}
               Difficulty   : ${this.difficulty}
               Data         : ${this.data}`;
    }

    //we dont need to make a new instance of that function
    static genesis() {
        return new this('Genesis Time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    //creates a new block based on the previous one. Tries to mine a block by finding a hash value
    static mineBlock(lastBlock, data){
        let hash, timestamp;
        //get the last block difficulty
        let {difficulty} = lastBlock;

        const lastHash = lastBlock.hash;
        let nonce = 0; //beginning nonce you can access it outside
        //proof of work by checking with all the nonces
        do {
            nonce++;
            timestamp = Date.now();
            // difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);

        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        //runs until the first hash symbols are zero.
        return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
    }


    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash (`${timestamp} ${lastHash} ${data} ${nonce} ${difficulty}`).toString();
    }

    //returns the hash of a block received
    static blockHash(block){
        return Block.hash(block.timestamp, block.lastHash, block.data, block.nonce, block.difficulty);
    }

    //adjusts the difficulty of mining a block dynamically by calculating every time it loops whether the difficulty should go done or app
    static adjustDifficulty(lastBlock, currentTime){
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
        difficulty + 1 : difficulty - 1;
        return difficulty;
    }


}


module.exports = Block;

