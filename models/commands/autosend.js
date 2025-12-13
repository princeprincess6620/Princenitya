const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'autosend', // Changed to match folder name
    version: '5.0.0',
    hasPermssion: 0,
    credits: '𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍',
    description: 'Auto Message Every Hour with Time & Photo',
    commandCategory: 'system',
    usages: 'automatic',
    cooldowns: 0
};

module.exports.onLoad = async ({ api }) => {
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
║          🎀 𝗔𝗥𝗬𝗔𝗡 ☄️𝗕𝗢𝗧 𝗦𝗘𝗡𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 🎀         ║
║             𝗕𝗼𝘁 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀                 ║
╠═══════════════════════════════════════════╣
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘆: ${info.day}                ║
║    📆 𝗠𝗼𝗻𝘁𝗵: ${info.month}           ║
║    ✨ 𝗛𝗮𝘃𝗲 𝗮 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗺𝗼𝗺𝗲𝗻𝘁! ✨     ║
╚═══════════════════════════════════════════╝
        `;
    };

    // Get Random Photo - FIXED PATH
    const getRandomPhoto = () => {
        try {
            const photosFolder = path.join(__dirname, '..', 'autosend'); // Fixed path
            
            if (!fs.existsSync(photosFolder)) {
                console.log(chalk.yellow(`⚠️ Folder not found: ${photosFolder}`));
                console.log(chalk.yellow(`ℹ️ Creating folder...`));
                fs.mkdirSync(photosFolder, { recursive: true });
                return null;
            }
            
            const files = fs.readdirSync(photosFolder)
                .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
            
            if (files.length === 0) {
                console.log(chalk.yellow(`⚠️ No photos found in autosend folder`));
                return null;
            }
            
            const randomFile = files[Math.floor(Math.random() * files.length)];
            console.log(chalk.cyan(`📸 Selected photo: ${randomFile}`));
            return fs.createReadStream(path.join(photosFolder, randomFile));
            
        } catch (error) {
            console.log(chalk.red(`❌ Error getting photo: ${error.message}`));
            return null;
        }
    };

    // Function to send messages
    const sendAutoMessage = async () => {
        try {
            const info = getTimeInfo();
            const message = createBracket(info);
            const photo = getRandomPhoto();
            
            // Check if global.data.allThreadID exists
            if (!global.data || !global.data.allThreadID || !Array.isArray(global.data.allThreadID)) {
                console.log(chalk.red('❌ Error: global.data.allThreadID not found or invalid'));
                return;
            }
            
            console.log(chalk.blue(`📤 Sending to ${global.data.allThreadID.length} threads...`));
            
            for (const threadID of global.data.allThreadID) {
                try {
                    await api.sendMessage({
                        body: message,
                        attachment: photo
                    }, threadID);
                    console.log(chalk.green(`✅ Sent to ${threadID} at ${info.time}`));
                } catch (threadError) {
                    console.log(chalk.yellow(`⚠️ Failed to send to ${threadID}: ${threadError.message}`));
                }
                // Delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
        } catch (error) {
            console.log(chalk.red(`❌ Error in sendAutoMessage: ${error.message}`));
        }
    };

    // Schedule Hourly Messages
    const rule = new schedule.RecurrenceRule();
    rule.minute = 0; // Every hour at minute 0

    const job = schedule.scheduleJob(rule, () => {
        console.log(chalk.magenta('⏰ Hourly trigger activated'));
        sendAutoMessage();
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

    console.log(chalk.cyan(`📁 Photo folder: ${path.join(__dirname, '..', 'autosend')}`));

    // Send Initial Message after 5 seconds
    setTimeout(() => {
        console.log(chalk.yellow('🚀 Sending initial message...'));
        sendAutoMessage();
    }, 5000);
};

module.exports.run = async ({ event, api }) => {
    api.sendMessage("✅ AutoSend System is running! Messages will be sent every hour.", event.threadID);
};
