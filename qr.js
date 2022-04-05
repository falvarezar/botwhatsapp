
const fs = require('fs');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const SESSION_FILE_PATH = './session.json'
let client;

const withOutSession = () => {
    client = new Client({
        authStrategy: new LegacySessionAuth()
    })

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true })
    })

    client.on('authenticated', (session) => {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            console.log('Session Generada!');
            if (err) {
                console.log(err);
            }
        });
    })

    client.initialize();
}

withOutSession()


