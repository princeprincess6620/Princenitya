module.exports.config = {
  name: "purpose",
  version: "7.3.1",
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
  const path = resolve(__dirname, 'cache/canvas', 'lovep.png');
  
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) {
    try {
      await downloadFile("https://i.imgur.com/4Z8n0YD.png", path); // Working background image
    } catch (error) {
      console.error("Error downloading background image:", error);
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
    // Read background image
    let background = await jimp.read(__root + "/lovep.png");
    
    // Prepare paths
    let pathImg = __root + `/pair_${one}_${two}.png`;
    let avatarOnePath = __root + `/avt_${one}.png`;
    let avatarTwoPath = __root + `/avt_${two}.png`;

    // Download first avatar
    let getAvatarOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=170918142443047|95d8ab09474e5c8b9f512c63a0a1a38a`, {
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data, 'binary'));

    // Download second avatar
    let getAvatarTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=170918142443047|95d8ab09474e5c8b9f512c63a0a1a38a`, {
      responseType: 'arraybuffer'
    });
    fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data, 'binary'));

    // Process avatars
    let avatarOne = await jimp.read(avatarOnePath);
    let avatarTwo = await jimp.read(avatarTwoPath);
    
    // Create circular avatars
    avatarOne.circle();
    avatarTwo.circle();
    
    // Resize avatars
    avatarOne.resize(150, 150);
    avatarTwo.resize(150, 150);

    // Composite images
    background.composite(avatarOne, 100, 150);
    background.composite(avatarTwo, 450, 150);

    // Save image
    let buffer = await background.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, buffer);

    // Cleanup temporary files
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
    
  } catch (error) {
    console.error("Error in makeImage:", error);
    throw error;
  }
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  
  try {
    const mention = Object.keys(event.mentions);
    
    if (mention.length === 0) {
      return api.sendMessage("Please mention 1 person to create a pair photo.", threadID, messageID);
    }
    
    const one = senderID;
    const two = mention[0];
    
    // Send processing message
    await api.sendMessage("Creating your pair photo... ❤️", threadID, messageID);
    
    const path = await makeImage({ one, two });
    
    // Send the generated image
    return api.sendMessage({ 
      body: "Here's your perfect pair! 💞", 
      attachment: fs.createReadStream(path) 
    }, threadID, () => {
      // Delete the image after sending
      try {
        fs.unlinkSync(path);
      } catch (e) {
        console.error("Error deleting file:", e);
      }
    }, messageID);
    
  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage("Sorry, there was an error creating the pair photo. Please try again later.", threadID, messageID);
  }
}
