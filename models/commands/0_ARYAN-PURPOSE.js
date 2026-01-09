module.exports.config = {
  name: "purpose",
  version: "9.0.0",
  hasPermssion: 0,
  credits: "Chand",
  description: "Pair image without mention bug",
  commandCategory: "img",
  usages: "purpose @mention | reply | uid",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

// ================= ON LOAD =================
module.exports.onLoad = async () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { downloadFile } = global.utils;

  const dir = path.join(__dirname, "cache", "canvas");
  const bg = path.join(dir, "lovep.png");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(bg)) {
    await downloadFile(
      "https://i.ibb.co/SXjyVqmM/imgbb-1767937142818.jpg",
      bg
    );
  }
};

// ================= IMAGE MAKER =================
async function makeImage(senderID, targetID) {
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];

  const root = path.join(__dirname, "cache", "canvas");
  const outPath = path.join(root, `pair_${senderID}_${targetID}.png`);

  const bg = await jimp.read(path.join(root, "lovep.png"));

  async function getAvatar(uid) {
    const imgData = (
      await axios.get(
        `https://graph.facebook.com/${uid}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
      )
    ).data;

    return (await jimp.read(Buffer.from(imgData)))
      .circle()
      .resize(200, 200);
  }

  const avatar1 = await getAvatar(senderID);
  const avatar2 = await getAvatar(targetID);

  bg
    .composite(avatar1, 60, 180)
    .composite(avatar2, 610, 180);

  await bg.writeAsync(outPath);
  return outPath;
}

// ================= RUN =================
module.exports.run = async function ({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID = null;

  // ✅ METHOD 1: REAL MENTION
  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }
  // ✅ METHOD 2: REPLY (BEST & 100%)
  else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
  }
  // ✅ METHOD 3: UID
  else if (args[0] && /^\d+$/.test(args[0])) {
    targetID = args[0];
  }

  if (!targetID) {
    return api.sendMessage(
      "❌ Use any ONE method:\n\n" +
      "1️⃣ purpose @mention\n" +
      "2️⃣ reply kisi ke msg pe + purpose\n" +
      "3️⃣ purpose <uid>",
      threadID,
      messageID
    );
  }

  try {
    const imgPath = await makeImage(senderID, targetID);
    api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Image generate error.", threadID, messageID);
  }
};
