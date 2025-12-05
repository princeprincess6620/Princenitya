module.exports.config = {
  name: "uid",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "ARIF-BABU × Modified by Grok",
  description: "Ultra Premium Dark Glow UID Card (2025 Trending Style)",
  commandCategory: "Tools",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const Canvas = require("canvas");

  let uid = Object.keys(event.mentions)[0] || senderID;

  try {
    const userInfo = await api.getUserInfo(uid);
    const info = userInfo[uid];
    const name = info.name;
    const gender = info.gender === 1 ? "Female" : info.gender === 2 ? "Male" : "Hidden";
    const profileUrl = info.profileUrl || `https://facebook.com/${uid}`;

    // DP Download
    const dpUrl = `https://graph.facebook.com/${uid}/picture?width=1080&height=1080&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const dpPath = __dirname + `/cache/dp_${uid}.jpg`;
    const { data } = await axios.get(dpUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(dpPath, Buffer.from(data));

    // Create Canvas
    const canvas = Canvas.createCanvas(900, 600);
    const ctx = canvas.getContext("2d");

    // Dark Background with Glass Effect
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, 900, 600);

    // Glass Morphism Background
    ctx.fillStyle = "rgba(20, 20, 40, 0.6)";
    ctx.fillRect(30, 30, 840, 540);

    // Neon Border
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.strokeRect(30, 30, 840, 540);

    // Circular DP with Multiple Glow Rings
    const img = await Canvas.loadImage(dpPath);
    
    // Outer Glow Ring
    ctx.beginPath();
    ctx.arc(180, 300, 130, 0, Math.PI * 2);
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 12;
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 40;
    ctx.stroke();

    // Middle Glow
    ctx.beginPath();
    ctx.arc(180, 300, 115, 0, Math.PI * 2);
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 8;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 30;
    ctx.stroke();

    // Inner Circle Clip
    ctx.beginPath();
    ctx.arc(180, 300, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 80, 200, 200, 200);

    // Name - Neon Glow Text
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00ffff";
    ctx.font = "bold 48px 'Arial'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(name.length > 18 ? name.slice(0,18)+"..." : name, 320, 150);

    // UID - Electric Style
    ctx.shadowColor = "#ff00ff";
    ctx.font = "bold 36px 'Courier New'";
    ctx.fillStyle = "#ff00ff";
    ctx.fillText("UID:", 320, 220);
    ctx.fillStyle = "#00ffff";
    ctx.fillText(uid, 420, 220);

    // Other Info with Icons
    const infoY = 300;
    const lineHeight = 60;

    ctx.font = "30px Arial";
    
    ctx.fillStyle = "#00ff88";
    ctx.fillText("⚧ Gender :", 320, infoY);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(gender, 500, infoY);

    ctx.fillStyle = "#ffaa00";
    ctx.fillText("🔗 Profile :", 320, infoY + lineHeight);
    ctx.fillStyle = "#00ffff";
    ctx.fillText("fb.com/"+uid, 500, infoY + lineHeight);

    ctx.fillStyle = "#ff33ff";
    ctx.fillText("⏰ Time :", 320, infoY + lineHeight*2);
    ctx.fillStyle = "#ffffff";
    const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    ctx.fillText(time, 500, infoY + lineHeight*2);

    // Bottom Watermark
    ctx.shadowBlur = 0;
    ctx.font = "italic 20px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "center";
    ctx.fillText("© ARYAN BOT • Premium UID System 2025", 450, 560);

    // Save & Send
    const finalPath = __dirname + `/cache/premium_uid_${uid}.png`;
    fs.writeFileSync(finalPath, canvas.toBuffer());

    api.sendMessage({
      body: `💀 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗨𝗜𝗗 𝗖𝗔𝗥𝗗 💀\n\n👤 Name : \( {name}\n🆔 UID : \){uid}\n⚧ Gender : \( {gender}\n🔗 Profile : fb.com/ \){uid}\n🕰 Generated : ${time}\n\n✨ Powered by ARYAN BOT`,
      attachment: fs.createReadStream(finalPath)
    }, threadID, () => {
      fs.unlinkSync(dpPath);
      fs.unlinkSync(finalPath);
    }, messageID);

  } catch (err) {
    api.sendMessage("❌ Error: User privacy enabled ya kuch galat hua!", threadID);
    console.log(err);
  }
};
