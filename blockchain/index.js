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

    //checks whether the chain that the node receives is validated.
    isValidChain(chain){
        //checks genesis block

        //stringify genesis block objects to check if they are equal, because you cant check if two objects are equal (they wont be referencing same object)
        //block genesis does not have dynamic time value
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;


        for(let i = 1; i < chain.length; i++){
            const block = chain[i];
            const prevBlock = chain[i-1];

            //checks if the current block previous hash reference is equal to the previous block hash
            //there is also chance that block data has been tampered so the hash is incorrect
            if(block.lastHash !== prevBlock.hash || block.hash !== Block.checkHash(block)){
                return false
            }
        }
        return true;
    }

    replaceChain(newChain){
        //check the length of the chain
        if(newChain.length >= this.chain.length){
            console.log("Chain received is not longer than already existing chain");
            return;
        }
        else if (!this.isValidChain(newChain)){
            console.log("Received chain is not valid");
            return;
        }

        console.log("Replacing blockchain with new chain");
        this.chain = newChain;

    }

}

module.exports = Blockchain;