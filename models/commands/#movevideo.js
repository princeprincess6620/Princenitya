const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

module.exports.config = {
  name: "movevideo",
  version: "1.1.0",
  hasPermission: 0,
  credits: "Aryan",
  description: "Convert photo to talking video",
  commandCategory: "media",
  usages: "[text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const text = args.join(" ");
    const attachment = event.messageReply?.attachments[0];

    if (!attachment || attachment.type !== "photo")
      return api.sendMessage("❌ Please reply to an image.", event.threadID);

    api.sendMessage("⏳ Uploading image...", event.threadID);

    const imgPath = __dirname + "/temp.jpg";
    const img = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, img);

    const form = new FormData();
    form.append("image", fs.createReadStream(imgPath));

    const uploadRes = await axios.post(
      "https://aryan-d-id-video-api.onrender.com/upload",
      form,
      { headers: form.getHeaders() }
    );

    api.sendMessage("🎤 Creating video...", event.threadID);

    const createRes = await axios.post(
      "https://aryan-d-id-video-api.onrender.com/create",
      {
        image_id: uploadRes.data.id,
        text: text || "Hello, welcome!"
      }
    );

    const videoId = createRes.data.id;

    const interval = setInterval(async () => {
      const status = await axios.get(
        `https://aryan-d-id-video-api.onrender.com/video/${videoId}`
      );

      if (status.data.url) {
        clearInterval(interval);

        const videoBuffer = (await axios.get(status.data.url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + "/video.mp4", videoBuffer);

        api.sendMessage(
          { body: "🎉 Video Generated!", attachment: fs.createReadStream(__dirname + "/video.mp4") },
          event.threadID
        );
      }
    }, 4000);

  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Process failed while generating video.", event.threadID);
  }
};
