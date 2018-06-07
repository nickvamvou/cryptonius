//Testing the class Blob
const Block = require('./block');

console.log("Goes");

const block = new Block('foo', 'bar', 'zoo', 'baz');
console.log(block.toString());

console.log(Block.genesis().toString());
