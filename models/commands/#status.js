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
      "🔄 𝐀𝐫𝐲𝐚𝐧 𝐛𝐨𝐭 Loading...",
      "🔄 𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 𝐎𝐅 𝐅𝐀𝐓𝐇𝐄𝐑 Loading... █",
      "🔄 Aryan Status Loading... ██", 
      "🔄 ARYAN BOT Loading... ███",
      "🔄 ARYAN GROUP Loading... ████",
      "🔄 Aryan sytem Loading... █████"
    ];

    let loadMsg = await api.sendMessage(frames[0], threadID);
    
    for (const frame of frames) {
      await new Promise(resolve => setTimeout(resolve, 200));
      await api.editMessage(frame, loadMsg.messageID, threadID);
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
║       💫𝐀𝐑𝐘𝐀𝐍 𝐁𝐎𝐓 𝐒𝐘𝐒𝐓𝐌💫         ║
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

    await api.editMessage("✅ Status Ready!", loadMsg.messageID, threadID);
    return api.sendMessage(statusCard, threadID, messageID);

  } catch (error) {
    console.error("Status Error:", error);
    return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
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
  const cpus = os.cpus();
  const load = os.loadavg()[0] * 100 / cpus.length;
  
  return {
    cpu: load.toFixed(1),
    cores: cpus.length,
    temp: "N/A", // Actual temperature requires additional packages
    platform: os.platform(),
    node: process.version
  };
}

async function getPing(api, event) {
  const startTime = performance.now();
  await api.sendMessage("", event.threadID);
  const endTime = performance.now();
  return (endTime - startTime).toFixed(1);
}

async function getBotSpeed() {
  const start = performance.now();
  // Simple calculation to test speed
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return (performance.now() - start).toFixed(1);
}
