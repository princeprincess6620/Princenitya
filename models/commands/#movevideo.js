const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

module.exports.config = {
    name: "movevideo",
    version: "3.0.0",
    hasPermission: 0,
    credits: "Aryan",
    description: "Create talking photo video with text",
    commandCategory: "media",
    usages: "[text]",
    cooldowns: 15,
    dependencies: {
        "axios": "",
        "ffmpeg-static": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
        
        // Check reply
        if (!event.messageReply || !event.messageReply.attachments || 
            event.messageReply.attachments.length === 0) {
            return send("📷 Please reply to an image with the command:\n.move video [text]\n\nExample: .move video Hello World");
        }

        const attachment = event.messageReply.attachments[0];
        if (!attachment.type.includes("photo")) {
            return send("❌ Only photos are supported!");
        }

        const text = args.join(" ").trim();
        if (!text || text.length > 80) {
            return send("❌ Please provide text (max 80 characters)\nExample: .move video Hi, how are you?");
        }

        send("⏳ Creating your talking photo video... This may take 30-60 seconds.");
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        const tmpDir = path.join(__dirname, 'tmp_movevideo');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const timestamp = Date.now();
        const imagePath = path.join(tmpDir, `image_${timestamp}.jpg`);
        const audioPath = path.join(tmpDir, `audio_${timestamp}.mp3`);
        const videoPath = path.join(tmpDir, `video_${timestamp}.mp4`);
        const finalVideoPath = path.join(tmpDir, `final_${timestamp}.mp4`);

        // Step 1: Download image
        const imageResponse = await axios.get(attachment.url, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

        // Step 2: Generate audio from text (using TTS service)
        send("🔊 Generating voice from text...");
        
        try {
            // Try Google TTS
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
            const audioResponse = await axios.get(ttsUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));
        } catch (ttsError) {
            // Alternative TTS
            const altTtsUrl = `https://api.voicerss.org/?key=demo&hl=en-us&src=${encodeURIComponent(text)}`;
            const altAudio = await axios.get(altTtsUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(audioPath, Buffer.from(altAudio.data));
        }

        // Step 3: Create video from image
        send("🎬 Creating video from image...");
        
        // Get audio duration
        const { stdout: audioInfo } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`);
        const audioDuration = parseFloat(audioInfo) || 5.0;
        
        // Create video with image (zoom effect)
        const ffmpegCmd = `ffmpeg -loop 1 -i "${imagePath}" -i "${audioPath}" -vf "zoompan=z='min(zoom+0.0015,1.5)':d=${Math.ceil(audioDuration)}*25" -c:v libx264 -t ${audioDuration} -pix_fmt yuv420p -c:a aac -shortest "${videoPath}"`;
        
        await execAsync(ffmpegCmd);

        // Step 4: Add subtitles
        send("📝 Adding subtitles...");
        
        // Create subtitles file
        const subtitlesPath = path.join(tmpDir, `subs_${timestamp}.srt`);
        const subsContent = `1\n00:00:00,000 --> 00:00:${Math.ceil(audioDuration)},000\n${text}`;
        fs.writeFileSync(subtitlesPath, subsContent);

        // Add subtitles to video
        const addSubsCmd = `ffmpeg -i "${videoPath}" -vf "subtitles='${subtitlesPath}':force_style='Fontsize=24,PrimaryColour=&Hffffff&,OutlineColour=&H000000&'" -c:a copy "${finalVideoPath}"`;
        
        await execAsync(addSubsCmd);

        // Step 5: Send video
        send("✅ Video ready! Sending now...");
        
        await api.sendMessage({
            body: `🎥 Talking Photo Video\n💬 "${text}"\n⏱️ Duration: ${audioDuration.toFixed(1)}s`,
            attachment: fs.createReadStream(finalVideoPath)
        }, event.threadID, event.messageID);

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // Cleanup
        setTimeout(() => {
            [imagePath, audioPath, videoPath, finalVideoPath, subtitlesPath].forEach(file => {
                if (fs.existsSync(file)) {
                    try { fs.unlinkSync(file); } catch {}
                }
            });
        }, 10000);

    } catch (error) {
        console.error("MoveVideo Error:", error);
        
        // Try alternative simple method
        try {
            await api.sendMessage(
                `⚠️ Video creation failed. Trying alternative method...\n\n` +
                `**Alternative Commands:**\n` +
                `• .animate - Animate image\n` +
                `• .picvoice - Talking photo\n` +
                `• .slideshow - Create slideshow`,
                event.threadID
            );
        } catch {}
        
        api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
};
