const dotenv = require('dotenv');

dotenv.config();

const http = require('http');
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const express = require('express');
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

console.log(`Your port is ${process.env.PORT}`);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message(` ${ req.body.Body }? Corona virus is coming! Head for the hills!`);
    console.log(req.body.Body);

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

client.messages.create({
    from: `whatsapp:${process.env.NUMBER}`,
    to: `whatsapp:${process.env.MYNUMBER}`,
    body: 'Sessão iniciada'
}).then( message => console.log(message.sid));

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${process.env.PORT}`);
});
