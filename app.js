require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3301, function () { console.log('Server Port 3301 On-Line') });

mailchimp.setConfig({
    apiKey: process.env.KEY,
    server: 'us11'
});

app.route(['/', '/index', '/signup'])
    .get(function (req, res) {
        res.sendFile(`${__dirname}/signup.html`);
    })
    .post(function (req, res) {
        const name = req.body.name;
        const lastName = req.body.lastName;
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

        const run = () => {
            // const chimpRes = await mailchimp.lists.batchListMembers(process.env.ID, data);
            // if (chimpRes.errors != []) {
            //     res.sendFile(`${__dirname}/succes.html`);
            // }
            // else {
            //     res.sendFile(`${__dirname}/failure.html`);
            // }
            mailchimp.lists.batchListMembers(process.env.ID, data)
                .then((result) => {
                    res.sendFile(`${__dirname}/succes.html`)
                })
                .catch((err) => {
                    console.log('this error:', err)
                    res.sendFile(`${__dirname}/failure.html`)
                })
        };
        run();
    });

app.post(['/succes', '/failure'], function (req, res) {
    res.redirect(`/index`);
});