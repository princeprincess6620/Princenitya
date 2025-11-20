module.exports.config = {
    name: "info",
    version: "4.1.0",
    hasPermssion: 0,
    credits: "Priyansh Rajput + ChatGPT Ultra",
    description: "Indian Theme — Admin & Bot Info",
    commandCategory: "system",
    cooldowns: 1,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async function({ api, event }) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
    const moment = require("moment-timezone");

    // Uptime
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    // India Time
    const now = moment.tz("Asia/Kolkata").format("DD MMMM YYYY | hh:mm A");

    // **Indian (Non-Diwali) Images Only**
    const indianImages = [
        "https://i.imgur.com/hMTwntL.jpeg",
        "https://i.imgur.com/q7tCkW3.jpeg",
        "https://i.ibb.co/1T6vJxJ/ai-girl-1.jpg",
        "https://i.ibb.co/CHFj7G4/holi-colors.jpg",        // Holi colors (non-diwali)
        "https://i.ibb.co/TbTd48z/indian-festival.jpg"     // Generic Indian theme
    ];

    const imgURL = indianImages[Math.floor(Math.random() * indianImages.length)];
    const imgPath = __dirname + "/cache/indian_info.jpg";

    try {
        const download = request(encodeURI(imgURL)).pipe(fs.createWriteStream(imgPath));

        download.on("close", () => {
            api.sendMessage(
                {
                    body:
`🇮🇳✨ 𝐈𝐍𝐃𝐈𝐀𝐍 𝐓𝐇𝐄𝐌𝐄 𝐈𝐍𝐅𝐎 𝐏𝐀𝐍𝐄𝐋 ✨🇮🇳
══════════════════════════════

🎉 **Bot Name:** ${global.config.BOTNAME}
👑 **Bot Owner:** LEGEND ARYAN
🔰 **Prefix:** ${global.config.PREFIX}

📆 **Today:** ${now}
⏳ **Uptime:** ${hours}h ${minutes}m ${seconds}s

══════════════════════════════

🌺 **Indian Vibes Message:**  
"खुश रहो, मुस्कुराते रहो,  
और हर दिन कुछ नया सीखते रहो!" 🌼

🇮🇳 रंग, संस्कृति और दोस्ती —  
**यही है भारतीय पहचान.** 💛💚❤️

══════════════════════════════

📌 **Owner Facebook:**  
👉 https://www.facebook.com/thelegendary.473934

🙏 **Thank You for using ${global.config.BOTNAME}!** 🙏

══════════════════════════════
`,
                    attachment: fs.createReadStream(imgPath)
                },
                event.threadID,
                () => fs.unlinkSync(imgPath)
            );
        });

    } catch (e) {
        api.sendMessage("❌ Info Panel load nahi ho paya!", event.threadID);
        console.log(e);
    }
};
