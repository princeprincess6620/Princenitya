const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "autosend",
    version: "2.0.0",
    credits: "𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍",
    description: "Auto send messages with photos - Har 1 ghante par",
    hasPermssion: 2,
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

// Auto-send timing - Har 1 ghante par
const AUTO_SEND_INTERVAL = 60;  // 60 minutes (1 hour)
let autoSendInterval = null;
let lastSentHour = -1;

module.exports.onLoad = function({ api }) {
    console.log("🔄 AutoSend System Loading...");
    
    // Photos folder check
    const photoDir = path.join(__dirname, "autosend");
    console.log("📁 Looking for photos in:", photoDir);
    
    if (fs.existsSync(photoDir)) {
        const photos = fs.readdirSync(photoDir)
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        console.log(`📸 Found ${photos.length} photos in autosend folder`);
        
        if (photos.length > 0) {
            console.log("✅ Photos available:");
            photos.slice(0, 5).forEach(photo => console.log(`   - ${photo}`));
            if (photos.length > 5) console.log(`   ... and ${photos.length - 5} more`);
        } else {
            console.log("⚠️ No photos found in autosend folder!");
        }
    } else {
        console.log("❌ autosend folder not found!");
        console.log("📁 Creating folder...");
        fs.mkdirSync(photoDir, { recursive: true });
    }
    
    // Start the auto-send scheduler
    startAutoSendScheduler(api);
    
    console.log(`⏰ Auto-send scheduled: Har ${AUTO_SEND_INTERVAL} minute par`);
};

// Function to start auto-send scheduler
function startAutoSendScheduler(api) {
    // Clear any existing interval
    if (autoSendInterval) {
        clearInterval(autoSendInterval);
    }
    
    // Check every minute if we should send messages
    autoSendInterval = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Check if it's exactly hour mark (like 1:00, 2:00, etc.)
        if (currentMinute === 0) {
            // Check if we haven't sent for this hour yet
            if (currentHour !== lastSentHour) {
                console.log(`⏰ Auto-send triggered at ${currentHour}:00`);
                lastSentHour = currentHour;
                sendAutoMessages(api);
            }
        }
    }, 60000); // Check every minute (60000 ms)
    
    console.log("✅ Auto-send scheduler started - Har ghante ke shuru par");
    
    // Also send immediately on startup
    sendAutoMessages(api);
}

// Function to send auto messages
async function sendAutoMessages(api) {
    try {
        console.log("\n⏰ Starting auto message send...");
        
        // Get time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        
        // Greeting based on time
        let greeting = "Hello!";
        let emoji = "👋";
        let timePeriod = "";
        
        if (hours < 4) {
            greeting = "Midnight Vibes! 🌙✨";
            emoji = "🌙✨";
            timePeriod = "रात के समय";
        } else if (hours < 12) {
            greeting = "Good Morning! 🌅";
            emoji = "🌅";
            timePeriod = "सुबह के समय";
        } else if (hours < 17) {
            greeting = "Good Afternoon! ☀️";
            emoji = "☀️";
            timePeriod = "दोपहर के समय";
        } else if (hours < 21) {
            greeting = "Good Evening! 🌇";
            emoji = "🌇";
            timePeriod = "शाम के समय";
        } else {
            greeting = "Good Night! 🌙";
            emoji = "🌙";
            timePeriod = "रात के समय";
        }
        
        // Create message
        const message = `
╔════════════════════════════════╗
║     𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 𝐀𝐔𝐓𝐎 𝐒𝐄𝐍𝐃     ║
╠════════════════════════════════╣
║    ${emoji} ${greeting}        ║
║    ⏰ समय: ${timeStr}          ║
║    📅 ${now.toDateString()}   ║
║    🕐 हर घंटे ऑटो मैसेज       ║
║    🌟 ${timePeriod}           ║
║    💖 खुश रहें आशीर्वाद लें! ║
╚════════════════════════════════╝
        `;
        
        // Get random photo from autosend folder
        let attachment = null;
        const photoPath = path.join(__dirname, "autosend");
        
        if (fs.existsSync(photoPath)) {
            const photos = fs.readdirSync(photoPath)
                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            
            if (photos.length > 0) {
                const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                const fullPath = path.join(photoPath, randomPhoto);
                attachment = fs.createReadStream(fullPath);
                console.log(`📸 Using photo: ${randomPhoto}`);
            } else {
                console.log("⚠️ No photos found, sending text only");
            }
        }
        
        // Get all threads
        api.getThreadList(100, null, ["INBOX"], (err, list) => {
            if (err) {
                console.error("❌ Error getting thread list:", err);
                return;
            }
            
            let sentCount = 0;
            const personalThreads = list.filter(thread => !thread.isGroup && !thread.isArchived);
            
            console.log(`📋 Found ${personalThreads.length} personal threads`);
            
            // Send to each thread with delay
            const sendNext = (index) => {
                if (index >= personalThreads.length) {
                    console.log(`✅ Total messages sent: ${sentCount}`);
                    return;
                }
                
                const thread = personalThreads[index];
                
                setTimeout(() => {
                    try {
                        const sendCallback = (err) => {
                            if (!err) {
                                sentCount++;
                                console.log(`✅ Sent to: ${thread.name || thread.threadID}`);
                            } else {
                                console.log(`❌ Error sending to ${thread.name || thread.threadID}`);
                            }
                            // Send next message
                            sendNext(index + 1);
                        };
                        
                        if (attachment) {
                            // Create new stream for each message
                            const photoPath = path.join(__dirname, "autosend");
                            const photos = fs.readdirSync(photoPath)
                                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
                            if (photos.length > 0) {
                                const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                                const fullPath = path.join(photoPath, randomPhoto);
                                const newAttachment = fs.createReadStream(fullPath);
                                
                                api.sendMessage({
                                    body: message,
                                    attachment: newAttachment
                                }, thread.threadID, sendCallback);
                            } else {
                                api.sendMessage(message, thread.threadID, sendCallback);
                            }
                        } else {
                            api.sendMessage(message, thread.threadID, sendCallback);
                        }
                    } catch (sendErr) {
                        console.error(`❌ Error sending to ${thread.threadID}:`, sendErr);
                        sendNext(index + 1);
                    }
                }, 2000); // 2 second delay between messages
            };
            
            // Start sending
            sendNext(0);
        });
        
    } catch (error) {
        console.error("❌ Error in sendAutoMessages:", error);
    }
}

// Handle module unload
module.exports.onUnload = function() {
    if (autoSendInterval) {
        clearInterval(autoSendInterval);
        console.log("🛑 Auto-send scheduler stopped");
    }
};
