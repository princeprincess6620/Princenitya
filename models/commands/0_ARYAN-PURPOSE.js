module.exports.config = {
  name: "purpose",
  version: "7.3.2",
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

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;

  const dir = resolve(__dirname, "cache", "canvas");
  const imgPath = resolve(dir, "lovep.png");

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  if (!existsSync(imgPath)) {
    await downloadFile(
      "https://i.ibb.co/SXjyVqmM/imgbb-1767937142818.jpg",
      imgPath
    );
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const root = path.resolve(__dirname, "cache", "canvas");

  const baseImg = await jimp.read(`${root}/lovep.png`);
  const outPath = `${root}/pair_${one}_${two}.png`;

  const avt1 = `${root}/avt_${one}.png`;
  const avt2 = `${root}/avt_${two}.png`;

  const img1 = (
    await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, {
      responseType: "arraybuffer"
    })
  ).data;

  const img2 = (
    await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, {
      responseType: "arraybuffer"
    })
  ).data;

  fs.writeFileSync(avt1, Buffer.from(img1));
  fs.writeFileSync(avt2, Buffer.from(img2));

  const c1 = await circle(avt1);
  const c2 = await circle(avt2);

  baseImg
    .composite(c1.resize(200, 200), 60, 180)
    .composite(c2.resize(200, 200), 610, 180);

  await baseImg.writeAsync(outPath);

  fs.unlinkSync(avt1);
  fs.unlinkSync(avt2);

  return outPath;
}

async function circle(imgPath) {
  const jimp = require("jimp");
  const img = await jimp.read(imgPath);
  img.circle();
  return img;
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;

  const mention = Object.keys(mentions);
  if (!mention[0]) {
    return api.sendMessage("❌ Please mention 1 person.", threadID, messageID);
  }

  try {
    const imgPath = await makeImage({
      one: senderID,
      two: mention[0]
    });

    api.sendMessage(
      {
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  } catch (e) {
    api.sendMessage("❌ Error while generating image.", threadID, messageID);
    console.error(e);
  }
};
