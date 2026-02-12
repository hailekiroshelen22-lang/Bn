const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token from @BotFather
const token = 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, { polling: true });

// Store user states (simple memory storage)
const userState = {};

// /start command - exactly like Tapala bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = 'waiting_for_receipt';
    bot.sendMessage(chatId, 'Please send only a photo of your payment receipt.');
});

// Handle photos - receipt received
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    
    if (userState[chatId] === 'waiting_for_receipt') {
        bot.sendMessage(chatId, '✅ Receipt received! Thank you.');
        userState[chatId] = 'completed';
    } else {
        bot.sendMessage(chatId, 'Please use /start first.');
    }
});

// Handle all text messages - repeats same message like Tapala bot
bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Ignore commands
    if (text.startsWith('/')) return;
    
    // If waiting for receipt, keep asking for photo
    if (userState[chatId] === 'waiting_for_receipt') {
        bot.sendMessage(chatId, 'Please send only a photo of your payment receipt.');
    } else {
        bot.sendMessage(chatId, 'Please type /start to begin.');
    }
});

// Handle errors
bot.on('polling_error', (error) => {
    console.log('Polling error:', error);
});

console.log('Bot is running...');
