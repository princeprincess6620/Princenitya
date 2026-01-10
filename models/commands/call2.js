const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "call2",
  version: "7.3.2",
  hasPermssion: 0,
  credits: "M.R ARYAN",
  description: "Call image with mention",
  commandCategory: "img",
  usages: "call2 @mention",
  cooldowns: 5
};

/* ================== ON LOAD ================== */
module.exports.onLoad = async () => {
  const cachePath = path.join(__dirname, "cache");
  const bgPath = path.join(cachePath, "calll.jpg");

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
  }

  if (!fs.existsSync(bgPath)) {
    const img = (
      await axios.get(
        "https://i.ibb.co/Ndb86pQH/uzairrcall.jpg",
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(bgPath, Buffer.from(img));
  }
};

/* ================== CIRCLE AVATAR ================== */
async function circleImage(imgPath) {
  const img = await jimp.read(imgPath);
  img.circle();
  return img;
}

/* ================== MAKE IMAGE ================== */
async function makeImage(one, two) {
  const cachePath = path.join(__dirname, "cache");
  const bg = await jimp.read(path.join(cachePath, "calll.jpg"));

  const avt1 = path.join(cachePath, `avt_${one}.png`);
  const avt2 = path.join(cachePath, `avt_${two}.png`);
  const out = path.join(cachePath, `call2_${one}_${two}.jpg`);

  const url1 = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
  const url2 = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

  fs.writeFileSync(avt1, Buffer.from((await axios.get(url1, { responseType: "arraybuffer" })).data));
  fs.writeFileSync(avt2, Buffer.from((await axios.get(url2, { responseType: "arraybuffer" })).data));

  const c1 = await circleImage(avt1);
  const c2 = await circleImage(avt2);

  bg
    .composite(c1.resize(72, 72), 148, 357)
    .composite(c2.resize(72, 72), 440, 357);

  await bg.writeAsync(out);

  fs.unlinkSync(avt1);
  fs.unlinkSync(avt2);

  return out;
}

/* ================== HANDLE EVENT (NO PREFIX) ================== */
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, senderID, body, mentions } = event;
  if (!body) return;
  if (!body.toLowerCase().startsWith("call2")) return;

  const mentionIDs = Object.keys(mentions || {});
  if (mentionIDs.length !== 1) {
    return api.sendMessage(
      "❌ Sirf 1 person ko mention karo\n\n✅ Use: call2 @mention",
      threadID,
      messageID
    );
  }

  const imgPath = await makeImage(senderID, mentionIDs[0]);
  return api.sendMessage(
    { attachment: fs.createReadStream(imgPath) },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
  );
};

/* ================== RUN (PREFIX COMMAND) ================== */
module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID, mentions } = event;

  const mentionIDs = Object.keys(mentions || {});
  if (mentionIDs.length !== 1) {
    return api.sendMessage(
      "❌ Sirf 1 person ko mention karo\n\n✅ Use: call2 @mention",
      threadID,
      messageID
    );
  }

  const imgPath = await makeImage(senderID, mentionIDs[0]);
  return api.sendMessage(
    { attachment: fs.createReadStream(imgPath) },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
  );
};
