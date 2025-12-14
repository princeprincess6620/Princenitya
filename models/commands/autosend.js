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
    description: 'Auto Message with Photo Every 1 Hour',
    commandCategory: 'system',
    usages: '[test/status]',
    cooldowns: 0
};

// 📝 Shayri Collection
const SHAYRI_LIST = [
    "दिल तोड़ने वाले एक बात याद रखना...\nजिस दिन हम बदल गए, संभाल नहीं पाओगे।",
    "मोहब्बत छोड़ी नहीं जाती,\nवो तो बस दिल से उतर जाती है।",
    "हमने तो प्यार करने में जान लगा दी,\nवो हमसे बात करने में busy हो गए।",
    "सच कहना मुश्किल नहीं,\nसच सुनना मुश्किल होता है।",
    "कभी कभी लगता है,\nशायद मैं किसी के लिए बना ही नहीं।"
];

module.exports.onLoad = async ({ api }) => {
    console.log(chalk.blue('🔄 AutoSend System Initializing...'));

    // Active threads tracker
    let verifiedThreads = new Set();
    
    // Load saved threads if exists
    try {
        const dataPath = path.join(__dirname, 'autosend_cache.json');
        if (fs.existsSync(dataPath)) {
            const saved = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            verifiedThreads = new Set(saved.verifiedThreads || []);
            console.log(chalk.green(`📂 Loaded ${verifiedThreads.size} verified threads`));
        }
    } catch (e) {
        console.log(chalk.yellow('⚠️ Could not load cache'));
    }

    const getTimeInfo = () => {
        const now = moment().tz('Asia/Kolkata');
        const hour = parseInt(now.format('HH'));

        let timeEmoji, greeting;
        if (hour >= 5 && hour < 12) {
            timeEmoji = '🌅';
            greeting = 'सुप्रभात! 🌅';
        } else if (hour >= 12 && hour < 17) {
            timeEmoji = '☀️';
            greeting = 'नमस्कार! ☀️';
        } else if (hour >= 17 && hour < 21) {
            timeEmoji = '🌇';
            greeting = 'शुभ संध्या! 🌇';
        } else {
            timeEmoji = '🌙';
            greeting = 'शुभ रात्रि! 🌙';
        }

        return {
            time: now.format('hh:mm A'),
            day: now.format('dddd'),
            month: now.format('MMMM'),
            date: now.format('DD'),
            emoji: timeEmoji,
            greeting: greeting,
            hour: hour
        };
    };

    const createBracket = (info) => {
        // YOUR BRACKET DESIGN
        return `
╔═══════════════════════════════════════════╗
║         🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀               ║
╠═══════════════════════════════════════════╣
║    ${info.greeting}                             ║
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘁𝗲: ${info.date} ${info.month} ${info.day} ║
║    ⏰ 𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹: 1 𝗛𝗼𝘂𝗿                ║
╚═══════════════════════════════════════════╝
        `;
    };

    const getRandomShayri = () => {
        return SHAYRI_LIST[Math.floor(Math.random() * SHAYRI_LIST.length)];
    };

    const getRandomPhoto = () => {
        try {
            // Try multiple possible paths
            const possiblePaths = [
                path.join(__dirname, '..', '..', 'autosend'),
                path.join(process.cwd(), 'autosend'),
                path.join(__dirname, 'autosend'),
                '/home/runner/work/Aryan-chat/Aryan-chat/autosend'
            ];
            
            let photoFolder = null;
            for (const folderPath of possiblePaths) {
                if (fs.existsSync(folderPath)) {
                    photoFolder = folderPath;
                    console.log(chalk.green(`✅ Found photo folder: ${folderPath}`));
                    break;
                }
            }
            
            if (!photoFolder) {
                // Create folder in current directory
                photoFolder = path.join(process.cwd(), 'autosend');
                fs.mkdirSync(photoFolder, { recursive: true });
                console.log(chalk.yellow(`📁 Created photo folder: ${photoFolder}`));
                return null;
            }

            const files = fs.readdirSync(photoFolder)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
            
            console.log(chalk.cyan(`📸 Photos found: ${files.length}`));
            
            if (files.length === 0) {
                console.log(chalk.yellow('⚠️ No photos in folder'));
                return null;
            }

            const randomFile = files[Math.floor(Math.random() * files.length)];
            const photoPath = path.join(photoFolder, randomFile);
            
            console.log(chalk.green(`✅ Selected: ${randomFile}`));
            return fs.createReadStream(photoPath);
            
        } catch (error) {
            console.log(chalk.red('❌ Photo error:'), error.message);
            return null;
        }
    };

    const sendAutoMessage = async (isTest = false) => {
        try {
            console.log(chalk.magenta('\n🚀 Starting auto message send...'));
            
            const info = getTimeInfo();
            const baseMessage = createBracket(info);
            const shayri = getRandomShayri();
            const photo = getRandomPhoto();
            
            // Final message
            const finalMessage = `${baseMessage}\n\n📝 𝗦𝗣𝗘𝗖𝗜𝗔𝗟 𝗦𝗛𝗔𝗬𝗥𝗜:\n${shayri}\n\n📸 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼: ${photo ? 'Attached ✓' : 'No photo folder found'}`;
            
            console.log(chalk.blue('📝 Message ready'));
            console.log(chalk.blue('🖼️ Photo:'), photo ? 'Attached' : 'Not attached');

            if (!global.data?.allThreadID || global.data.allThreadID.length === 0) {
                console.log(chalk.red('❌ No threads in global.data.allThreadID'));
                return;
            }

            // Filter threads
            let threadsToSend = [];
            if (verifiedThreads.size > 0) {
                // Use verified threads only
                threadsToSend = global.data.allThreadID.filter(id => verifiedThreads.has(id));
                console.log(chalk.blue(`📤 Using ${threadsToSend.length} verified threads`));
            } else {
                // First run - test all threads
                threadsToSend = global.data.allThreadID.slice(0, isTest ? 3 : undefined);
                console.log(chalk.yellow(`🔄 Testing ${threadsToSend.length} threads (first run)`));
            }

            if (threadsToSend.length === 0) {
                console.log(chalk.red('❌ No threads to send to'));
                return;
            }

            let successCount = 0;
            let failCount = 0;
            const newVerifiedThreads = new Set();

            for (const threadID of threadsToSend) {
                try {
                    const sendObj = { body: finalMessage };
                    
                    // For each thread, get fresh photo stream
                    if (photo) {
                        const freshPhoto = getRandomPhoto();
                        if (freshPhoto) {
                            sendObj.attachment = freshPhoto;
                        }
                    }
                    
                    await api.sendMessage(sendObj, threadID);
                    
                    successCount++;
                    newVerifiedThreads.add(threadID);
                    console.log(chalk.green(`  ✅ Sent to: ${threadID}`));
                    
                    // Delay between messages
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (err) {
                    failCount++;
                    if (err.message && err.message.includes('1545012')) {
                        console.log(chalk.yellow(`  ⚠️ Not in conversation: ${threadID}`));
                    } else {
                        console.log(chalk.red(`  ❌ Error: ${err.message || 'Unknown'}`));
                    }
                }
            }

            // Update verified threads
            verifiedThreads = newVerifiedThreads;
            
            // Save to cache
            try {
                const dataPath = path.join(__dirname, 'autosend_cache.json');
                fs.writeFileSync(dataPath, JSON.stringify({
                    verifiedThreads: Array.from(verifiedThreads),
                    lastUpdated: new Date().toISOString()
                }, null, 2));
            } catch (e) {
                console.log(chalk.yellow('⚠️ Could not save cache'));
            }

            console.log(chalk.green(`\n📊 Report:`));
            console.log(chalk.green(`  ✅ Successful: ${successCount}`));
            console.log(chalk.red(`  ❌ Failed: ${failCount}`));
            console.log(chalk.blue(`  💾 Verified threads saved: ${verifiedThreads.size}`));
            
        } catch (error) {
            console.log(chalk.red('🔥 Critical error:'), error);
        }
    };

    // 🕐 SCHEDULE: Every 1 hour at minute 0
    schedule.scheduleJob('0 * * * *', () => {
        const now = moment().tz('Asia/Kolkata');
        console.log(chalk.bgGreen.black(`\n⏰ [${now.format('HH:mm')}] AutoSend Triggered`));
        sendAutoMessage();
    });

    console.log(chalk.green('✅ Scheduled: Every 1 hour (at :00 minutes)'));
    
    // Initial test after 30 seconds
    setTimeout(() => {
        console.log(chalk.cyan('\n🧪 Sending initial test...'));
        sendAutoMessage(true);
    }, 30000);
};

module.exports.run = async ({ event, api, args }) => {
    const command = args[0]?.toLowerCase();
    
    if (command === 'test') {
        api.sendMessage(
            `🧪 AutoSend Test Mode\n\n` +
            `✅ System is running\n` +
            `🕐 Next scheduled: Next hour\n` +
            `📝 Shayri database: ${SHAYRI_LIST.length} messages\n` +
            `⚡ Status: Active\n\n` +
            `Test message will be sent to 3 threads only.`,
            event.threadID
        );
        return;
    }
    
    if (command === 'status') {
        try {
            const cachePath = path.join(__dirname, 'autosend_cache.json');
            let verifiedCount = 0;
            if (fs.existsSync(cachePath)) {
                const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
                verifiedCount = data.verifiedThreads?.length || 0;
            }
            
            api.sendMessage(
                `📊 AutoSend Status\n\n` +
                `✅ System: Running\n` +
                `🕐 Schedule: Every 1 hour\n` +
                `📝 Shayri: ${SHAYRI_LIST.length} messages\n` +
                `✅ Verified threads: ${verifiedCount}\n` +
                `🔄 Next run: Next hour\n\n` +
                `Commands: !autosend test, !autosend status`,
                event.threadID
            );
        } catch (e) {
            api.sendMessage(`📊 AutoSend Status: Running\nSchedule: Every 1 hour`, event.threadID);
        }
        return;
    }
    
    // Default response
    api.sendMessage(
        `╔══════════════════════════════════╗\n` +
        `║     🎀 𝗔𝗨𝗧𝗢𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀        ║\n` +
        `╠══════════════════════════════════╣\n` +
        `║  ✅ System is running            ║\n` +
        `║  🕐 Schedule: Every 1 hour       ║\n` +
        `║  📝 Shayri: ${SHAYRI_LIST.length} messages     ║\n` +
        `║  📸 Photos: Auto-send if exist  ║\n` +
        `║                                  ║\n` +
        `║  📌 Commands:                   ║\n` +
        `║  • !autosend test               ║\n` +
        `║  • !autosend status             ║\n` +
        `╚══════════════════════════════════╝`,
        event.threadID
    );
};
