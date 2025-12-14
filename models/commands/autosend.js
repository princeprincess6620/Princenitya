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
    console.log(chalk.blue('🔄 AutoSend System Initializing...'));
    
    // Debug log
    console.log(chalk.yellow('📋 Global data check:'), global.data ? 'Exists' : 'Not Found');
    if (global.data?.allThreadID) {
        console.log(chalk.yellow('📌 Threads found:'), global.data.allThreadID.length);
    }

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
║         🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀               ║
╠═══════════════════════════════════════════╣
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘁𝗲: ${info.date} ${info.month} ${info.day} ║
║    ⏰ 𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹: 1 𝗛𝗼𝘂𝗿                ║
╚═══════════════════════════════════════════╝
        `;
    };

    const getRandomPhoto = () => {
        const folder = path.join(__dirname, '..', 'autosend');
        console.log(chalk.cyan('📁 Checking folder:'), folder);
        
        if (!fs.existsSync(folder)) {
            console.log(chalk.red('❌ Folder not found, creating...'));
            fs.mkdirSync(folder, { recursive: true });
            return null;
        }

        const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        console.log(chalk.cyan('📸 Photos found:'), files.length);
        
        if (!files.length) {
            console.log(chalk.yellow('⚠️ No photos in autosend folder'));
            return null;
        }

        const randomFile = files[Math.floor(Math.random() * files.length)];
        console.log(chalk.green('✅ Selected photo:'), randomFile);
        
        return fs.createReadStream(path.join(folder, randomFile));
    };

    const sendAutoMessage = async () => {
        try {
            console.log(chalk.magenta('🚀 Starting auto message send...'));
            
            const info = getTimeInfo();
            const message = createBracket(info);
            const photo = getRandomPhoto();

            if (!global.data?.allThreadID || global.data.allThreadID.length === 0) {
                console.log(chalk.red('❌ No threads found in global.data.allThreadID'));
                return;
            }

            console.log(chalk.blue('📤 Sending to threads:'), global.data.allThreadID.length);

            for (const id of global.data.allThreadID) {
                try {
                    await api.sendMessage({ 
                        body: message, 
                        attachment: photo 
                    }, id);
                    console.log(chalk.green(`✅ Sent to thread: ${id}`));
                    await new Promise(r => setTimeout(r, 500)); // Delay between sends
                } catch (err) {
                    console.log(chalk.red(`❌ Error sending to ${id}:`), err.message);
                }
            }
            
            console.log(chalk.green('🎉 Auto message completed!'));
        } catch (error) {
            console.log(chalk.red('🔥 Critical error in sendAutoMessage:'), error);
        }
    };

    // Schedule every hour
    schedule.scheduleJob('0 * * * *', () => {
        const now = new Date();
        console.log(chalk.bgGreen.black(`⏰ [${now.toLocaleTimeString()}] AutoSend Triggered`));
        sendAutoMessage();
    });

    console.log(chalk.green('✅ Scheduled job set for every hour'));

    // Initial test after 10 seconds
    setTimeout(() => {
        console.log(chalk.cyan('🚀 Sending initial test message...'));
        sendAutoMessage();
    }, 10000);
};

module.exports.run = async ({ event, api }) => {
    api.sendMessage("✅ AutoSend system is running (1 Hour Interval)\n\nCheck console for logs.", event.threadID);
};
