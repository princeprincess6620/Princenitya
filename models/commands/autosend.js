const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'autosent',
    version: '5.0.0',
    hasPermssion: 0,
    credits: '𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍',
    description: 'Auto Message Every Hour with Time & Photo',
    commandCategory: 'system',
    usages: 'automatic',
    cooldowns: 0
};

module.exports.onLoad = ({ api }) => {
    // Get Current Time Information
    const getTimeInfo = () => {
        const now = moment().tz('Asia/Kolkata');
        const hour = parseInt(now.format('HH'));
        
        // Determine time of day emoji
        let timeEmoji;
        if (hour >= 5 && hour < 12) timeEmoji = '🌅';
        else if (hour >= 12 && hour < 17) timeEmoji = '☀️';
        else if (hour >= 17 && hour < 21) timeEmoji = '🌇';
        else timeEmoji = '🌙';
        
        return {
            time: now.format('hh:mm A'),
            day: now.format('dddd'),
            month: now.format('MMMM'),
            hour: hour,
            emoji: timeEmoji
        };
    };

    // Create Beautiful Bracket
    const createBracket = (info) => {
        return `
╔═══════════════════════════════════════════╗
║          🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 🎀         ║
║       𝗛𝗼𝘂𝗿𝗹𝘆 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀       ║
╠═══════════════════════════════════════════╣
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘆: ${info.day}                ║
║    📆 𝗠𝗼𝗻𝘁𝗵: ${info.month}           ║
║    ✨ 𝗛𝗮𝘃𝗲 𝗮 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗺𝗼𝗺𝗲𝗻𝘁! ✨     ║
╚═══════════════════════════════════════════╝
        `;
    };

    // Get Random Photo
    const getRandomPhoto = () => {
        try {
            const photosFolder = path.join(__dirname, 'autosend');
            
            if (!fs.existsSync(photosFolder)) {
                fs.mkdirSync(photosFolder, { recursive: true });
                return null;
            }
            
            const files = fs.readdirSync(photosFolder)
                .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
            
            if (files.length === 0) return null;
            
            const randomFile = files[Math.floor(Math.random() * files.length)];
            return fs.createReadStream(path.join(photosFolder, randomFile));
            
        } catch (error) {
            return null;
        }
    };

    // Schedule Hourly Messages
    const rule = new schedule.RecurrenceRule();
    rule.minute = 0;

    const job = schedule.scheduleJob(rule, () => {
        const info = getTimeInfo();
        const message = createBracket(info);
        const photo = getRandomPhoto();
        
        global.data.allThreadID.forEach(threadID => {
            api.sendMessage({
                body: message,
                attachment: photo
            }, threadID, (error) => {
                if (!error) {
                    console.log(chalk.green(`✅ AUTO SENT to ${threadID} at ${info.time}`));
                }
            });
        });
    });

    // Console Display
    const initialInfo = getTimeInfo();
    console.log(chalk.bold.hex('#FF6B9D')(`
╔═══════════════════════════════════════════╗
║          🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 🎀         ║
║       𝗛𝗼𝘂𝗿𝗹𝘆 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀       ║
╠═══════════════════════════════════════════╣
║    ${initialInfo.emoji}  Started: ${initialInfo.time}  ${initialInfo.emoji} ║
║    📅 Day: ${initialInfo.day}                ║
║    📆 Month: ${initialInfo.month}           ║
║    ✨ By: 𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍 ✨               ║
╚═══════════════════════════════════════════╝
    `));

    // Send Initial Message
    setTimeout(() => {
        const info = getTimeInfo();
        const message = createBracket(info);
        const photo = getRandomPhoto();
        
        global.data.allThreadID.forEach(threadID => {
            api.sendMessage({
                body: message,
                attachment: photo
            }, threadID);
        });
    }, 3000);
};

module.exports.run = () => {};
