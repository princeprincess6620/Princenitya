const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp");
const fse = require("fs-extra");
const { exec } = require("child_process");

module.exports.config = {
  name: "fullmove",
  version: "4.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra Edition",
  description: "Convert an image into animated full body motion using Pollinations prompt style.",
  commandCategory: "AI",
  cooldowns: 10,
  usages: "Reply Image + fullmove <prompt>"
};

module.exports.run = async ({ api, event, args }) => {

  const threadID = event.threadID;
  const prompt = args.join(" ") || "3D Animated Character";

  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
    return api.sendMessage("📌 Please reply to an image then type:\n👉 fullmove <style prompt>", threadID);
  }

  try {

    api.sendMessage(`🎬 Processing...\n✨ Style: "${prompt}"\n⏳ Wait 15–45 sec`, threadID);

    const tmpDir = path.join(__dirname, "fullmove_tmp");

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const fileName = `FM_${Date.now()}`;

    const imgInput = path.join(tmpDir, fileName + ".jpg");
    const styledImg = path.join(tmpDir, fileName + "_styled.png");
    const frameFolder = path.join(tmpDir, fileName + "_frames");
    const videoOutput = path.join(tmpDir, fileName + ".mp4");

    // download user image
    const imgURL = event.messageReply.attachments[0].url;
    const dl = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgInput, dl.data);

    // Pollinations AI prompt fetch text style (optional aesthetic)
    const text_url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    let overlayText = "";

    try {
      const styleTXT = await axios.get(text_url);
      overlayText = (styleTXT.data || "").substring(0, 60);
    } catch {
      overlayText = prompt;
    }

    // stylize image
    const img = await Jimp.read(imgInput);
    img.resize(720, Jimp.AUTO).posterize(5).contrast(0.25);

    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    img.print(font, 10, 10, `AI Style: ${overlayText}`);

    await img.writeAsync(styledImg);

    // generate frames
    await fse.ensureDir(frameFolder);

    const base = await Jimp.read(styledImg);
    const W = base.bitmap.width;
    const H = base.bitmap.height;
    const totalFrames = 65;

    for (let i = 0; i < totalFrames; i++) {

      const t = Math.sin((i / totalFrames) * Math.PI * 2);

      const scale = 1 + t * 0.03;
      const xShift = Math.round(t * 12);
      const yShift = Math.round(Math.abs(t) * 16);

      const frame = new Jimp(W, H, "#000000");
      const subject = base.clone().scale(scale);

      frame.composite(subject, (W - subject.bitmap.width) / 2 + xShift, (H - subject.bitmap.height) / 2 - yShift);

      const fPath = path.join(frameFolder, `frame_${String(i).padStart(3, "0")}.png`);
      await frame.writeAsync(fPath);
    }

    // make video using ffmpeg
    const ffmpegCMD = `ffmpeg -y -framerate 24 -i "${frameFolder}/frame_%03d.png" -c:v libx264 -pix_fmt yuv420p "${videoOutput}"`;

    await new Promise((resolve, reject) => {
      exec(ffmpegCMD, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await api.sendMessage(
      {
        body: `🔥 Full Body AI Motion Ready!\n🎨 Style: ${prompt}`,
        attachment: fs.createReadStream(videoOutput)
      },
      threadID
    );

    setTimeout(() => fse.remove(tmpDir).catch(() => {}), 20_000);

  } catch (e) {
    api.sendMessage("❌ Error: " + e.message, event.threadID);
  }
};
