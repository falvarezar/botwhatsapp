//const fs = require('fs');
const axios = require('axios');
const { Client, MessageMedia, Buttons, Location, List, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
//const SESSION_FILE_PATH = './session.json'
let client;
//let sessionData;
let chat;


/*const withSession = () => {
    console.log('EXISTE UNA SESSION');
    // Si exsite cargamos el archivo con las credenciales
    //sessionData = require(SESSION_FILE_PATH);
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "clienteuno"
            //session: sessionData
        })
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        Resolver(client)
        listenMessage();
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    })

    client.initialize();
}*/


const ActivateSession = () => {
    //console.log('No tenemos session guardada');
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "clienteuno"
        })
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', (err) => {
        // Guardamos credenciales de de session para usar luego
        //sessionData = session;
        console.log('Client is ready!');
        listenMessage();
        if (err) {
            console.log(err);
        }

        /*fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            console.log('Client is ready!');
            listenMessage();
            if (err) {
                console.log(err);
            }
        });*/
    });

    client.initialize();
}



const webservice = (from, body) => {
    let celular = Buffer.from(from.substring(0, from.length - 5)).toString('base64');
    let sms = Buffer.from(body.toUpperCase().replace(/\s+/g, '')).toString('base64');
    var texto = "";

    axios.post(`http://localhost/bot/consulta/${celular + '/' + sms}`)
        .then(response => {
            var toJSON = response.data
            switch (toJSON.codretorno) {
                case 'MENU':
                    texto = 'Hola ' + '*' + toJSON.codretorno2 + '*' + ' ' + '_Elija una opción (responder enviando el número):_' + ' en cualquier momento puedes ingresar ' + '*0*' + ' para volver al inicio o enviar un saludo para cambiar de nivel de usuario.' + '\n' + '\n';
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MENUPROPIETARIO':
                    //mediafile = MessageMedia.fromFilePath('./mediaSend/digsa.jpg');
                    mediafile = new MessageMedia('image/jpeg', toJSON.codretorno3)
                    texto = 'https://www.digsa.com.py' + '\n' + '\n' + 'Hola ' + '*' + toJSON.codretorno2 + '*' + ' Muchas gracias por contactar con Digsa Inmobiliaria por medio del Bot, en cualquier momento puedes ingresar ' + '*0*' + ' para volver al inicio.' + '\n' + '\n' + '_Elija una opción (responder enviando el número)_:' + '\n';
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i.substring(1, 5)}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, mediafile, { caption: texto })
                    chat.clearState();
                    break;

                case 'MENUOCASIONAL':
                    //mediafile = MessageMedia.fromFilePath('./mediaSend/digsa.jpg');
                    mediafile = new MessageMedia('image/jpeg', toJSON.codretorno3)
                    texto = 'https://www.digsa.com.py' + '\n' + 'Muchas gracias por contactar con Digsa Inmobiliaria por medio del Bot, te invitamos a ver nuestros lotes disponibles financiados hasta en 130 cuotas, en cualquier momento puedes ingresar ' + '*0*' + ' para volver al inicio.' + '\n' + '\n' + '_Elija una opción (responder enviando el número)_:' + '\n';
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i.substring(1, 5)}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    texto = texto + '\n' + '_Links de contacto e informacion:_' + '\n' + '👉 wa.me/595971980810' + '\n' + '👉 wa.me/595981676193' + '\n' + '👉 fb.me/dgisapy' + '\n' + '👉 dgisapy@gmail.com' + '\n' + '👉 Mcal. Lopez c/Santa Teresa' + '\n'
                    client.sendMessage(from, mediafile, { caption: texto })
                    chat.clearState();
                    break;

                case 'MENUCLIENTE':
                    //mediafile = MessageMedia.fromFilePath('./mediaSend/digsa.jpg');                    
                    mediafile = new MessageMedia('image/jpeg', toJSON.codretorno3)
                    texto = 'https://www.digsa.com.py' + '\n' + '\n' + 'Hola ' + '*' + toJSON.codretorno2 + '*' + ' gracias por contactarte con nosotros por medio del Bot, en cualquier momento puedes ingresar ' + '*0*' + ' para volver al inicio.' + '\n' + '\n' + '_Elija una opción (responder enviando el número)_:' + '\n';
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i.substring(1, 5)}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    texto = texto + '\n' + '_Links de contacto e informacion:_' + '\n' + '👉 wa.me/595971980810' + '\n' + '👉 wa.me/595981676193' + '\n' + '👉 fb.me/dgisapy' + '\n' + '👉 dgisapy@gmail.com' + '\n' + '👉 Mcal. Lopez c/Santa Teresa' + '\n'
                    client.sendMessage(from, mediafile, { caption: texto })
                    chat.clearState();
                    break;

                case 'UBI':
                    texto = 'ℹ️' + ' ' + '_Ha seleccionado_' + ' ' + ' *' + toJSON.codretorno2 + '* '
                    client.sendMessage(from, texto)
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            cadena = toJSON[i]
                            fraccion = cadena.substring(0, cadena.indexOf(";"))
                            latitud = parseFloat(cadena.substring(cadena.indexOf(";") + 1, cadena.indexOf(",")))
                            longitud = parseFloat(cadena.substring(cadena.indexOf(",") + 1, 100))

                            let locacion = new Location(latitud, longitud, fraccion)
                            client.sendMessage(from, locacion)
                        }
                    }
                    chat.clearState();
                    break;

                case 'MENUFOTO':
                    texto = '*_Elija un numero para recibir las fotos:_*' + '\n' + '\n'
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MENUFRACCION':
                    texto = '*_Elija un numero para recibir el informe:_*' + '\n' + '\n'
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MENUBICACION':
                    texto = '*_Ingrese el numero de la ciudad para listar las fracciones:_*' + '\n' + '\n'
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'JPG':
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            //mediafile = MessageMedia.fromFilePath(`./mediaSend/${toJSON[i]}`);
                            mediafile = new MessageMedia('image/jpeg', toJSON[i])
                            client.sendMessage(from, mediafile)
                        }
                    }
                    chat.clearState();
                    break;

                case 'FORMAPAGO':
                    //mediafile = MessageMedia.fromFilePath(`./mediaSend/formapago/${toJSON.codretorno2}`);
                    mediafile = new MessageMedia('application/pdf', toJSON.codretorno2)
                    client.sendMessage(from, mediafile)
                    chat.clearState();
                    break;

                case 'NIVELUSU':
                    texto = 'Hola ' + '*' + toJSON.codretorno2 + '*' + ' seleccione la letra para indicar como desea interactuar con el bot.' + '\n'
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                            texto += `*${i.toUpperCase()}*` + ' ➡️ ' + toJSON[i] + '\n';
                        }
                    }
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'ESTADO':
                    for (i in toJSON) {
                        if (i == 'a_estado') {
                            titulo = i.substring(2, 15)
                            texto1 = `*${titulo.toUpperCase()}*` + ' => ' + `_${toJSON[i]}_`;
                        }
                    }
                    client.sendMessage(from, texto1)
                    for (i in toJSON) {
                        if (i !== 'codretorno' && i !== 'a_estado' && i !== 'codretorno2' && i !== 'codretorno3') {
                            datos = toJSON[i].toString();
                            titulo = i.substring(2, 15);
                            texto += `*${titulo.toUpperCase()}*` + ' => ' + `_${datos.toLowerCase()}_` + '\n';
                        }
                    }

                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MENSAJE':
                    texto = '⚠' + ' LA OPCION NO ES VALIDA'
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'USUARIO':
                    texto = '⚠' + ' UN USUARIO SE COMUNICA CON EL CLIENTE'
                    //client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MESVENDEDOR':
                case 'MESLIQUIDACION':
                    texto = 'ℹ️' + ' ' + '_Ha seleccionado_' + ' ' + ' *' + toJSON.codretorno2 + '* ' + '_ingrese el mes Ej.:_' + ' ' + '*9-2021*'
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MESVENTA':
                case 'MESGASTO':
                case 'MESOP':
                case 'MESCAJA':
                    texto = 'ℹ️' + ' ' + '_Ha seleccionado_' + ' ' + ' *' + toJSON.codretorno2 + '* ' + '_ingrese la fecha que desea de la siguiente manera:_' + '\n' + 'Datos de un dia Ej.:' + ' ' + '*1-9-2021*' + '\n' + 'Datos de un mes Ej.:' + ' ' + '*9-2021*' + '\n' + 'rango de fecha Ej.:' + ' ' + '*1,15-9-2021*'
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'MENUESTADO':
                    texto = 'ℹ️' + ' ' + '_Ha seleccionado_' + ' ' + ' *' + toJSON.codretorno2 + '* ' + '_ingrese el numero de fraccion-manzana-lote Ej.:_' + ' ' + '*9-5-12*'
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;


                case 'NODATOS':
                    texto = 'ℹ️' + ' NO EXISTEN DATOS'
                    client.sendMessage(from, texto)
                    chat.clearState();
                    break;

                case 'PDF':
                    //mediafile = MessageMedia.fromFilePath(`./mediaSend/pdf/${toJSON.codretorno2}`);
                    if (toJSON.codretorno2 == '') {
                        for (i in toJSON) {
                            if (i !== 'codretorno' && i !== 'codretorno2' && i !== 'codretorno3') {
                                mediafile = new MessageMedia('application/pdf', toJSON[i])
                                client.sendMessage(from, mediafile)
                            }
                        }
                    } else {
                        mediafile = new MessageMedia('application/pdf', toJSON.codretorno2)
                        client.sendMessage(from, mediafile)
                    }
                    chat.clearState();
                    break;

                default:
                    let sections = toJSON
                    let list = new List('ℹ️' + ' Haga click en lista para seleccionar un elemento.', 'LISTA', sections, '', '');
                    client.sendMessage(from, list)
                    chat.clearState();
                    break;
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

/**
 * Escuchamos cuando entre un mensaje
 */
const listenMessage = () => {
    client.on('message', async msg => {
        chat = await msg.getChat();
        chat.sendStateTyping();
        const { from, to, body } = msg;
        webservice(from, body)
    });
}


/**
 * Revisamos si existe archivo con credenciales!
 */
//(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();
ActivateSession()