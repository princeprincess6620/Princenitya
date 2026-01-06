const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

const getApiUrl = async () => {
  const configRes = await axios.get(nix);
  if (!configRes.data?.api) throw new Error("API base URL missing");
  return `${configRes.data.api}/play`;
};

module.exports.config = {
  name: "sing",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAAN (Modified by ChatGPT)",
  description: "Download YouTube MP3 or Video",
  commandCategory: "music",
  usages: "sing mp3 <song> | sing video <song>",
  cooldowns: 5
};

async function handleMusic(api, event, type, query) {
  const { threadID, messageID } = event;
  const wait = await api.sendMessage("⏳ Please wait, downloading...", threadID);

  try {
    const apiBase = await getApiUrl();

    const search = await yts(query);
    if (!search.videos.length) throw new Error("No results found");

    const video = search.videos[0];
    const videoUrl = video.url;

    const apiUrl = `${apiBase}?url=${encodeURIComponent(videoUrl)}&type=${type}`;
    const res = await axios.get(apiUrl);

    if (!res.data?.status || !res.data.downloadUrl)
      throw new Error("Download failed");

    const ext = type === "video" ? "mp4" : "mp3";
    const filePath = path.join(__dirname, `${Date.now()}.${ext}`);

    const file = await axios.get(res.data.downloadUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, file.data);

    const msg =
      `🎵 TITLE: ${video.title}\n` +
      `📺 CHANNEL: ${video.author.name}\n` +
      `⏱ DURATION: ${video.timestamp}\n` +
      `👀 VIEWS: ${video.views.toLocaleString()}\n\n` +
      `✅ Type: ${type.toUpperCase()}`;

    await api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => {
        fs.unlinkSync(filePath);
        api.unsendMessage(wait.messageID);
      },
      messageID
    );
  } catch (e) {
    api.unsendMessage(wait.messageID);
    api.sendMessage("❌ Error: " + e.message, threadID, messageID);
  }
}

// NO PREFIX
module.exports.handleEvent = async function ({ api, event }) {
  const body = event.body;
  if (!body) return;

  const args = body.split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd !== "sing") return;

  const type = args.shift()?.toLowerCase();
  if (!["mp3", "video"].includes(type))
    return api.sendMessage("❌ Use: sing mp3 <song> OR sing video <song>", event.threadID);

  if (!args.length)
    return api.sendMessage("❌ Song name missing", event.threadID);

  handleMusic(api, event, type, args.join(" "));
};

// WITH PREFIX
module.exports.run = async function ({ api, event, args }) {
  const type = args.shift()?.toLowerCase();

  if (!["mp3", "video"].includes(type))
    return api.sendMessage("❌ Use: sing mp3 <song> OR sing video <song>", event.threadID);

  if (!args.length)
    return api.sendMessage("❌ Song name missing", event.threadID);

  handleMusic(api, event, type, args.join(" "));
};
