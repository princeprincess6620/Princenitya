
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "autosend",
    version: "2.0.0",
    credits: "𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍",
    description: "Auto send messages with photos",
    hasPermssion: 2,
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

// Bot start hote hi chalu ho jayega
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
    
    // Function to send auto messages
    async function sendAutoMessages() {
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
            
            if (hours < 12) {
                greeting = "Good Morning! 🌅";
                emoji = "🌅";
            } else if (hours < 17) {
                greeting = "Good Afternoon! ☀️";
                emoji = "☀️";
            } else if (hours < 21) {
                greeting = "Good Evening! 🌇";
                emoji = "🌇";
            } else {
                greeting = "Good Night! 🌙";
                emoji = "🌙";
            }
            
            // Create message
            const message = `
╔════════════════════════════════╗
║     𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 𝐀𝐔𝐓𝐎 𝐒𝐄𝐍𝐃     ║
╠════════════════════════════════╣
║    ${emoji} ${greeting}     ║
║    ⏰ Time: ${timeStr}             ║
║    📅 ${now.toDateString()}       ║
║    💖 Stay Happy & Blessed!     ║
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
                }
            }
            
            // Get all groups
            let allThreads = [];
            try {
                allThreads = await api.getThreadList(100, null, ['INBOX']);
            } catch (e) {
                console.log("⚠️ Using global.data for threads");
                if (global.data && global.data.allThreadID) {
                    allThreads = global.data.allThreadID.map(id => ({ threadID: id, isGroup: true }));
                }
            }
            
            const groups = allThreads.filter(t => t.isGroup);
            console.log(`👥 Found ${groups.length} groups`);
            
            // Send to each group
            let successCount = 0;
            for (const group of groups) {
                try {
                    const sendObj = { body: message };
                    
                    if (attachment) {
                        // Create new stream for each send
                        const photos = fs.readdirSync(photoPath)
                            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
                        
                        if (photos.length > 0) {
                            const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                            sendObj.attachment = fs.createReadStream(path.join(photoPath, randomPhoto));
                        }
                    }
                    
                    await api.sendMessage(sendObj, group.threadID);
                    successCount++;
                    console.log(`✅ Sent to group ${successCount}/${groups.length}`);
                    
                    // Wait 2 seconds between sends
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                } catch (err) {
                    console.log(`⚠️ Failed for group: ${err.message}`);
                }
            }
            
            console.log(`🎉 Sent ${successCount} messages successfully!`);
            console.log(`🕐 Next message in 1 hour\n`);
            
        } catch (error) {
            console.log("❌ Auto send error:", error.message);
        }
    }
    
    // First message after 10 seconds
    setTimeout(() => {
        console.log("🚀 Sending first auto message...");
        sendAutoMessages();
    }, 10000);
    
    // Then every 1 hour
    setInterval(() => {
        sendAutoMessages();
    }, 60 * 60 * 1000); // 1 hour
    
    console.log("✅ AutoSend System Ready!");
    console.log("📅 Messages will be sent every hour automatically\n");
};

// Manual trigger ke liye
module.exports.run = async function({ api, event }) {
    console.log("👤 Manual trigger by user");
    
    // Show available photos
    const photoDir = path.join(__dirname, "autosend");
    if (fs.existsSync(photoDir)) {
        const photos = fs.readdirSync(photoDir)
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        
        if (photos.length > 0) {
            await api.sendMessage(
                `📸 AutoSend System Active!\n\n` +
                `✅ Photos available: ${photos.length}\n` +
                `🕐 Next auto message in 1 hour\n` +
                `📁 Folder: autosend/\n\n` +
                `Sample photos:\n` +
                photos.slice(0, 3).map(p => `• ${p}`).join('\n') +
                (photos.length > 3 ? `\n• ... and ${photos.length - 3} more` : ''),
                event.threadID
            );
        } else {
            await api.sendMessage(
                "⚠️ AutoSend System Active but no photos found!\n" +
                "Please add photos to the 'autosend' folder",
                event.threadID
            );
        }
    } else {
        await api.sendMessage(
            "❌ autosend folder not found!\n" +
            "Creating folder... Please add photos there",
            event.threadID
        );
    }
};
