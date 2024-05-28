const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = '7408528350:AAGp4FbKaJCPE9EGMUvUWfD4DxE0h8TcNHI';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

app.use(bodyParser.json());

// Функція для відправки повідомлення
const sendMessage = async (chatId, text) => {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text
        })
    });
    return response.json();
};

// Обробка веб-хука від Telegram
app.post(`/webhook/${TOKEN}`, async (req, res) => {
    const { message } = req.body;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text.toLowerCase();

        // Обробка ключових фраз
        if (text.includes('Start')) {
            await sendMessage(chatId, 'Привіт! Як справи?');
        } else {
            await sendMessage(chatId, 'Я не розумію цю команду.');
        }
    }

    res.sendStatus(200);
});

// Запуск серверу
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Set webhook: ${TELEGRAM_API_URL}/setWebhook?url=https://dn-telegram-bot-deba6c6238ad.herokuapp.com/webhook/${TOKEN}`);
});
