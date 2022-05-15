const axios = require('axios');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require("whatsapp-web.js");


const ActivateSession = () => {
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "clientesms"
        })
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

function intervalFunc() {
    axios.post(`http://localhost/sms/consulta`)
        .then(response => {
            var toJSON = response.data
            let text = toJSON.mensaje
            let number = toJSON.telefono;
            let chatId = number + "@c.us";
            client.sendMessage(chatId, text);
        })
}

setInterval(intervalFunc, 20000);

ActivateSession()