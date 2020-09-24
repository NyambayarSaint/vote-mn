const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors')

const mongoose = require('mongoose');
const user = require('./model');
const participants = require('./participants');

mongoose.connect('mongodb+srv://nymsak:Popersia12@cluster0-ubw8m.mongodb.net/counter?retryWrites=true&w=majority');

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static('client/build'));
app.set('json spaces', 40);

// SENDING THE INDEX PAGE
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

app.post('/vote', async (req, res) =>{
    const {requestingPlayerName, facebook, sender} = req.body;

    const all = await participants.find();
    let contin = true
    all.map((player)=>player.votes.map((vote)=>{
        // if any vote has found with this facebook ID then stop further operation
        if(vote.facebookID === facebook) contin = false
    }));
    
    // SEND ERROR IF USER HAS VOTED ALREADY
    if(!contin) return res.status(403).send('Та саналаа өгсөн байна!');

    // CONTINUE
    const requestingPlayer = await participants.findOne({name: requestingPlayerName});
    requestingPlayer.votes.push({facebookID: facebook, name: sender});
    await participants.findOneAndUpdate({name: requestingPlayerName}, requestingPlayer);

    await user.findOneAndUpdate({facebookID: facebook}, {voted: requestingPlayerName});

    res.status(200).send({voted: requestingPlayerName});
})

app.get('/get-info', async (req, res)=>{
    const participants2 = await participants.find({});
    res.status(200).send({ participants: participants2 });
})

app.post('/login-with-facebook', async (req, res) => {
    const {accessToken, userID} = req.body

    const response = await fetch(`https://graph.facebook.com/v3.1/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`);
    const json = await response.json();

    if(json.id === userID){

        const resp = await user.findOne({ facebookID: userID});
        const participants2 = await participants.find({});

        if(resp){
            res.status(200).send({ person: resp, participants: participants2 })
        }
        else{
            const person = new user({ name: json.name, facebookID: userID, accessToken})
            await person.save();

            res.status(200).send({ person: resp, participants: participants2 })
        }

    }
    else res.status(403).send({status: 'error', data: 'Don\'t try to f with us'});

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, _ => console.log('listening'))