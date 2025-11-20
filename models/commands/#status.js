/**
 * 🌟 COSMIC STATUS v9.0 (Mirai Optimized Edition)
 * Premium System Dashboard • Zero Errors • Ultra Fast
 */

const os = require('os');
const { performance } = require('perf_hooks');

module.exports.config = {
    name: "status",
    aliases: ["stats", "system", "panel", "uptime"],
    version: "9.0",
    author: "Cosmic Labs (Edited by ChatGPT for Mirai)",
    description: "Cosmic System Panel • CPU • RAM • Ping • Bot Stats",
    commandCategory: "system",
    cooldowns: 5,
    hasPermssion: 0
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
        // Loading Message
        const loading = await api.sendMessage("⏳ Loading Cosmic Panel...", threadID);

        // Fast Parallel Data Collection
        const [
            uptime,
            memory,
            system,
            performanceInfo,
            botInfo
        ] = await Promise.all([
            getUptime(),
            getMemory(),
            getSystem(),
            getPerformance(api, event),
            getBotInfo()
        ]);

        // Cosmic UI Panel
        const msg = `
✨ ◈━━━━━━━━━ COSMIC STATUS v9.0 ━━━━━━━━━◈ ✨

🕒 **TIME & PERFORMANCE**
┌──────────────────────────────┐
│ ⭐ Uptime     │ ${uptime}        │
│ 🧠 Memory     │ ${memory.used} / ${memory.total} │
│ ⚡ CPU        │ ${system.cpu}% (${system.cores} cores) │
│ 📡 Ping       │ ${performanceInfo.ping}ms           │
└──────────────────────────────┘

🤖 **BOT UNIVERSE**
┌──────────────────────────────┐
│ 📚 Commands  │ ${botInfo.commands}       │
│ 🎯 Events     │ ${botInfo.events}         │
│ 👥 Users      │ ${botInfo.users}          │
│ 💬 Threads    │ ${botInfo.threads}        │
└──────────────────────────────┘

🔮 **SYSTEM INFO**
┌──────────────────────────────┐
│ 🖥️ Platform  │ ${system.platform} ${system.arch} │
│ 🔧 Node.js   │ ${system.node}         │
│ 🕐 Time      │ ${new Date().toLocaleTimeString()} │
└──────────────────────────────┘

🟢 STATUS: **Operational • Secure • Stable**
`.trim();

        await api.unsendMessage(loading.messageID);
        return api.sendMessage(msg, threadID, messageID);

    } catch (err) {
        console.log("Cosmic Status Error:", err);
        return api.sendMessage("❌ Cosmic Module Error:\n" + err.message, threadID, messageID);
    }
};


/*-------------------------------------*
 |        UTILITY FUNCTIONS           |
 *-------------------------------------*/

async function getUptime() {
    let s = process.uptime();
    let d = Math.floor(s / 86400);
    let h = Math.floor((s % 86400) / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = Math.floor(s % 60);
    return `${d}d ${h}h ${m}m ${sec}s`;
}

async function getMemory() {
    const used = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    return {
        used: `${used}MB`,
        total: `${total}GB`
    };
}

async function getSystem() {
    return {
        platform: os.platform().toUpperCase(),
        arch: os.arch(),
        cores: os.cpus().length,
        cpu: (await getCPUUsage()).toFixed(1),
        node: process.version
    };
}

function getCPUUsage() {
    return new Promise(resolve => {
        const start = cpuTimes();
        setTimeout(() => {
            const end = cpuTimes();
            const idle = end.idle - start.idle;
            const total = end.total - start.total;
            resolve(100 - (idle / total) * 100);
        }, 500);
    });
}

function cpuTimes() {
    const cpus = os.cpus();
    let idle = 0, total = 0;

    cpus.forEach(cpu => {
        for (let type in cpu.times) total += cpu.times[type];
        idle += cpu.times.idle;
    });

    return { idle, total };
}

async function getPerformance(api, event) {
    const start = performance.now();
    await api.sendMessage("", event.threadID);
    const ping = performance.now() - start;

    return { ping: ping.toFixed(1) };
}

async function getBotInfo() {
    return {
        commands: global.client?.commands?.size || "N/A",
        events: global.client?.events?.size || "N/A",
        users: global.data?.users?.size || "N/A",
        threads: global.data?.threads?.size || "N/A"
    };
}
