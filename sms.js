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

function EnviarSms() {
    axios.post(`http://localhost/sms/consulta`)
        .then(response => {
            let text = response.data.mensaje
            let number = response.data.telefono + "@c.us";
            client.sendMessage(number, text);
        })
}

setInterval(EnviarSms, 20000);

ActivateSession()