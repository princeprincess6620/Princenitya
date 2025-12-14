const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'autosend',
    version: '5.0.0',
    hasPermssion: 0,
    credits: '𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍',
    description: 'Auto Message Every 1 Hour',
    commandCategory: 'system',
    usages: 'automatic',
    cooldowns: 0
};

module.exports.onLoad = async ({ api }) => {

    const getTimeInfo = () => {
        const now = moment().tz('Asia/Kolkata');
        const hour = parseInt(now.format('HH'));

        let timeEmoji;
        if (hour >= 5 && hour < 12) timeEmoji = '🌅';
        else if (hour >= 12 && hour < 17) timeEmoji = '☀️';
        else if (hour >= 17 && hour < 21) timeEmoji = '🌇';
        else timeEmoji = '🌙';

        return {
            time: now.format('hh:mm A'),
            day: now.format('dddd'),
            month: now.format('MMMM'),
            date: now.format('DD'),
            emoji: timeEmoji
        };
    };

    const createBracket = (info) => {
        return `
╔═══════════════════════════════════════════╗
║         🎀 𝗔𝗥𝗦𝗛 ☄️ 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀              ║
╠═══════════════════════════════════════════╣
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘁𝗲: ${info.date} ${info.month} ${info.day} ║
║    ⏰ 𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹: 1 𝗛𝗼𝘂𝗿                ║
╚═══════════════════════════════════════════╝
        `;
    };

    const getRandomPhoto = () => {
        const folder = path.join(__dirname, '..', 'autosend');
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        if (!files.length) return null;

        return fs.createReadStream(path.join(folder, files[Math.floor(Math.random() * files.length)]));
    };

    const sendAutoMessage = async () => {
        const info = getTimeInfo();
        const message = createBracket(info);
        const photo = getRandomPhoto();

        if (!global.data?.allThreadID) return;

        for (const id of global.data.allThreadID) {
            await api.sendMessage({ body: message, attachment: photo }, id);
            await new Promise(r => setTimeout(r, 500));
        }
    };

    // ✅ ONLY CHANGE — Every 1 Hour
    schedule.scheduleJob('0 * * * *', () => {
        console.log(chalk.green('⏰ AutoSend Triggered (Every 1 Hour)'));
        sendAutoMessage();
    });

    // Initial message
    setTimeout(sendAutoMessage, 10000);
};

module.exports.run = async ({ event, api }) => {
    api.sendMessage("✅ AutoSend system running (1 Hour Interval)", event.threadID);
};
