const os = require("os");
const { performance } = require("perf_hooks");

module.exports.config = {
  name: "status",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Developer",
  description: "System Status Panel",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    // Loading Animation
    const frames = [
      "🔄 System Status Loading...",
      "🔄 System Status Loading... █",
      "🔄 System Status Loading... ██", 
      "🔄 System Status Loading... ███",
      "🔄 System Status Loading... ████",
      "🔄 System Status Loading... █████"
    ];

    let loadMsg = await api.sendMessage(frames[0], threadID, messageID);
    
    for (const frame of frames) {
      await new Promise(resolve => setTimeout(resolve, 200));
      await api.editMessage(frame, loadMsg.messageID);
    }

    // System Data Collection
    const uptime = getUptime();
    const memory = getMemory();
    const systemInfo = getSystemInfo();
    const ping = await getPing(api, event);
    const speed = await getBotSpeed();

    // Status Card
    const statusCard = `
╔═══════════════════════════════╗
║         SYSTEM STATUS         ║
╠═══════════════════════════════╣
║ 📊 UPTIME: ${uptime}
║ 💾 MEMORY: ${memory.used} / ${memory.total}
║ 🖥️  CPU: ${systemInfo.cpu}% | Cores: ${systemInfo.cores}
║ 🌡️  TEMP: ${systemInfo.temp}°C
║ 📡 PING: ${ping}ms
║ ⚡ SPEED: ${speed}ms
║ 🏗️  PLATFORM: ${systemInfo.platform}
║ 🔧 NODE: ${systemInfo.node}
╚═══════════════════════════════╝
    `.trim();

    await api.editMessage(statusCard, loadMsg.messageID);

  } catch (error) {
    console.error("Status Error:", error);
    
    // Fallback simple status
    const simpleStatus = `
📊 SYSTEM STATUS (Simple Mode)

⏰ UPTIME: ${getUptime()}
💾 MEMORY: ${getMemory().used}
🖥️  PLATFORM: ${os.platform()}
🔧 NODE: ${process.version}

❌ Detailed mode failed, but bot is running!
    `.trim();
    
    return api.sendMessage(simpleStatus, threadID, messageID);
  }
};

// Utility Functions
function getUptime() {
  const seconds = process.uptime();
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

function getMemory() {
  const used = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  
  return {
    used: `${used} MB`,
    total: `${total} GB`
  };
}

function getSystemInfo() {
  try {
    const cpus = os.cpus();
    const load = os.loadavg()[0];
    const cpuUsage = ((load / cpus.length) * 100).toFixed(1);
    
    return {
      cpu: cpuUsage,
      cores: cpus.length,
      temp: "N/A",
      platform: os.platform(),
      node: process.version
    };
  } catch (error) {
    return {
      cpu: "N/A",
      cores: os.cpus().length,
      temp: "N/A",
      platform: os.platform(),
      node: process.version
    };
  }
}

async function getPing(api, event) {
  try {
    const startTime = Date.now();
    await api.sendMessage("", event.threadID);
    const endTime = Date.now();
    return (endTime - startTime).toFixed(0);
  } catch {
    return "N/A";
  }
}

async function getBotSpeed() {
  try {
    const start = Date.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return (Date.now() - start).toFixed(0);
  } catch {
    return "N/A";
  }
}
