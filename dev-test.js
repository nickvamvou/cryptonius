//Testing the class Blob
const Block = require('./blockchain/block');

console.log("Goes");

const block = new Block('foo', 'bar', 'zoo', 'baz');

const fooBlock = Block.mineBlock(Block.genesis(), "foo");
console.log(fooBlock.toString());


