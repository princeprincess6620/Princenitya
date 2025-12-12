const fs = require("fs-extra");
const { execFile } = require("child_process");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "4k",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Upscale any image to real 4K HD",
  commandCategory: "Tools",
  usages: "Reply to image → 4k",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  try {

    // ---------- CHECK IMAGE ----------
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0
    ) {
      return api.sendMessage("❌ Reply me ek photo do.", event.threadID, event.messageID);
    }

    const imgURL = event.messageReply.attachments[0].url;

    // ---------- FOLDER SETUP ----------
    const folder = path.join(__dirname, "4k_cache");
    await fs.ensureDir(folder);

    const input = path.join(folder, "input.jpg");
    const upscaleTemp = path.join(folder, "upscaled_x4.png");
    const final4k = path.join(folder, "final4k.png");

    // ---------- EXECUTABLE PATH (AUTO DETECT) ----------
    let exePath = path.join(__dirname, "realesrgan-ncnn-vulkan");
    if (process.platform === "win32") exePath += ".exe";

    if (!fs.existsSync(exePath)) {
      return api.sendMessage(
        "❌ Error: `realesrgan-ncnn-vulkan` file nahi mila!\n\n" +
        "➡ Isko yahan rakho:\n" + exePath +
        "\n\n(Windows me `.exe` lagana mat bhoolna)",
        event.threadID,
        event.messageID
      );
    }

    // ---------- DOWNLOAD IMAGE ----------
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(input, Buffer.from(res.data));

    api.sendMessage("⏳ Processing… 4K upscale in progress…", event.threadID);

    // ---------- RUN REAL-ESRGAN ----------
    await new Promise((resolve, reject) => {
      execFile(
        exePath,
        ["-i", input, "-o", upscaleTemp, "-n", "realesrgan-x4plus"],
        (err, stdout, stderr) => {
          if (err) return reject(stderr);
          resolve();
        }
      );
    });

    // ---------- PROCESS UPSCALED IMAGE ----------
    let img = await jimp.read(upscaleTemp);
    let w = img.bitmap.width;
    let h = img.bitmap.height;

    const TARGET_W = 3840;
    const TARGET_H = 2160;

    if (w < TARGET_W || h < TARGET_H) {
      const scale = Math.max(TARGET_W / w, TARGET_H / h);
      img = img.resize(w * scale, h * scale);
    }

    // ---------- 4K CROP ----------
    const left = (img.bitmap.width - TARGET_W) / 2;
    const top = (img.bitmap.height - TARGET_H) / 2;

    img.crop(left, top, TARGET_W, TARGET_H).write(final4k);

    // ---------- SEND RESULT ----------
    return api.sendMessage(
      {
        body: "✅ 4K HD Image Ready!",
        attachment: fs.createReadStream(final4k)
      },
      event.threadID,
      event.messageID
    );

  } catch (err) {
    return api.sendMessage("❌ Error: " + err, event.threadID, event.messageID);
  }
};
