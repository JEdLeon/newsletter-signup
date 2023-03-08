const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.listen(process.env.PORT || 3301, function () {console.log('Server Port 3301 On-Line')});
mailchimp.setConfig({
    apiKey: 'fcffbedf580f72c9bcff6c50128b2a44-us11',
    server: 'us11'
});

app.route(['/', '/index', '/signup'])
    .get(function (req, res) {
        res.sendFile(`${__dirname}/signup.html`);
    })
    .post(function (req, res) {
        const name = req.body.name;
        const lastName =req.body.lastName;
        const email = req.body.email;

        const data = {
            members: [ 
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: name,
                        LNAME: lastName
                    }
                }
            ]
        };

        const run = async function () {
            const chimpRes = await mailchimp.lists.batchListMembers('e0d6b1aef2', data);
            if (chimpRes.errors !== []){
                res.sendFile(`${__dirname}/succes.html`);
            }
            else {
                res.sendFile(`${__dirname}/failure.html`);
            }
        };
        run();
    });

app.post('/succes', function (req, res) {
    res.redirect(`/index`);
});
app.post('/failure', function (req, res) {
    res.redirect(`/index`);
});

//API KEY: fcffbedf580f72c9bcff6c50128b2a44-us11
//Audience ID: e0d6b1aef2