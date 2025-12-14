const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'autosend',
    version: '7.0.0',
    hasPermssion: 0,
    credits: '𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍',
    description: 'Simple Auto Message - Every 1 Hour',
    commandCategory: 'system',
    usages: '[on/off/test]',
    cooldowns: 0
};

// Simple message templates
const MESSAGES = [
    "आज का दिन आपके लिए शुभ हो! 🌟",
    "मुस्कुराते रहिए, खुश रहिए! 😊",
    "हर पल नया अवसर लेकर आता है! ✨",
    "आपकी मेहनत रंग लाएगी! 💪",
    "सकारात्मक सोच से हर मुश्किल आसान हो जाती है! 🌈"
];

// Global state
let isEnabled = true;
let currentThread = null; // सिर्फ एक thread में भेजेगा

module.exports.onLoad = async ({ api }) => {
    console.log(chalk.blue('🤖 Simple AutoSend v7.0 Started'));
    
    // Load settings
    try {
        const settingsPath = path.join(__dirname, 'autosend_settings.json');
        if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            isEnabled = settings.isEnabled !== false;
            currentThread = settings.currentThread;
            console.log(chalk.green(`📂 Settings loaded: ${isEnabled ? 'ENABLED' : 'DISABLED'}`));
            if (currentThread) {
                console.log(chalk.blue(`🎯 Target thread: ${currentThread}`));
            }
        }
    } catch (e) {
        console.log(chalk.yellow('⚠️ No settings found'));
    }

    const getTimeInfo = () => {
        const now = moment().tz('Asia/Kolkata');
        const hour = parseInt(now.format('HH'));

        let timeEmoji, greeting;
        if (hour >= 5 && hour < 12) {
            timeEmoji = '🌅';
            greeting = 'सुप्रभात!';
        } else if (hour >= 12 && hour < 17) {
            timeEmoji = '☀️';
            greeting = 'नमस्कार!';
        } else if (hour >= 17 && hour < 21) {
            timeEmoji = '🌇';
            greeting = 'शुभ संध्या!';
        } else {
            timeEmoji = '🌙';
            greeting = 'शुभ रात्रि!';
        }

        return {
            time: now.format('hh:mm A'),
            day: now.format('dddd'),
            month: now.format('MMMM'),
            date: now.format('DD'),
            emoji: timeEmoji,
            greeting: greeting
        };
    };

    const createMessage = (info) => {
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        
        return `
╔═══════════════════════════════════════════╗
║         🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀               ║
╠═══════════════════════════════════════════╣
║    ${info.greeting} ${info.emoji}                       ║
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘁𝗲: ${info.date} ${info.month} ${info.day} ║
║    ⏰ 𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹: 1 𝗛𝗼𝘂𝗿                ║
╚═══════════════════════════════════════════╝

💌 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${randomMsg}
        `;
    };

    const getPhotoAttachment = () => {
        try {
            // Check multiple possible locations
            const possibleFolders = [
                path.join(__dirname, 'autosend'),
                path.join(__dirname, '..', 'autosend'),
                path.join(process.cwd(), 'autosend'),
                '/home/runner/work/Aryan-chat/Aryan-chat/autosend'
            ];
            
            let photoFolder = null;
            for (const folder of possibleFolders) {
                if (fs.existsSync(folder)) {
                    const files = fs.readdirSync(folder)
                        .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
                    if (files.length > 0) {
                        photoFolder = folder;
                        console.log(chalk.green(`📸 Found ${files.length} photos in ${folder}`));
                        break;
                    }
                }
            }
            
            if (!photoFolder) {
                // Create default folder
                photoFolder = path.join(__dirname, 'autosend');
                fs.mkdirSync(photoFolder, { recursive: true });
                console.log(chalk.yellow(`📁 Created folder: ${photoFolder}`));
                
                // Add sample photo (optional)
                const samplePath = path.join(photoFolder, 'sample.txt');
                fs.writeFileSync(samplePath, 'Add photos here (jpg, png, etc.)\nBot will send random photo every hour.');
                return null;
            }
            
            const files = fs.readdirSync(photoFolder)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
            
            if (files.length === 0) {
                return null;
            }
            
            const randomFile = files[Math.floor(Math.random() * files.length)];
            const photoPath = path.join(photoFolder, randomFile);
            
            console.log(chalk.cyan(`✅ Selected: ${randomFile}`));
            
            // Read file as buffer for attachment
            return fs.readFileSync(photoPath);
            
        } catch (error) {
            console.log(chalk.yellow(`⚠️ Photo error: ${error.message}`));
            return null;
        }
    };

    const sendMessage = async (threadID = null) => {
        if (!isEnabled) {
            console.log(chalk.yellow('⏸️ AutoSend is disabled'));
            return;
        }
        
        const targetThread = threadID || currentThread;
        
        if (!targetThread) {
            console.log(chalk.red('❌ No thread configured!'));
            console.log(chalk.yellow('💡 Use: !autosend setthread to set current thread'));
            return;
        }

        try {
            console.log(chalk.magenta(`\n🚀 Sending to thread: ${targetThread}`));
            
            const info = getTimeInfo();
            const message = createMessage(info);
            const photoBuffer = getPhotoAttachment();
            
            // Prepare message object
            const messageObj = {
                body: message
            };
            
            // Add attachment if available
            if (photoBuffer) {
                messageObj.attachment = photoBuffer;
            }
            
            console.log(chalk.blue('📝 Message ready'));
            console.log(chalk.blue('🖼️ Attachment:'), photoBuffer ? 'Yes' : 'No');
            
            // 🔧 FIXED: Simple API call with error handling
            try {
                // Try different API methods based on your bot framework
                const result = await api.sendMessage(messageObj, targetThread);
                console.log(chalk.green(`✅ Successfully sent to ${targetThread}`));
                
                // Save successful thread
                if (!currentThread) {
                    currentThread = targetThread;
                    saveSettings();
                }
                
                return true;
            } catch (apiError) {
                console.log(chalk.red(`❌ API Error: ${apiError.message}`));
                
                // Specific error handling
                if (apiError.message.includes('404') || apiError.message.includes('not found')) {
                    console.log(chalk.yellow('⚠️ Thread not found or bot removed'));
                    currentThread = null;
                    saveSettings();
                } else if (apiError.message.includes('1545012')) {
                    console.log(chalk.yellow('⚠️ Bot not in conversation'));
                }
                
                return false;
            }
            
        } catch (error) {
            console.log(chalk.red(`🔥 Error: ${error.message}`));
            return false;
        }
    };

    // Save settings
    const saveSettings = () => {
        try {
            const settingsPath = path.join(__dirname, 'autosend_settings.json');
            const settings = {
                isEnabled: isEnabled,
                currentThread: currentThread,
                lastUpdated: new Date().toISOString()
            };
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            console.log(chalk.blue('💾 Settings saved'));
        } catch (e) {
            console.log(chalk.yellow('⚠️ Could not save settings'));
        }
    };

    // 🕐 Schedule: Every hour at minute 0
    schedule.scheduleJob('0 * * * *', () => {
        if (!isEnabled) return;
        
        const now = moment().tz('Asia/Kolkata');
        console.log(chalk.bgGreen.black(`\n⏰ [${now.format('HH:mm')}] Scheduled AutoSend`));
        sendMessage();
    });

    // 🕐 Additional schedule: Every 6 hours (backup)
    schedule.scheduleJob('0 */6 * * *', () => {
        if (!isEnabled || !currentThread) return;
        
        console.log(chalk.cyan('\n🔄 6-hour backup check'));
        sendMessage();
    });

    console.log(chalk.green('✅ Scheduled: Every hour at :00 minutes'));
    console.log(chalk.blue('💡 Commands: !autosend on/off/test/setthread'));
    
    // Initial test after 30 seconds
    setTimeout(() => {
        if (isEnabled && currentThread) {
            console.log(chalk.cyan('\n🧪 Initial test in 30 seconds...'));
        }
    }, 30000);
};

module.exports.run = async ({ event, api, args }) => {
    const command = args[0]?.toLowerCase();
    const threadID = event.threadID;
    
    // Load module functions
    const modulePath = path.join(__dirname, 'autosend.js');
    
    if (command === 'on' || command === 'enable') {
        isEnabled = true;
        saveSettings();
        
        api.sendMessage(
            `✅ AutoSend ENABLED\n\n` +
            `Now sending messages every hour.\n` +
            `Current thread: ${currentThread || 'Not set'}\n\n` +
            `Use !autosend setthread to set this thread.`,
            threadID
        );
        return;
    }
    
    if (command === 'off' || command === 'disable') {
        isEnabled = false;
        saveSettings();
        
        api.sendMessage(
            `⏸️ AutoSend DISABLED\n\n` +
            `Hourly messages stopped.\n` +
            `Use !autosend on to enable again.`,
            threadID
        );
        return;
    }
    
    if (command === 'setthread') {
        currentThread = threadID;
        saveSettings();
        
        api.sendMessage(
            `🎯 Thread SET\n\n` +
            `This thread is now configured for AutoSend:\n` +
            `Thread ID: ${threadID}\n\n` +
            `You will receive messages every hour.\n` +
            `Status: ${isEnabled ? 'ENABLED ✅' : 'DISABLED ⏸️'}`,
            threadID
        );
        return;
    }
    
    if (command === 'test') {
        api.sendMessage(
            `🧪 Sending test message...\n` +
            `Thread: ${currentThread || 'Not set'}\n` +
            `Status: ${isEnabled ? 'ENABLED' : 'DISABLED'}`,
            threadID
        );
        
        // Send test message
        setTimeout(async () => {
            try {
                const info = getTimeInfo();
                const testMsg = `🧪 TEST MESSAGE\n\n` +
                               `Time: ${info.time}\n` +
                               `Date: ${info.date} ${info.month}\n` +
                               `Thread: ${currentThread || 'Not set'}\n` +
                               `Status: ${isEnabled ? 'ACTIVE' : 'INACTIVE'}`;
                
                await api.sendMessage({ body: testMsg }, threadID);
            } catch (error) {
                api.sendMessage(`❌ Test failed: ${error.message}`, threadID);
            }
        }, 1000);
        return;
    }
    
    if (command === 'status') {
        const settingsPath = path.join(__dirname, 'autosend_settings.json');
        let lastUpdated = 'Never';
        if (fs.existsSync(settingsPath)) {
            try {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                lastUpdated = settings.lastUpdated ? 
                    moment(settings.lastUpdated).tz('Asia/Kolkata').format('DD/MM HH:mm') : 
                    'Never';
            } catch (e) {}
        }
        
        // Check photo folder
        let photoCount = 0;
        const photoFolder = path.join(__dirname, 'autosend');
        if (fs.existsSync(photoFolder)) {
            photoCount = fs.readdirSync(photoFolder)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length;
        }
        
        api.sendMessage(
            `📊 AutoSend Status\n\n` +
            `⚡ Version: 7.0\n` +
            `📅 Schedule: Every 1 hour\n` +
            `🎯 Target thread: ${currentThread || 'Not set'}\n` +
            `📸 Photos: ${photoCount} in folder\n` +
            `🔧 Status: ${isEnabled ? 'ENABLED ✅' : 'DISABLED ⏸️'}\n` +
            `🕒 Last updated: ${lastUpdated}\n\n` +
            `📌 Commands:\n` +
            `• !autosend on/off - Enable/disable\n` +
            `• !autosend setthread - Set this thread\n` +
            `• !autosend test - Send test\n` +
            `• !autosend status - Show this info`,
            threadID
        );
        return;
    }
    
    if (command === 'help') {
        api.sendMessage(
            `🆘 AutoSend Help\n\n` +
            `This bot sends automatic messages every hour.\n\n` +
            `🔧 SETUP:\n` +
            `1. !autosend setthread - Set current thread\n` +
            `2. !autosend on - Enable messages\n` +
            `3. Add photos to 'autosend' folder\n\n` +
            `📋 COMMANDS:\n` +
            `• on/off - Enable/disable\n` +
            `• setthread - Set current thread\n` +
            `• test - Send test message\n` +
            `• status - Check status\n` +
            `• help - This message`,
            threadID
        );
        return;
    }
    
    // DEFAULT MESSAGE
    api.sendMessage(
        `🤖 AutoSend Bot v7.0\n\n` +
        `I send automatic messages every hour.\n\n` +
        `⚡ Quick Setup:\n` +
        `1. Type: !autosend setthread\n` +
        `2. Type: !autosend on\n` +
        `3. Wait for hourly messages\n\n` +
        `📌 Type !autosend help for all commands`,
        threadID
    );
    
    // Helper functions
    function getTimeInfo() {
        const now = moment().tz('Asia/Kolkata');
        const hour = parseInt(now.format('HH'));
        
        let timeEmoji, greeting;
        if (hour >= 5 && hour < 12) {
            timeEmoji = '🌅';
            greeting = 'सुप्रभात!';
        } else if (hour >= 12 && hour < 17) {
            timeEmoji = '☀️';
            greeting = 'नमस्कार!';
        } else if (hour >= 17 && hour < 21) {
            timeEmoji = '🌇';
            greeting = 'शुभ संध्या!';
        } else {
            timeEmoji = '🌙';
            greeting = 'शुभ रात्रि!';
        }
        
        return {
            time: now.format('hh:mm A'),
            day: now.format('dddd'),
            month: now.format('MMMM'),
            date: now.format('DD'),
            emoji: timeEmoji,
            greeting: greeting
        };
    }
    
    function saveSettings() {
        try {
            const settingsPath = path.join(__dirname, 'autosend_settings.json');
            const settings = {
                isEnabled: isEnabled,
                currentThread: currentThread,
                lastUpdated: new Date().toISOString()
            };
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        } catch (e) {}
    }
};
