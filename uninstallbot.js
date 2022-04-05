var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'bot_whatsapp',
  description: 'The nodejs.org example web server.',
  script: 'd:\\proyectos\\digsa\\whatsapp\\bot_whatsapp\\bot.js'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();