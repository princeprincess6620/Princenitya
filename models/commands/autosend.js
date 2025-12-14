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

module.exports.onLoad = function() {
    console.log("🔄 AutoSend System Loading...");
    
    // Photos folder check
    const photoDir = path.join(__dirname, "autosend");
    console.log("📁 Looking for photos in:", photoDir);
    
    if (!fs.existsSync(photoDir)) {
        console.log("📁 Creating autosend folder...");
        fs.mkdirSync(photoDir, { recursive: true });
        console.log("✅ Folder created. Please add photos to:", photoDir);
    }
    
    const photos = fs.readdirSync(photoDir)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    
    console.log(`📸 Found ${photos.length} photos in autosend folder`);
    console.log(`⏰ Auto-send will run every ${AUTO_SEND_INTERVAL} minutes`);
};

module.exports.handleEvent = async function({ api, event }) {
    // Bot startup पर initialize करने के लिए
    if (!autoSendInterval) {
        startAutoSendScheduler(api);
    }
};

// Function to start auto-send scheduler
function startAutoSendScheduler(api) {
    if (autoSendInterval) {
        clearInterval(autoSendInterval);
    }
    
    // प्रत्येक AUTO_SEND_INTERVAL मिनट पर भेजें
    autoSendInterval = setInterval(async () => {
        console.log(`⏰ Auto-send triggered at ${new Date().toLocaleTimeString()}`);
        await sendAutoMessages(api);
    }, AUTO_SEND_INTERVAL * 60 * 1000);
    
    console.log("✅ Auto-send scheduler started");
    
    // Startup पर भी भेजें
    setTimeout(() => {
        sendAutoMessages(api);
    }, 5000);
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
        const photoPath = path.join(__dirname, "autosend");
        let attachments = [];
        
        if (fs.existsSync(photoPath)) {
            const photos = fs.readdirSync(photoPath)
                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            
            if (photos.length > 0) {
                const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                attachments.push(fs.createReadStream(path.join(photoPath, randomPhoto)));
                console.log(`📸 Using photo: ${randomPhoto}`);
            }
        }
        
        // Get all threads (SIMPLIFIED VERSION)
        try {
            // सिर्फ एक sample thread ID पर भेजने के लिए (testing के लिए)
            // असल में आपको सभी threads की list मिलनी चाहिए
            const sampleThreadID = "100000000000000"; // यहाँ अपना thread ID डालें
            
            if (attachments.length > 0) {
                await api.sendMessage({
                    body: message,
                    attachment: attachments
                }, sampleThreadID);
            } else {
                await api.sendMessage(message, sampleThreadID);
            }
            
            console.log("✅ Auto message sent successfully!");
            
        } catch (threadError) {
            console.error("❌ Error sending messages:", threadError);
        }
        
    } catch (error) {
        console.error("❌ Error in sendAutoMessages:", error);
    }
}

// Run command (manual trigger)
module.exports.run = async function({ api, event, args }) {
    await sendAutoMessages(api);
    return api.sendMessage("✅ Auto message sending started manually!", event.threadID, event.messageID);
};

// Handle module unload
module.exports.onUnload = function() {
    if (autoSendInterval) {
        clearInterval(autoSendInterval);
        console.log("🛑 Auto-send scheduler stopped");
    }
};
