const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const http = require('http');
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const express = require('express');
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

console.log(`Your port is ${process.env.PORT}`);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();

    const userMessage = req.body.Body;

    userMessage.replace(/[^A-Za-z0-9]/g, '');

    console.log(userMessage);

    let isFake = 0;

    const search = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${ process.env.GOOGLE_KEY }&cx=017394632511769398270:pcf18ltoftw&lr=lang_pt&q=${ userMessage }`);
    if(search.data.searchInformation.totalResults !== '0') {
        for(let item of search.data.items) {
            //twiml.message(`${item.title}, `);
            console.log(item.title);
            if(item.title.includes('FAKE') || item.title.includes('Fake') || item.title.includes('Falsa') || item.title.includes('Falso') || item.title.includes('Mentira') ||
                item.title.includes('FakeNews') || item.title.includes('FAKENEWS') || item.title.includes('fake') || item.title.includes('fakenews')) {
                isFake++;
            }
        }
    }

    let fakeProbability = 0;

    if(search.data.searchInformation.totalResults !== '0') {
        fakeProbability = Math.floor(isFake/search.data.items.length * 100);
    }

    console.log(fakeProbability);

    if(fakeProbability >= 30) {
        twiml.message(`Através das informações esta notícia tem alta chance de ser FALSA`);
    } else {
        twiml.message(`Através das informações não podemos concluir se a notícia é VERDADEIRA ou FALSA`);
    }

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
