const express = require('express');
//gets index js file by default
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');

//user can select the port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();

//allows us to user json format for request
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

//add a new block to the chain, when users want to add data to blockchain
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    //inform user that the block was successful
    console.log(`New block added ${block.toString()}`);

    //send them back the new blockchain
    res.redirect('/blocks');

})



app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));