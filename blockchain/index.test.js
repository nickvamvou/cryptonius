/**
 * Created by nikolasvamvou on 6/8/18.
 */
const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    })

    it("`Blockchain` is constructed by initializing a genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    })

    it('add a new block', () => {
        const data = 'foo';
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length -1].data).toEqual(data);

    })

})

