const { Client, LocalAuth } = require("whatsapp-web.js");
client = new Client({
    authStrategy: new LocalAuth({
        clientId: "clienteuno"
    })
});
client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log("QR RECEIVED", qr);
});
client.on('ready', () => {
    console.log('Client is ready!');
    const number = "+595992441761";

    const text = "Hola este es un sms de prueba";
    const chatId = number.substring(1) + "@c.us";

    client.sendMessage(chatId, text);
    
});

client.initialize();

/*client.isRegisteredUser("911234567890@c.us").then(function (isRegistered) {
    if (isRegistered) {
        client.sendMessage("911234567890@c.us", "hello");
    }
})*/
