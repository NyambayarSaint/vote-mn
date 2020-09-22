const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors')

const mongoose = require('mongoose');
const user = require('./model');

mongoose.connect('mongodb+srv://nymsak:Popersia12@cluster0-ubw8m.mongodb.net/counter?retryWrites=true&w=majority');

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static('client/build'));
app.set('json spaces', 40);

// SENDING THE INDEX PAGE
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

app.post('/login-with-facebook', async (req, res) => {
    const {accessToken, userID} = req.body

    const response = await fetch(`https://graph.facebook.com/v3.1/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`);
    const json = await response.json();

    if(json.id === userID){
        // a valid user
        // check here if the user existing db, then login, else register and then login

        const resp = await user.findOne({ facebookID: userID});

        if(resp){
            console.log('start')
            console.log(resp)
            res.json({status: 'ok', data: 'You are logged in', ...resp});
            console.log('You are logged in')
        }
        else{
            const person = new user({
                name: json.name,
                facebookID: userID,
                accessToken
            })

            await person.save();

            res.json({status: 'ok', data: 'You are registered and logged in'});
            console.log('You are registered and logged in')
        }

    }
    else{
        // impersonate someone
        // just send a warning
        res.json({status: 'error', data: 'Don\'t try to f with us'});
        console.log('Don\'t try to f with us')

    }

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, _ => console.log('listening'));