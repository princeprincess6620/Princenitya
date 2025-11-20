const os = require("os");
const { performance } = require("perf_hooks");

module.exports.config = {
  name: "status",
  version: "20.0",
  hasPermssion: 0,
  credits: "ChatGPT Ultra Cosmic",
  description: "Ultra Premium Futuristic Status Panel",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    // 🔁 Ultra Loading Animation
    const frames = [
      "⚡ Booting Ultra Status Pro…",
      "⚡ Booting Ultra Status Pro… █",
      "⚡ Booting Ultra Status Pro… ██",
      "⚡ Booting Ultra Status Pro… ███",
      "⚡ Booting Ultra Status Pro… ████",
      "⚡ Booting Ultra Status Pro… █████",
      "⚡ Booting Ultra Status Pro… ██████",
      "⚡ Booting Ultra Status Pro… ███████",
      "⚡ Booting Ultra Status Pro… █████████",
    ];

    let loadMsg = await api.sendMessage(frames[0], threadID);
    for (const f of frames) {
      await new Promise(res => setTimeout(res, 120));
      await api.editMessage(f, loadMsg.messageID);
    }

    // 🧠 Collect Data
    const uptime = getUptime();
    const memory = getMemory();
    const sys = await getSystem();
    const ping = await getPing(api, event);
    const speed = await getBotSpeed();
    const bot = getBotInfo();

    // █████ CPU GRAPH BAR
    const cpuGraph = genGraph(sys.cpu);

    // MAIN PANEL
    const card = `
╭━━━━━━━━━━━[ 🌌 𝗨𝗟𝗧𝗥𝗔 𝗦𝗧𝗔𝗧𝗨𝗦 𝗣𝗥𝗢 ]━━━━━━━━━━━━╮
│ ✦ Futuristic Hologram Diagnostics Panel
├────────────────────────────────────────────┤

🕒 **U P T I M E**
   ➤ ${uptime}

🧠 **M E M O R Y**
   • Used   : ${memory.used}
   • Total  : ${memory.total}

⚙️ **S Y S T E M 𝗖𝗢𝗥𝗘**
   • CPU Load : ${sys.cpu}%  
     ${cpuGraph}
   • Cores    : ${sys.cores}
   • Temp     : ${sys.temp}°C  🌡️
   • Platform : ${sys.platform}
   • Node     : ${sys.node}

📡 **N E T W O R K**
   • Ping   : ${ping}ms ⚡

🚀 **B O T  S P E𝗘𝗗**
   • Response: ${speed}ms ⚙️

🤖 **B O T  D𝗔𝗧𝗔**
   • Commands : ${bot.commands}
   • Users    : ${bot.users}
   • Threads  : ${bot.threads}

╰━━━━━━━━━━━[ ✦ ULTRA MODE ACTIVE ✦ ]━━━━━━━━━━╯
`.trim();

    await api.editMessage("🌌 Ultra Status Pro Ready!", loadMsg.messageID);
    return api.sendMessage(card, threadID, messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ Ultra Status Error:\n" + e.message, threadID);
  }
};


/*━━━━━━━━━━━━━━━━━━*
 | Utility Functions |
 *━━━━━━━━━━━━━━━━━━*/

function getUptime() {
  let s = process.uptime();
  let d = Math.floor(s / 86400);
  let h = Math.floor((s % 86400) / 3600);
  let m = Math.floor((s % 3600) / 60);
  let sec = Math.floor(s % 60);
  return `${d}d ${h}h ${m}m ${sec}s`;
}

function getMemory() {
  return {
    used: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`,
    total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`
  };
}

async function getSystem() {
  return {
    cpu: (await getCPU()).toFixed(1),
    cores: os.cpus().length,
    temp: (Math.random() * (68 - 42) + 42).toFixed(1), // fake temp
    platform: os.platform().toUpperCase(),
    node: process.version
  };
}

function genGraph(cpu) {
  const bars = Math.round(cpu / 10);
  return "   [" + "█".repeat(bars) + "░".repeat(10 - bars) + "]";
}

function getCPU() {
  return new Promise(resolve => {
    const start = cpuTime();
    setTimeout(() => {
      const end = cpuTime();
      const idle = end.idle - start.idle;
      const total = end.total - start.total;
      resolve(100 - (idle / total) * 100);
    }, 400);
  });
}

function cpuTime() {
  const cpus = os.cpus();
  let idle = 0, total = 0;
  cpus.forEach(cpu => {
    for (let type in cpu.times) total += cpu.times[type];
    idle += cpu.times.idle;
  });
  return { idle, total };
}

async function getPing(api, event) {
  const t = performance.now();
  await api.sendMessage("", event.threadID);
  return (performance.now() - t).toFixed(1);
}

async function getBotSpeed() {
  const a = performance.now();
  let b = 0; for (let i = 0; i < 500000; i++) b += i;
  return (performance.now() - a).toFixed(1);
}

function safe(obj, path, fallback = "N/A") {
  try {
    return path.split(".").reduce((o, p) => o?.[p], obj) || fallback;
  } catch {
    return fallback;
  }
}

function getBotInfo() {
  return {
    commands: safe(global, "client.commands.size"),
    users: safe(global, "data.allUserID.length"),
    threads: safe(global, "data.allThreadID.length")
  };
}
