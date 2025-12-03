const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
  name: "movevideo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aryan",
  description: "Reply to a photo with .move video <text> to create an AI avatar video",
  usages: ".move video Hello!",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
  try {
    // --- CONFIG ---
    const RENDER_API = process.env.DID_API_URL || 'https://api-aryan-d-id-video.onrender.com';
    const tmpDir = path.join(__dirname, 'tmp_movevideo');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // --- Helper: send message ---
    const send = (msg, mentions = []) => api.sendMessage(msg, event.threadID);

    // Check args and messageReply
    const fullText = args.join(' ').trim();

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return send("❌ Kripya photo par reply karke command bhejein. Example:\nReply to the photo with: .move video Namaste, main AI avatar hoon.");
    }

    // Extract the first image attachment URL
    const attachment = event.messageReply.attachments.find(a => a.type && a.type === 'photo' || (a.url && a.url.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) );
    if (!attachment) return send("❌ Reply ki gayi cheez image nahi hai. Sirf photo reply karein.");

    const imageUrl = attachment.url || (attachment.preview && attachment.preview.url);
    if (!imageUrl) return send("❌ Image URL nahi mil rahi. Please retry.");

    if (!fullText) return send("❌ Kripya text likhein jise avatar bolega. Example: .move video Namaste!");

    // Notify user
    await send("⏳ Image receive hui. Video bana rahe hain — thoda intezaar karein...");

    // Download the image to tmp
    const imageFilename = path.join(tmpDir, `input_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imageFilename);
    const resp = await axios.get(imageUrl, { responseType: 'stream' });
    await new Promise((resolve, reject) => {
      resp.data.pipe(writer);
      let error = null;
      writer.on('error', err => { error = err; writer.close(); reject(err); });
      writer.on('close', () => { if (!error) resolve(); });
    });

    // 1) Upload image to render API
    const form = new FormData();
    form.append('image', fs.createReadStream(imageFilename));

    const uploadResp = await axios.post(`${RENDER_API}/upload`, form, {
      headers: { ...form.getHeaders() },
      maxBodyLength: Infinity,
      timeout: 120000
    }).catch(err => err.response || err);

    if (!uploadResp || uploadResp.status !== 200) {
      console.error('Upload failed', uploadResp && uploadResp.data || uploadResp.statusText || uploadResp);
      return send('❌ Image upload failed. Server response: ' + (uploadResp && uploadResp.status || 'no-response'));
    }

    const imageId = uploadResp.data && uploadResp.data.id;
    if (!imageId) return send('❌ Upload successful magar image id nahi mili.');

    // 2) Create video
    const createPayload = {
      image_id: imageId,
      text: fullText,
      voice: 'hi-IN-MadhurNeural',
      config: { fluent: true, pad_audio: 0.0 }
    };

    const createResp = await axios.post(`${RENDER_API}/create`, createPayload, { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }).catch(err => err.response || err);
    if (!createResp || createResp.status !== 200) {
      console.error('Create failed', createResp && createResp.data || createResp.statusText || createResp);
      return send('❌ Video creation request failed.');
    }

    const videoId = createResp.data && createResp.data.id;
    if (!videoId) return send('❌ Video id nahi mili.');

    // 3) Poll for video URL
    let videoUrl = null;
    const maxAttempts = 12; // approximate timeout ~ 2 minutes
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const statusResp = await axios.get(`${RENDER_API}/video/${videoId}`).catch(err => err.response || err);
      if (statusResp && statusResp.status === 200) {
        if (statusResp.data && statusResp.data.url) { videoUrl = statusResp.data.url; break; }
      }
      // wait before next attempt
      await new Promise(r => setTimeout(r, 5000));
    }

    if (!videoUrl) return send('❌ Video abhi ready nahi hua. Thodi der baad retry karein.');

    // 4) Download the video
    const outVideoPath = path.join(tmpDir, `output_${Date.now()}.mp4`);
    const videoResp = await axios.get(videoUrl, { responseType: 'stream', timeout: 0 }).catch(err => err.response || err);
    if (!videoResp || videoResp.status !== 200) return send('❌ Video download failed.');

    const outStream = fs.createWriteStream(outVideoPath);
    await new Promise((resolve, reject) => {
      videoResp.data.pipe(outStream);
      let error = null;
      outStream.on('error', err => { error = err; outStream.close(); reject(err); });
      outStream.on('finish', () => { if (!error) resolve(); });
    });

    // 5) Send video back to thread
    await api.sendMessage({ attachment: fs.createReadStream(outVideoPath) }, event.threadID, (err) => {
      if (err) console.error('Send video error', err);
    });

    // Cleanup temporary files (best-effort)
    try { fs.unlinkSync(imageFilename); } catch (e) {}
    try { fs.unlinkSync(outVideoPath); } catch (e) {}

  } catch (e) {
    console.error(e);
    try { api.sendMessage('❌ Bot error: ' + (e.message || e), event.threadID); } catch (e) {}
  }
};
