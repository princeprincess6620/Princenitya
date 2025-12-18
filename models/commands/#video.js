const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytSearch = require("yt-search");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "video",
    aliases: ["ytvideo", "ytdl", "download"],
    version: "2.0.0",
    author: "Your Name",
    role: 0,
    description: "Download YouTube videos with multiple API fallbacks",
    usage: "[song name/YouTube URL] [quality (optional)]",
    cooldown: 10,
    hasPrefix: false
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args.length) {
      return api.sendMessage("📝 Usage: !video [song name or YouTube URL] [quality: 144p, 240p, 360p, 480p, 720p]", threadID, messageID);
    }

    // Parse quality from arguments
    let quality = "360"; // Default quality
    const qualityPattern = /(144|240|360|480|720)p?/i;
    const qualityIndex = args.findIndex(arg => qualityPattern.test(arg));
    
    if (qualityIndex !== -1) {
      quality = args[qualityIndex].replace('p', '').toLowerCase();
      args.splice(qualityIndex, 1); // Remove quality from args
    }

    const query = args.join(" ");
    if (!query) {
      return api.sendMessage("❌ Please enter a search query or YouTube URL.", threadID, messageID);
    }

    try {
      // Send initial message
      const searchingMsg = await api.sendMessage(`🔍 Searching for "${query}"...`, threadID, messageID);

      let videoUrl = "";
      let videoInfo = {};

      // Check if input is a URL
      const isYoutubeUrl = /youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]+)/i.test(query);
      
      if (isYoutubeUrl) {
        // Extract video ID from URL
        const videoId = query.match(/youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]+)/i)[1];
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Get video info using yt-search
        try {
          const search = await ytSearch({ videoId });
          if (search) {
            videoInfo = {
              title: search.title,
              duration: search.duration?.timestamp || "N/A",
              views: search.views,
              author: search.author?.name || "Unknown",
              url: search.url
            };
          }
        } catch (e) {
          console.log("Could not fetch video details:", e.message);
        }
      } else {
        // Search for video
        const searchResults = await ytSearch(query);
        if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
          await api.unsendMessage(searchingMsg.messageID);
          return api.sendMessage("❌ No videos found for your search.", threadID, messageID);
        }
        
        const video = searchResults.videos[0];
        videoUrl = video.url;
        videoInfo = {
          title: video.title,
          duration: video.duration?.timestamp || "N/A",
          views: video.views,
          author: video.author?.name || "Unknown",
          url: video.url
        };
      }

      // Update message
      await api.unsendMessage(searchingMsg.messageID);
      const downloadingMsg = await api.sendMessage(
        `📥 Downloading: ${videoInfo.title || "Video"}\n⏱ Duration: ${videoInfo.duration}\n👤 Channel: ${videoInfo.author}\n📺 Quality: ${quality}p`,
        threadID
      );

      // Try multiple download methods
      let downloadSuccess = false;
      let videoBuffer = null;
      let videoPath = null;

      // Method 1: YouTube DL API (Primary)
      try {
        console.log("Trying Method 1: YouTube DL API...");
        videoBuffer = await downloadFromAPI(videoUrl, quality);
        if (videoBuffer) {
          downloadSuccess = true;
          console.log("Method 1 Success");
        }
      } catch (error) {
        console.log("Method 1 failed:", error.message);
      }

      // Method 2: Alternative API 1
      if (!downloadSuccess) {
        try {
          console.log("Trying Method 2: Alternative API 1...");
          videoBuffer = await downloadFromAPI2(videoUrl, quality);
          if (videoBuffer) {
            downloadSuccess = true;
            console.log("Method 2 Success");
          }
        } catch (error) {
          console.log("Method 2 failed:", error.message);
        }
      }

      // Method 3: Alternative API 2
      if (!downloadSuccess) {
        try {
          console.log("Trying Method 3: Alternative API 2...");
          videoBuffer = await downloadFromAPI3(videoUrl);
          if (videoBuffer) {
            downloadSuccess = true;
            console.log("Method 3 Success");
          }
        } catch (error) {
          console.log("Method 3 failed:", error.message);
        }
      }

      // Method 4: Direct ytdl-core (Fallback)
      if (!downloadSuccess) {
        try {
          console.log("Trying Method 4: ytdl-core...");
          videoPath = await downloadWithYtdl(videoUrl, quality);
          if (videoPath) {
            downloadSuccess = true;
            console.log("Method 4 Success");
          }
        } catch (error) {
          console.log("Method 4 failed:", error.message);
        }
      }

      if (!downloadSuccess) {
        await api.unsendMessage(downloadingMsg.messageID);
        return api.sendMessage("❌ All download methods failed. Please try again later or try a different video.", threadID, messageID);
      }

      // Send the video
      await api.unsendMessage(downloadingMsg.messageID);
      
      if (videoBuffer) {
        // Send from buffer
        await api.sendMessage({
          body: `✅ Download Successful!\n\n📹 ${videoInfo.title}\n⏱ ${videoInfo.duration}\n👤 ${videoInfo.author}\n👀 ${formatViews(videoInfo.views)}\n🔗 ${videoUrl}`,
          attachment: videoBuffer
        }, threadID, messageID);
      } else if (videoPath) {
        // Send from file
        await api.sendMessage({
          body: `✅ Download Successful!\n\n📹 ${videoInfo.title}\n⏱ ${videoInfo.duration}\n👤 ${videoInfo.author}\n👀 ${formatViews(videoInfo.views)}\n🔗 ${videoUrl}`,
          attachment: fs.createReadStream(videoPath)
        }, threadID, messageID);
        
        // Cleanup
        setTimeout(() => {
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
          }
        }, 5000);
      }

    } catch (error) {
      console.error("Error in video command:", error);
      api.sendMessage(`❌ Error: ${error.message || "Something went wrong"}`, threadID, messageID);
    }
  }
};

// Helper function to format views
function formatViews(views) {
  if (!views) return "N/A";
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }
  return views.toString();
}

// Download Method 1: YouTube DL API
async function downloadFromAPI(videoUrl, quality) {
  try {
    const apiUrl = `https://api.heckerman06.repl.co/api/youtube-video?url=${encodeURIComponent(videoUrl)}&quality=${quality}`;
    const response = await axios.get(apiUrl, { 
      responseType: 'arraybuffer',
      timeout: 60000 
    });
    
    if (response.data && response.data.length > 1000) { // Check if valid video data
      return Buffer.from(response.data);
    }
    return null;
  } catch (error) {
    throw error;
  }
}

// Download Method 2: Alternative API 1
async function downloadFromAPI2(videoUrl, quality) {
  try {
    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.post(apiUrl, {
      url: videoUrl
    }, {
      timeout: 60000
    });
    
    if (response.data && response.data.videoUrl) {
      const videoResponse = await axios.get(response.data.videoUrl, {
        responseType: 'arraybuffer',
        timeout: 60000
      });
      
      if (videoResponse.data) {
        return Buffer.from(videoResponse.data);
      }
    }
    return null;
  } catch (error) {
    throw error;
  }
}

// Download Method 3: Alternative API 2
async function downloadFromAPI3(videoUrl) {
  try {
    const apiUrl = `https://youtube-downloader-api-18.herokuapp.com/download?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    if (response.data) {
      return Buffer.from(response.data);
    }
    return null;
  } catch (error) {
    throw error;
  }
}

// Download Method 4: ytdl-core (requires installation)
async function downloadWithYtdl(videoUrl, quality) {
  try {
    // Create temp directory
    const tempDir = path.join(__dirname, 'temp_videos');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const videoPath = path.join(tempDir, `video_${Date.now()}.mp4`);
    
    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    
    // Choose format based on quality
    let format;
    if (quality === '720') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    } else if (quality === '480') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: format => format.height <= 480 });
    } else if (quality === '360') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: format => format.height <= 360 });
    } else if (quality === '240') {
      format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: format => format.height <= 240 });
    } else {
      format = ytdl.chooseFormat(info.formats, { quality: 'lowest' });
    }
    
    if (!format) {
      throw new Error('No suitable format found');
    }
    
    // Download video
    const stream = ytdl(videoUrl, { format: format });
    const writeStream = fs.createWriteStream(videoPath);
    
    await new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    
    // Check file size
    const stats = fs.statSync(videoPath);
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    return videoPath;
  } catch (error) {
    throw error;
  }
    }
