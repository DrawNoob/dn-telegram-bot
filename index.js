const TelegramApi = require('node-telegram-bot-api');
const token = 'Token';

const bot = new TelegramApi(token, {polling: true});
const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Ще раз?', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Зараз я загадаю цифру від 0 до 9, а ти спробуй вгадати! Ухахаха')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Ну, спробуй вгадати!', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/fe1/084/fe10849e-fb5c-3a29-9ebe-2e21fe8dbc35/1.jpg');
            return bot.sendMessage(chatId, 'Привіт, мене звуть DrawNoob! Чим можу бути корисний? Ти можеш взнати деяку інформацію, запитавши мене такі фраза: "/info", "/whoIsTheBOSS"! Або зіграємо в гру, /play');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Твоє ім'я, ${msg.from.first_name} ${msg.from.last_name}, твій Юзернейм в телеграмі ${msg.from.username}!`);
        }
        if (text === '/whoIsTheBOSS') {
            return bot.sendMessage(chatId, `BOSS is Oleh Pashuk`);
        }
        if (text === '/play') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Нууу, такого я не знаю!')
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Вау, ти вгадав цифру ${chats[chatId]}, все вірно. Вітаю!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ні, цифра яку я загадав ${chats[chatId]}, вибач!`, againOptions)
        }
    })
}

start();
