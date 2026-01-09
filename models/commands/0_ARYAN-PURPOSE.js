module.exports.config = {
  name: "purpose",
  version: "8.0.0",
  hasPermssion: 0,
  credits: "Chand",
  description: "Get Pair From Mention",
  commandCategory: "img",
  usages: "[@mention]",
  cooldowns: 5, 
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const bgPath = resolve(__dirname, 'cache/canvas', 'lovep.png');
  
  // FIX 1: Correct directory creation
  if (!existsSync(dirMaterial)) {
    mkdirSync(dirMaterial, { recursive: true });
  }
  
  // FIX 2: Download background image with error handling
  if (!existsSync(bgPath)) {
    try {
      await downloadFile("https://i.ibb.co/SXjyVqmM/imgbb-1767937142818.jpg", bgPath);
      console.log("Background image downloaded successfully");
    } catch (error) {
      console.error("Failed to download background image:", error);
    }
  }
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  try {
    // FIX 3: Check if background exists
    if (!fs.existsSync(__root + "/lovep.png")) {
      throw new Error("Background image not found. Please restart bot.");
    }

    let batgiam_img = await jimp.read(__root + "/lovep.png");
    let pathImg = __root + `/batman_${one}_${two}.png`;
    let avatarOnePath = __root + `/avt_${one}.png`;
    let avatarTwoPath = __root + `/avt_${two}.png`;

    // FIX 4: Correct Facebook picture URLs (removed access token)
    console.log("Downloading avatar for:", one);
    let getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { 
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    // FIX 5: Correct buffer writing
    fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data, 'binary'));

    console.log("Downloading avatar for:", two);
    let getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { 
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data, 'binary'));

    // FIX 6: Correct circle function usage
    let circleOne = await jimp.read(avatarOnePath);
    let circleTwo = await jimp.read(avatarTwoPath);
    
    // Make circles
    circleOne.circle();
    circleTwo.circle();
    
    // Resize
    circleOne.resize(200, 200);
    circleTwo.resize(200, 200);
    
    // FIX 7: Adjusted coordinates for your background
    // Coordinates: (x, y) - adjust these based on your background image
    batgiam_img.composite(circleOne, 50, 150);   // Left side
    batgiam_img.composite(circleTwo, 400, 150);  // Right side

    // Save image
    await batgiam_img.writeAsync(pathImg);

    // Cleanup
    if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath);
    if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath);

    return pathImg;
    
  } catch (error) {
    console.error("Error in makeImage:", error);
    
    // Cleanup on error
    try {
      if (fs.existsSync(__root + `/avt_${one}.png`)) fs.unlinkSync(__root + `/avt_${one}.png`);
      if (fs.existsSync(__root + `/avt_${two}.png`)) fs.unlinkSync(__root + `/avt_${two}.png`);
    } catch (e) {}
    
    throw error;
  }
}

// FIX 8: Remove duplicate circle function (already using jimp.circle() directly)

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  
  try {
    // FIX 9: Better mention checking
    const mention = Object.keys(event.mentions || {});
    
    if (!mention[0]) {
      return api.sendMessage("Please mention 1 person.\nExample: .purpose @FriendName", threadID, messageID);
    }
    
    const one = senderID, two = mention[0];
    
    // FIX 10: Check if mentioning self
    if (one === two) {
      return api.sendMessage("You cannot create a pair photo with yourself!", threadID, messageID);
    }
    
    // FIX 11: Send processing message
    await api.sendMessage("Creating your pair photo... Please wait! ⏳", threadID, messageID);
    
    const path = await makeImage({ one, two });
    
    if (!fs.existsSync(path)) {
      throw new Error("Failed to create image file");
    }
    
    // FIX 12: Get the mentioned person's name
    const targetName = event.mentions[two] ? event.mentions[two].replace("@", "") : "User";
    
    return api.sendMessage({ 
      body: `💖 Perfect Pair! 💖\n${event.senderName} ❤️ ${targetName}`,
      attachment: fs.createReadStream(path) 
    }, threadID, () => {
      // Cleanup after sending
      try {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      } catch (e) {
        console.log("Cleanup error:", e);
      }
    }, messageID);
    
  } catch (error) {
    console.error("Error in run function:", error);
    return api.sendMessage(`Error: ${error.message || "Failed to create pair photo. Please try again!"}`, threadID, messageID);
  }
}
