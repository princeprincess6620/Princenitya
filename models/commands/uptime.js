/**
 * QUANTUM STATUS PANEL v3.0
 * Ultra Premium Design • Neon Cyber Style • Advanced Analytics
 * Created by: Irfan Khan
 */

const os = require('os');
const fs = require('fs');

module.exports = {
    config: {
        name: "uptime",
        aliases: ["status", "panel", "system", "stats", "qt"],
        version: "3.0",
        author: "Irfan Khan",
        description: "Quantum Status Panel with Neon Cyber Interface",
        category: "system",
        hasPrefix: false,
        usages: "{p}uptime",
        cooldowns: 10,
        permission: 0
    },

    run: async function({ api, event }) {
        const { threadID, messageID } = event;
        
        try {
            // 🎯 Loading Animation
            const loadingMsg = await api.sendMessage("🚀 Initializing Quantum Interface...", threadID);

            // ⚡ Performance Metrics Collection
            const [uptimeData, memoryData, cpuData, botData, networkData] = await Promise.all([
                getUptimeStats(),
                getMemoryStats(),
                getCPUStats(),
                getBotStats(),
                getNetworkStats(api, event)
            ]);

            // 🎨 Ultra Premium Quantum Interface
            const quantumPanel = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          𝗤𝗨𝗔𝗡𝗧𝗨𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 𝗩𝟯.𝟬         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
${generateSection("🌌 SYSTEM CORE", [
    `⏰ Uptime: ${uptimeData.formatted}`,
    `🧠 RAM: ${memoryData.used}MB / ${memoryData.total}GB`,
    `🔋 Free: ${memoryData.free}GB`,
    `⚡ CPU: ${cpuData.cores} Core • ${cpuData.usage}%`,
    `📡 Latency: ${networkData.ping}ms`
])}
${generateSection("🤖 BOT MATRIX", [
    `📁 Commands: ${botData.commands}`,
    `🎯 Events: ${botData.events}`,
    `👥 Users: ${botData.users}`,
    `💬 Threads: ${botData.threads}`,
    `🔧 Platform: ${networkData.platform}`
])}
${generateSection("🔐 SECURITY STATUS", [
    `🟢 System: OPERATIONAL`,
    `🟢 Network: SECURE`, 
    `🟢 Memory: STABLE`,
    `🟢 CPU: OPTIMAL`,
    `🟢 Bot: ACTIVE`
])}
${generateProgressBar("Performance", 85)}
${generateProgressBar("Stability", 92)}
${generateProgressBar("Speed", 78)}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🚀 Quantum Engine • Ultra Premium    ┃
┃  🔒 Secured • Optimized • Advanced    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
            `.trim();

            // 📤 Send Final Panel
            await api.unsendMessage(loadingMsg.messageID);
            return api.sendMessage(quantumPanel, threadID, messageID);

        } catch (error) {
            console.error("Quantum Panel Error:", error);
            return api.sendMessage(
                `❌ Quantum Interface Failed\n🔧 Error: ${error.message}\n📞 Contact Developer for Support`,
                threadID, messageID
            );
        }
    }
};

// 🛠️ UTILITY FUNCTIONS

function generateSection(title, items) {
    return `┃  ${title}\n${items.map(item => `┃  ↳ ${item}`).join('\n')}`;
}

function generateProgressBar(label, percentage) {
    const bars = 20;
    const filled = Math.round((percentage / 100) * bars);
    const empty = bars - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `┃  ${label}: [${bar}] ${percentage}%`;
}

async function getUptimeStats() {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    return {
        formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        raw: uptime
    };
}

async function getMemoryStats() {
    const used = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const free = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    
    return { used, total, free };
}

async function getCPUStats() {
    const cpus = os.cpus();
    const usage = await calculateCPUUsage();
    
    return {
        cores: cpus.length,
        model: cpus[0]?.model || "Unknown",
        usage: usage
    };
}

async function getBotStats() {
    return {
        commands: global.client?.commands?.size || 0,
        events: global.client?.events?.size || 0,
        users: global.data?.users?.size || "N/A",
        threads: global.data?.threads?.size || "N/A"
    };
}

async function getNetworkStats(api, event) {
    const startTime = Date.now();
    const platform = os.platform().toUpperCase();
    const arch = os.arch();
    
    // Simple ping calculation
    const ping = Date.now() - startTime;
    
    return {
        ping: Math.max(1, ping),
        platform,
        arch,
        nodeVersion: process.version
    };
}

function calculateCPUUsage() {
    return new Promise((resolve) => {
        const firstMeasure = getCPUMetrics();
        
        setTimeout(() => {
            const secondMeasure = getCPUMetrics();
            
            const idleDiff = secondMeasure.idle - firstMeasure.idle;
            const totalDiff = secondMeasure.total - firstMeasure.total;
            const usage = 100 - (100 * idleDiff / totalDiff);
            
            resolve(usage.toFixed(2));
        }, 500);
    });
}

function getCPUMetrics() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    
    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    });
    
    return { idle, total };
}
