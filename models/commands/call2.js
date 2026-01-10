const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "call2",
  version: "7.3.2",
  hasPermssion: 0,
  credits: "M.R ARYAN",
  description: "Get Pair From Mention",
  commandCategory: "img",
  usages: "call2 @mention",
  cooldowns: 5
};

const CACHE_DIR = path.join(__dirname, "cache");
const BG_PATH = path.join(CACHE_DIR, "calll.jpg");
const BG_URL = "https://i.ibb.co/Ndb86pQH/uzairrcall.jpg";

/* ---------- ON LOAD ---------- */
module.exports.onLoad = async () => {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

    if (!fs.existsSync(BG_PATH)) {
      const img = await axios.get(BG_URL, { responseType: "arraybuffer" });
      fs.writeFileSync(BG_PATH, img.data);
    }
  } catch (e) {
    console.log("❌ call2 onLoad error:", e.message);
  }
};

/* ---------- CIRCLE IMAGE ---------- */
async function circleImage(imgPath) {
  const img = await jimp.read(imgPath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

/* ---------- MAKE IMAGE ---------- */
async function makeImage(one, two) {
  const outPath = path.join(CACHE_DIR, `call_${one}_${two}.jpg`);
  const avt1 = path.join(CACHE_DIR, `avt_${one}.jpg`);
  const avt2 = path.join(CACHE_DIR, `avt_${two}.jpg`);

  try {
    const bg = await jimp.read(BG_PATH);

    // Facebook avatar (NO TOKEN – SAFE)
    const url1 = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
    const url2 = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

    const a1 = await axios.get(url1, { responseType: "arraybuffer" });
    const a2 = await axios.get(url2, { responseType: "arraybuffer" });

    fs.writeFileSync(avt1, a1.data);
    fs.writeFileSync(avt2, a2.data);

    const c1 = await jimp.read(await circleImage(avt1));
    const c2 = await jimp.read(await circleImage(avt2));

    bg
      .composite(c1.resize(72, 72), 148, 357)
      .composite(c2.resize(72, 72), 440, 357);

    await bg.writeAsync(outPath);

    fs.unlinkSync(avt1);
    fs.unlinkSync(avt2);

    return outPath;

  } catch (err) {
    throw new Error("Image generation failed");
  }
}

/* ---------- HANDLE EVENT ---------- */
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, mentions } = event;
  if (!body) return;
  if (!body.toLowerCase().startsWith("call2")) return;

  const ids = Object.keys(mentions || {});
  if (!ids[0]) {
    return api.sendMessage("❌ Sirf 1 person ko mention karo", threadID, messageID);
  }

  try {
    const imgPath = await makeImage(senderID, ids[0]);

    api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.existsSync(imgPath) && fs.unlinkSync(imgPath),
      messageID
    );
  } catch (e) {
    api.sendMessage("❌ Image banane me error aa gaya", threadID, messageID);
  }
};

module.exports.run = async () => {};
