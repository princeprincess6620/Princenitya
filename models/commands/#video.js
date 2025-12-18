const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "video",
    aliases: ["ytvideo", "downloadvid"],
    version: "1.0.0",
    author: "Priyansh Rajput",
    role: 0,
    description: "Download video from YouTube",
    usage: "[song name/url] [quality (optional, e.g. 360p)]",
    cooldown: 5,
    hasPrefix: false
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args.length) {
      return api.sendMessage("❌ Please enter a song name or YouTube URL.", threadID, messageID);
    }

    // Parse arguments for quality
    let quality = null;
    const lastArg = args[args.length - 1];
    if (/^\d{3,4}p$/.test(lastArg)) {
      quality = lastArg.replace("p", "");
      args.pop(); // Remove quality from args
    }

    const input = args.join(" ");
    if (!input) {
      return api.sendMessage("❌ Please provide a search query or URL.", threadID, messageID);
    }

    let videoUrl = input;
    let videoTitle = "";
    let videoDetails = {};
    let processingMsg = null;

    try {
      // Check if input is a URL
      const isUrl = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/.test(input);

      if (!isUrl) {
        processingMsg = await api.sendMessage(`✅ Searching for: ${input}...`, threadID, messageID);
        const searchResult = await ytSearch(input);
        if (!searchResult || !searchResult.videos.length) {
          if (processingMsg) await api.unsendMessage(processingMsg.messageID);
          return api.sendMessage("❌ Video not found on YouTube.", threadID, messageID);
        }
        const video = searchResult.videos[0];
        videoUrl = video.url;
        videoTitle = video.title;
        videoDetails = {
          duration: video.duration?.timestamp || "N/A",
          views: video.views,
          author: video.author?.name || "Unknown",
          ago: video.ago,
        };
      } else {
        processingMsg = await api.sendMessage(`🔍 Processing URL...`, threadID, messageID);
        // Try to get details for URL
        try {
          const videoIdMatch = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
          if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            const searchResult = await ytSearch({ videoId: videoId });
            if (searchResult) {
              videoTitle = searchResult.title;
              videoDetails = {
                duration: searchResult.duration?.timestamp || "N/A",
                views: searchResult.views,
                author: searchResult.author?.name || "Unknown",
                ago: searchResult.ago,
              };
            }
          }
        } catch (e) {
          console.log("Could not fetch video details from URL:", e.message);
        }
      }

      // Define quality chain - Default to 360p as requested
      let qualitiesToTry = [];
      if (quality) {
        qualitiesToTry = [quality];
      } else {
        qualitiesToTry = ["360", "720", "240", "144"];
      }

      let downloadData = null;
      let successfulQuality = "";

      // Try to get a valid download link
      for (const q of qualitiesToTry) {
        try {
          const apiUrl = "https://priyanshuapi.xyz/api/runner/youtube-downloader-v2/download";
          const response = await axios.post(
            apiUrl,
            {
              link: videoUrl,
              format: "mp4",
              videoQuality: q,
            },
            {
              headers: {
                Authorization: `Bearer your_api_key_here`, // API key needed
                "Content-Type": "application/json",
              },
              timeout: 10000
            }
          );

          if (response.data && response.data.success && response.data.data) {
            const data = response.data.data;

            // Check file size (optional)
            try {
              const headResponse = await axios.head(data.downloadUrl, { timeout: 5000 });
              const contentLength = headResponse.headers["content-length"];
              if (contentLength && parseInt(contentLength) > 80 * 1024 * 1024) {
                console.log(`Quality ${q} too large: ${contentLength} bytes`);
                continue; // Try next quality
              }
            } catch (headError) {
              console.log("Could not check file size:", headError.message);
            }

            downloadData = data;
            successfulQuality = q;
            break; // Found a valid quality
          }
        } catch (apiError) {
          console.error(`Failed to get link for quality ${q}:`, apiError.message);
        }
      }

      if (!downloadData) {
        if (processingMsg) await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage("❌ Failed to download video. File might be too large or unavailable.", threadID, messageID);
      }

      const { downloadUrl, title, filename } = downloadData;
      const finalTitle = videoTitle || title || "Unknown Title";

      // Format views
      const formattedViews = videoDetails.views ? 
        new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(videoDetails.views) : "N/A";

      // Construct info message
      let infoMsg = `📹 YouTube Video Download\n`;
      infoMsg += `📝 Title: ${finalTitle}\n`;
      if (videoDetails.duration && videoDetails.duration !== "N/A") 
        infoMsg += `⏱ Duration: ${videoDetails.duration}\n`;
      if (videoDetails.author && videoDetails.author !== "Unknown") 
        infoMsg += `👤 Channel: ${videoDetails.author}\n`;
      if (videoDetails.views) 
        infoMsg += `👀 Views: ${formattedViews}\n`;
      infoMsg += `📺 Quality: ${successfulQuality}p\n`;
      infoMsg += `🔗 Source: ${videoUrl}\n`;

      // Update processing message
      if (processingMsg) {
        await api.unsendMessage(processingMsg.messageID);
      }
      
      const downloadingMsg = await api.sendMessage(`⏳ Downloading video (${successfulQuality}p)...`, threadID, messageID);

      // Download file
      const tempDir = path.join(__dirname, "temporary");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const safeFilename = (filename || `${Date.now()}_video.mp4`).replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = path.join(tempDir, safeFilename);

      try {
        const response = await axios({
          method: "GET",
          url: downloadUrl,
          responseType: "stream",
          timeout: 60000
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        // Check file size
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          throw new Error("Downloaded file is empty");
        }

        // Send video
        await api.unsendMessage(downloadingMsg.messageID);
        
        await api.sendMessage({
          body: infoMsg,
          attachment: fs.createReadStream(filePath)
        }, threadID, messageID);

        // Clean up
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }, 5000);

      } catch (downloadError) {
        console.error("Download error:", downloadError);
        if (downloadingMsg) await api.unsendMessage(downloadingMsg.messageID);
        throw downloadError;
      }

    } catch (error) {
      console.error("Error in video command:", error);
      api.sendMessage(`❌ Error: ${error.message || "Failed to process video"}`, threadID, messageID);
    }
  }
};
