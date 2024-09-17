const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Menghasilkan QR code dengan ukuran yang lebih kecil
    qrcode.toString(qr, { type: 'terminal', scale: 0.5 }, (err, url) => {
        if (err) {
            console.error('Failed to generate QR code:', err);
            return;
        }
        console.log(url);
    });
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// Listening to all incoming messages
client.on('message_create', message => {
	console.log(message.body);
});

client.on('message_create', async (message) => {
    if (message.body === '#ping') {
        // Kirim balasan langsung ke pesan
        await message.reply('pong');
    }
});

// Kode Kirim Pesan Media Gambar
client.on('message', async (msg) => {
    if (msg.body === '#logo') {
        // Gunakan jalur relatif ke file gambar
        const imagePath = path.join(__dirname, 'media', 'ar-logo.png');
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
        const media = new MessageMedia('image/png', imageBase64);
        
        await client.sendMessage(msg.from, media, { caption: '> this is my caption' });
    }
});

// Start your client
client.initialize();
