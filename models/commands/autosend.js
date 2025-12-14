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
    usages: 'automatic',
    cooldowns: 0
};

module.exports.onLoad = async ({ api }) => {
    console.log(chalk.blue('🔄 AutoSend System Initializing...'));

    // ACTIVE THREADS TRACKER
    let activeThreads = new Set();
    
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
            emoji: timeEmoji,
            hour: hour
        };
    };

    const createBracket = (info) => {
        let greeting = '';
        if (info.hour >= 5 && info.hour < 12) greeting = 'सुप्रभात! 🌅';
        else if (info.hour >= 12 && info.hour < 17) greeting = 'नमस्कार! ☀️';
        else if (info.hour >= 17 && info.hour < 21) greeting = 'शुभ संध्या! 🌇';
        else greeting = 'शुभ रात्रि! 🌙';

        return `
╔═══════════════════════════════════════════╗
║         🎀 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🎀               ║
╠═══════════════════════════════════════════╣
║    ${greeting}                             ║
║    ${info.emoji}  𝗧𝗶𝗺𝗲: ${info.time}  ${info.emoji}    ║
║    📅 𝗗𝗮𝘁𝗲: ${info.date} ${info.month} ${info.day} ║
║    ⏰ 𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹: 1 𝗛𝗼𝘂𝗿                ║
╚═══════════════════════════════════════════╝

📸 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼: यह फोटो रैंडमली भेजी जा रही है!
        `;
    };

    const getRandomPhoto = () => {
        try {
            // ✅ CORRECTED PATH - 'modules' not 'models'
            const folder = path.join(__dirname, '..', '..', 'autosend');
            console.log(chalk.cyan('📁 Checking folder:'), folder);
            
            if (!fs.existsSync(folder)) {
                console.log(chalk.yellow('⚠️ Folder not found, creating...'));
                fs.mkdirSync(folder, { recursive: true });
                console.log(chalk.green('✅ Created folder:'), folder);
                
                // Create sample message in folder
                const readmePath = path.join(folder, 'README.txt');
                if (!fs.existsSync(readmePath)) {
                    fs.writeFileSync(readmePath, 
                        'Add photos here (jpg, png, gif, webp)\n' +
                        'Path: ' + folder
                    );
                }
                return null;
            }

            const files = fs.readdirSync(folder)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
            
            console.log(chalk.cyan('📸 Photos found:'), files.length);
            
            if (!files.length) {
                console.log(chalk.yellow('⚠️ No photos in autosend folder'));
                console.log(chalk.blue('💡 Add photos to:'), folder);
                return null;
            }

            const randomFile = files[Math.floor(Math.random() * files.length)];
            const photoPath = path.join(folder, randomFile);
            
            console.log(chalk.green('✅ Selected photo:'), randomFile);
            
            if (!fs.existsSync(photoPath)) {
                console.log(chalk.red('❌ Photo file not found'));
                return null;
            }
            
            return fs.createReadStream(photoPath);
            
        } catch (error) {
            console.log(chalk.red('❌ Error getting photo:'), error.message);
            return null;
        }
    };

    const sendAutoMessage = async () => {
        try {
            console.log(chalk.magenta('\n🚀 Starting auto message send...'));
            
            const info = getTimeInfo();
            const message = createBracket(info);
            const photo = getRandomPhoto();

            if (!global.data?.allThreadID || global.data.allThreadID.length === 0) {
                console.log(chalk.red('❌ No threads found in global.data.allThreadID'));
                return;
            }

            console.log(chalk.blue('📊 Total threads in list:'), global.data.allThreadID.length);
            console.log(chalk.blue('✅ Active threads (from previous sends):'), activeThreads.size);

            let successCount = 0;
            let failCount = 0;
            let notInConversationCount = 0;

            // Filter only active threads or try all if none are known
            const threadsToSend = activeThreads.size > 0 
                ? global.data.allThreadID.filter(id => activeThreads.has(id))
                : global.data.allThreadID;

            console.log(chalk.blue('📤 Attempting to send to:'), threadsToSend.length, 'threads');

            // Clear active threads and rebuild
            const newActiveThreads = new Set();

            for (const threadID of threadsToSend) {
                try {
                    const sendObj = { body: message };
                    
                    // Get fresh photo for each thread
                    if (photo) {
                        // Close previous stream and create new one
                        const freshPhoto = getRandomPhoto();
                        if (freshPhoto) {
                            sendObj.attachment = freshPhoto;
                        }
                    }
                    
                    await api.sendMessage(sendObj, threadID);
                    
                    successCount++;
                    newActiveThreads.add(threadID); // Mark as active
                    console.log(chalk.green(`  ✅ Sent to: ${threadID}`));
                    
                    // Wait between messages
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                } catch (err) {
                    failCount++;
                    
                    if (err.message && err.message.includes('1545012')) {
                        notInConversationCount++;
                        console.log(chalk.yellow(`  ⚠️ Not in conversation: ${threadID}`));
                    } else {
                        console.log(chalk.red(`  ❌ Error ${threadID}:`), err.message || 'Unknown error');
                    }
                }
            }

            // Update active threads
            activeThreads = newActiveThreads;
            
            console.log(chalk.green(`\n📊 Report:`));
            console.log(chalk.green(`  ✅ Successful: ${successCount}`));
            console.log(chalk.yellow(`  ⚠️ Not in conversation: ${notInConversationCount}`));
            console.log(chalk.red(`  ❌ Other failures: ${failCount - notInConversationCount}`));
            console.log(chalk.blue(`  📝 Active threads saved: ${activeThreads.size}`));
            
            // Save active threads to file for persistence
            try {
                const dataPath = path.join(__dirname, 'autosend_data.json');
                const saveData = {
                    activeThreads: Array.from(activeThreads),
                    lastUpdated: new Date().toISOString()
                };
                fs.writeFileSync(dataPath, JSON.stringify(saveData, null, 2));
                console.log(chalk.blue('💾 Active threads saved to file'));
            } catch (saveErr) {
                console.log(chalk.yellow('⚠️ Could not save active threads'));
            }
            
        } catch (error) {
            console.log(chalk.red('🔥 Critical error in sendAutoMessage:'), error);
        }
    };

    // Load previously active threads
    try {
        const dataPath = path.join(__dirname, 'autosend_data.json');
        if (fs.existsSync(dataPath)) {
            const savedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            activeThreads = new Set(savedData.activeThreads || []);
            console.log(chalk.green(`📂 Loaded ${activeThreads.size} active threads from previous session`));
        }
    } catch (loadErr) {
        console.log(chalk.yellow('⚠️ Could not load saved thread data'));
    }

    // हर 1 घंटे पर
    schedule.scheduleJob('0 * * * *', () => {
        const now = new Date();
        console.log(chalk.bgGreen.black(`\n⏰ [${now.toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})}] AutoSend Triggered`));
        sendAutoMessage();
    });

    console.log(chalk.green('✅ Scheduled: Every 1 hour at minute 0'));
    
    // CORRECTED FOLDER PATH
    const correctFolder = path.join(__dirname, '..', '..', 'autosend');
    console.log(chalk.yellow('📁 Photo folder should be:'), correctFolder);
    console.log(chalk.blue('💡 Run command:'), '!autosend test');

    // Initial test after 20 seconds
    setTimeout(() => {
        console.log(chalk.cyan('\n🚀 Sending initial test message...'));
        sendAutoMessage();
    }, 20000);
};

module.exports.run = async ({ event, api }) => {
    // Test command
    if (event.body && event.body.toLowerCase().includes('test')) {
        api.sendMessage(
            `🧪 AutoSend Test Mode\n\n` +
            `📁 Photo folder: /autosend/\n` +
            `⏰ Next scheduled: Next hour\n` +
            `🔧 Status: Running\n\n` +
            `Checking system...`,
            event.threadID
        );
        
        // Test photo folder
        const folder = path.join(__dirname, '..', '..', 'autosend');
        if (fs.existsSync(folder)) {
            const files = fs.readdirSync(folder)
                .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
            api.sendMessage(`📸 Photos found: ${files.length}`, event.threadID);
        } else {
            api.sendMessage(`❌ Folder not found: ${folder}`, event.threadID);
        }
        return;
    }
    
    api.sendMessage(
        `✅ AutoSend system is running!\n\n` +
        `📅 हर 1 घंटे पर भेजेगा\n` +
        `🖼️ फोटोज: /autosend/ फोल्डर में\n` +
        `⏰ अगला मैसेज: अगले घंटे की शुरुआत में\n\n` +
        `🧪 Test करने के लिए: !autosend test`,
        event.threadID
    );
};
