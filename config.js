/**
 * Created by nikolasvamvou on 6/9/18.
 */
//difficult of mining, you need to find a hash with 0 zeroes in the beginning
const DIFFICULTY = 3;
//mine rate
const MINE_RATE = 3000; //3000 MILLISECONDS

//initial balance when creating a wallet
const INITIAL_BALANCE = 500;

module.exports = {DIFFICULTY, MINE_RATE, INITIAL_BALANCE};
