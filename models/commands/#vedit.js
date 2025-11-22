/**
 * Mirai command: vedit
 * Updated with Official Pollinations Video API: https://text.pollinations.ai
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const FormData = require("form-data");
const { Blob } = require("buffer");

module.exports.config = {
  name: "vedit",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra + Pollinations API",
  description: "Make photos move using Pollinations Video AI",
  commandCategory: "edit",
  usages: "vedit [image|reply] [prompt]",
  cooldowns: 15
};

// Download Image
async function downloadImage(url, dest) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(dest, res.data);
  return dest;
}

// Get Image from Chat
async function getImage({ event, args }) {
  if (event.messageReply?.attachments?.length) {
    const img = event.messageReply.attachments[0];
    if (img.type === "photo") {
      const file = path.join(__dirname, uuidv4() + ".jpg");
      return await downloadImage(img.url, file);
    }
  }

  if (event.attachments?.length) {
    const img = event.attachments[0];
    if (img.type === "photo") {
      const file = path.join(__dirname, uuidv4() + ".jpg");
      return await downloadImage(img.url, file);
    }
  }

  if (args[0]?.startsWith("http")) {
    const file = path.join(__dirname, uuidv4() + ".jpg");
    return await downloadImage(args[0], file);
  }

  return null;
}

// Upload Image to Pollinations
async function uploadToPollinations(buffer) {
  const form = new FormData();
  form.append("image", new Blob([buffer], { type: "image/jpeg" }), "input.jpg");

  const res = await axios.post(`https://image.pollinations.ai/upload`, form, {
    headers: form.getHeaders()
  });

  return res.data.url;
}

// Video Generate Function
async function makeVideo(imageUrl, prompt) {
  const payload = {
    model: "cogvideox",
    image: imageUrl,
    prompt,
    width: 720,
    height: 720,
    fps: 24,
    duration: 4,
    seed: Math.floor(Math.random() * 999999)
  };

  const apiURL = `https://text.pollinations.ai/generate`;

  const res = await axios.post(apiURL, payload, {
    responseType: "arraybuffer",
    headers: { "Content-Type": "application/json" },
    timeout: 180000
  });

  return res.data;
}

module.exports.run = async function ({ api, event, args }) {
  let files = [];

  try {
    api.sendMessage("📥 Fetching image...", event.threadID, event.messageID);

    const imgPath = await getImage({ event, args });
    if (!imgPath) return api.sendMessage("❌ Please reply to an image or add image URL.", event.threadID);

    files.push(imgPath);
    const buffer = fs.readFileSync(imgPath);

    const prompt = args.slice(1).join(" ") || "smooth motion, cinematic video, HD";

    api.sendMessage("📤 Uploading to Pollinations...", event.threadID);

    let imageUrl;
    try {
      imageUrl = await uploadToPollinations(buffer);
    } catch {
      imageUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    api.sendMessage("🎬 Generating video... (10-40 seconds)", event.threadID);

    const video = await makeVideo(imageUrl, prompt);

    const outPath = path.join(__dirname, uuidv4() + ".mp4");
    fs.writeFileSync(outPath, video);
    files.push(outPath);

    await api.sendMessage({
      body: `✨ Video Ready!\n🎨 Prompt: ${prompt}\n⚡ Powered by Pollinations.ai`,
      attachment: fs.createReadStream(outPath)
    }, event.threadID);

  } catch (err) {
    api.sendMessage(`❌ Error: ${err.message}`, event.threadID);
  } finally {
    files.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
  }
};
