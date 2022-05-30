const axios = require('axios');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require("whatsapp-web.js");
let text = "";
let number = "";

const ActivateSession = () => {
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "clientesms"
        }),
        puppeteer: { headless: true }
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', (err) => {
        console.log('Client is ready!');
        if (err) {
            console.log(err);
        }
    });

    client.initialize();
}

function EnviarSms() {
    axios.post(`http://localhost/sms/consulta`)
        .then(response => {
            const toJSON = JSON.parse(new Buffer.from(response.data,'base64').toString('utf-8'))
            for (let i in toJSON){
                text = toJSON[i].mensaje
                number = toJSON[i].telefono + "@c.us";    
                client.sendMessage(number, text);
            }             
        })
}

setInterval(EnviarSms, 50000);

ActivateSession()