module.exports.config = {
  name: "purpose",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "Chand",
  description: "Pair image with REAL Facebook profile avatar",
  commandCategory: "img",
  usages: "purpose",
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
async function makeImage(uid1, uid2, api) {
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const path = global.nodemodule["path"];

  const root = path.join(__dirname, "cache", "canvas");
  const out = path.join(root, `pair_${uid1}_${uid2}.png`);

  const bg = await jimp.read(path.join(root, "lovep.png"));

  // ✅ REAL FACEBOOK PROFILE PHOTO (NO GRAPH API)
  const getAvatar = async (uid) => {
    const info = await api.getUserInfo(uid);
    const avatarUrl = info[uid].profileUrl;

    const data = (
      await axios.get(avatarUrl, { responseType: "arraybuffer" })
    ).data;

    return (await jimp.read(Buffer.from(data)))
      .circle()
      .resize(200, 200);
  };

  const a1 = await getAvatar(uid1);
  const a2 = await getAvatar(uid2);

  bg
    .composite(a1, 60, 180)
    .composite(a2, 610, 180);

  await bg.writeAsync(out);
  return out;
}

// ================= RUN =================
module.exports.run = async function ({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;

  let targetID = null;

  // 1️⃣ mention
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    targetID = Object.keys(event.mentions)[0];
  }

  // 2️⃣ reply (BEST)
  if (!targetID && event.type === "message_reply" && event.messageReply) {
    targetID = event.messageReply.senderID;
  }

  // 3️⃣ uid
  if (!targetID && args[0] && /^\d+$/.test(args[0])) {
    targetID = args[0];
  }

  // 4️⃣ AUTO PICK (NO ERROR EVER)
  if (!targetID) {
    const info = await api.getThreadInfo(threadID);
    const members = info.participantIDs.filter(id => id !== senderID);
    targetID = members[Math.floor(Math.random() * members.length)];
  }

  try {
    const img = await makeImage(senderID, targetID, api);
    api.sendMessage(
      { attachment: fs.createReadStream(img) },
      threadID,
      () => fs.unlinkSync(img),
      messageID
    );
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Image generate error.", threadID, messageID);
  }
};
