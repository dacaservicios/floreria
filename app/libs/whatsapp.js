const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');

const whatsapp = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
  },
  //webCache: false, 
  puppeteer: {
    //executablePath: '/usr/bin/chromium-browser',
    //headless: true,
		args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu', // Soluciona errores en servidores sin entorno gráfico
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-features=SitePerProcess'
    ]
	}
});

whatsapp.on('qr', qr => {
  qrcode.generate(qr, {
      small: true
  });
  console.log('Escanea este QR');
});

whatsapp.on('authenticated', () => {
  console.log('Cliente autenticado correctamente');
});

whatsapp.on('auth_failure', msg => {
  console.error('Error de autenticación:', msg);
});

whatsapp.on('ready', () => {
  console.log('Client esta activo!');
});

module.exports = {whatsapp};