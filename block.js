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

}


module.exports = Block;
