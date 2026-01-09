module.exports.config = {
  name: "purpose",
  version: "8.0.0",
  hasPermssion: 0,
  credits: "Chand (fixed by ChatGPT)",
  description: "Make love pair image from mention",
  commandCategory: "img",
  usages: "@mention",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];

  const dir = path.join(__dirname, "cache", "canvas");
  const bgPath = path.join(dir, "lovep.png");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(bgPath)) {
    const img = (await axios.get(
      "https://i.ibb.co/SXjyVqmM/imgbb-1767937142818.jpg",
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(bgPath, img);
  }
};

async function circleImage(imgPath) {
  const jimp = global.nodemodule["jimp"];
  const img = await jimp.read(imgPath);
  img.circle();
  return img;
}

async function makeImage(uid1, uid2) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const dir = path.join(__dirname, "cache", "canvas");

  const bg = await jimp.read(path.join(dir, "lovep.png"));

  const avt1 = path.join(dir, `avt_${uid1}.png`);
  const avt2 = path.join(dir, `avt_${uid2}.png`);
  const out = path.join(dir, `pair_${uid1}_${uid2}.png`);

  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

  const img1 = (await axios.get(
    `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=${token}`,
    { responseType: "arraybuffer" }
  )).data;

  const img2 = (await axios.get(
    `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=${token}`,
    { responseType: "arraybuffer" }
  )).data;

  fs.writeFileSync(avt1, img1);
  fs.writeFileSync(avt2, img2);

  const c1 = await circleImage(avt1);
  const c2 = await circleImage(avt2);

  bg.composite(c1.resize(200, 200), 60, 180);
  bg.composite(c2.resize(200, 200), 610, 180);

  await bg.writeAsync(out);

  fs.unlinkSync(avt1);
  fs.unlinkSync(avt2);

  return out;
}

module.exports.run = async function ({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;

  const ids = Object.keys(mentions);
  if (ids.length === 0)
    return api.sendMessage(
      "❌ Sirf 1 person ko mention karo.",
      threadID,
      messageID
    );

  const targetID = ids[0];

  try {
    const imgPath = await makeImage(senderID, targetID);
    api.sendMessage(
      {
        body: "💞 Love Pair 💞",
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  } catch (e) {
    api.sendMessage("❌ Image generate nahi hui.", threadID, messageID);
  }
};
