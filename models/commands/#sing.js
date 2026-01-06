const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

const API_JSON = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

async function getApiUrl() {
  const res = await axios.get(API_JSON, { timeout: 15000 });
  if (!res.data || !res.data.api) {
    throw new Error("API base URL not found");
  }
  return res.data.api + "/play";
}

module.exports.config = {
  name: "sing",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAAN • Fixed by ChatGPT",
  description: "Download YouTube song mp3 or video",
  commandCategory: "music",
  usages: "sing mp3 <song> | sing video <song>",
  cooldowns: 5
};

async function sendMusic(api, event, type, query) {
  const { threadID, messageID } = event;

  const waitMsg = await api.sendMessage("⏳ Song download ho raha hai...", threadID);

  try {
    // 🔎 YouTube search
    const search = await yts(query);
    if (!search.videos || search.videos.length === 0) {
      throw new Error("Song nahi mila");
    }

    const video = search.videos[0];
    const apiBase = await getApiUrl();

    const apiUrl = `${apiBase}?url=${encodeURIComponent(video.url)}&type=${type}`;
    const res = await axios.get(apiUrl, { timeout: 30000 });

    if (!res.data || !res.data.status || !res.data.downloadUrl) {
      throw new Error("Download API error");
    }

    const ext = type === "video" ? "mp4" : "mp3";
    const filePath = path.join(__dirname, `/cache/sing_${Date.now()}.${ext}`);

    // ⬇ Download file
    const file = await axios.get(res.data.downloadUrl, {
      responseType: "arraybuffer",
      timeout: 60000
    });

    fs.writeFileSync(filePath, Buffer.from(file.data));

    const info =
      `🎵 Title: ${video.title}\n` +
      `📺 Channel: ${video.author.name}\n` +
      `⏱ Duration: ${video.timestamp}\n` +
      `👀 Views: ${video.views.toLocaleString()}\n` +
      `📥 Type: ${type.toUpperCase()}`;

    await api.sendMessage(
      {
        body: info,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        api.unsendMessage(waitMsg.messageID);
      },
      messageID
    );
  } catch (err) {
    api.unsendMessage(waitMsg.messageID);
    api.sendMessage("❌ Error: " + err.message, threadID, messageID);
  }
}

/* ================= NO PREFIX ================= */
module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const args = event.body.trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd !== "sing") return;

  const type = args.shift()?.toLowerCase();
  if (!["mp3", "video"].includes(type)) {
    return api.sendMessage(
      "❌ Use:\n👉 sing mp3 <song name>\n👉 sing video <song name>",
      event.threadID,
      event.messageID
    );
  }

  if (!args.length) {
    return api.sendMessage("❌ Song name likho", event.threadID, event.messageID);
  }

  sendMusic(api, event, type, args.join(" "));
};

/* ================= WITH PREFIX ================= */
module.exports.run = async function ({ api, event, args }) {
  const type = args.shift()?.toLowerCase();

  if (!["mp3", "video"].includes(type)) {
    return api.sendMessage(
      "❌ Use:\n👉 sing mp3 <song name>\n👉 sing video <song name>",
      event.threadID,
      event.messageID
    );
  }

  if (!args.length) {
    return api.sendMessage("❌ Song name likho", event.threadID, event.messageID);
  }

  sendMusic(api, event, type, args.join(" "));
};
