/**
 * Created by nikolasvamvou on 6/10/18.
 */
//elyptic core algo for public and private wallet generation
//contains methods that generate keys, do the hashing etc.
const EC = require('elliptic').ec;
//contains gen key method that creates a key par object
const ec = new EC('secp256k1');

//used for signature
const SHA256 = require('crypto-js/sha256');

//generates an id for a transaction
const uuidV1 = require('uuid/v1');

class ChainUtil{

    //generate private public key
    static genKeyPair(){
        return ec.genKeyPair();
    }

    static id(){
        return uuidV1();
    }

    //sha256 hashing to create a hash
    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    //used by miners to check that the signature for the transaction is correct
    static verifySignature(publicKey, signature, dataHash){
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }


}

module.exports = ChainUtil;