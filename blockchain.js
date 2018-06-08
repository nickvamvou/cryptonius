const Block = require('./block');

class Blockchain {
    //initializes the Blockchain by creating the chain and the first genesis block
    constructor() {
        this.chain = [Block.genesis()];
    }
    //process to add a block in the blockchain
    addBlock(data) {
        const blockToAdd = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(blockToAdd);
        return blockToAdd;
    }
}

module.exports = Blockchain;