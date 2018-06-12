const Block = require('./block');
const {DIFFICULTY} = require('../config');

describe('Block', () => {

    let data, lastBlock, block;

    //does code before each test
    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);

    })

    it("The block sets the `data` to match the input", () => {
        expect(block.data).toEqual(data);

    });

    it("Sets the `lastHash` to match the hash of the last block", () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    })

    it('generates a hash that manages the difficulty', () => {
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    });


});