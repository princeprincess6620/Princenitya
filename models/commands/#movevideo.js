const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

module.exports.config = {
  name: "movevideo",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Aryan",
  description: "Convert photo to talking video",
  commandCategory: "media",
  usages: "[text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const text = args.join(" ") || "Hello, welcome!";
    const attachment = event.messageReply?.attachments?.[0];

    if (!attachment || attachment.type !== "photo") {
      return api.sendMessage("❌ Please reply to an image.", event.threadID);
    }

    api.sendMessage("⏳ Uploading image...", event.threadID);

    // Download the image locally
    const imgPath = path.join(__dirname, "temp.jpg");
    const imgData = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, imgData);

    // Prepare form data
    const form = new FormData();
    form.append("image", fs.createReadStream(imgPath));

    let uploadRes;
    try {
      // Try primary API first
      uploadRes = await axios.post(
        "https://aryan-d-id-video-api.onrender.com/upload",
        form,
        { headers: form.getHeaders() }
      );
    } catch (err) {
      console.log("Primary API failed, trying backup API...", err.message);

      // Backup API (D-ID official API example)
      const backupForm = new FormData();
      backupForm.append("image", fs.createReadStream(imgPath));
      uploadRes = await axios.post(
        "https://api.d-id.com/talks/upload", // Example backup API
        backupForm,
        {
          headers: {
            ...backupForm.getHeaders(),
            Authorization: `Bearer YOUR_DID_API_KEY` // Replace with your key
          }
        }
      );
    }

    api.sendMessage("🎤 Creating video...", event.threadID);

    // Create video request
    const createRes = await axios.post(
      "https://aryan-d-id-video-api.onrender.com/create",
      {
        image_id: uploadRes.data.id,
        text: text
      }
    );

    const videoId = createRes.data.id;

    // Polling for video ready
    const checkInterval = setInterval(async () => {
      try {
        const status = await axios.get(
          `https://aryan-d-id-video-api.onrender.com/video/${videoId}`
        );

        if (status.data.url) {
          clearInterval(checkInterval);

          const videoBuffer = (await axios.get(status.data.url, { responseType: "arraybuffer" })).data;
          const videoPath = path.join(__dirname, "video.mp4");
          fs.writeFileSync(videoPath, videoBuffer);

          api.sendMessage(
            { body: "🎉 Video Generated!", attachment: fs.createReadStream(videoPath) },
            event.threadID
          );

          // Clean temp files
          fs.unlinkSync(imgPath);
          fs.unlinkSync(videoPath);
        }
      } catch (err) {
        console.log("Error checking video status:", err.message);
      }
    }, 4000);

  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Process failed while generating video.", event.threadID);
  }
};
