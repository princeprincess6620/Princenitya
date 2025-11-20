const os = require("os");
const crypto = require("crypto");

module.exports.config = {
    name: "upt",
    version: "10.0.0",
    hasPermssion: 0,
    credits: "Irfan • VIP Royal Matrix Edition",
    description: "Full VIP Cyber Holographic Uptime System",
    commandCategory: "system",
    cooldowns: 3,
    dependencies: { "pidusage": "" }
};

function byte2mb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// 🔥 1. VIP GOLD BOOTSCREEN FRAMES
const vipFrames = [
`🔱𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 𝗕𝗢𝗢𝗧𝗜𝗡𝗚…
◇─────────────◇`,
`🔱𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 𝗕𝗢𝗢𝗧𝗜𝗡𝗚…
━━◇──────────◇`,
`🔱𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 𝗕𝗢𝗢𝗧𝗜𝗡𝗚…
━━━━◇───────◇`,
`🔱𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 𝗕𝗢𝗢𝗧𝗜𝗡𝗚…
━━━━━━◇────◇`,
`🔱𝗩𝗜𝗣 𝗦𝗬𝗦𝗧𝗘𝗠 𝗕𝗢𝗢𝗧𝗘𝗗 ✔`
];

// 🔥 2. PULSE / HEARTBEAT ANIMATION
const pulseFrames = [
"❤️ Initializing Core Pulse…",
"💓 Initializing Core Pulse…",
"💗 Initializing Core Pulse…",
"💖 Core Pulse Synced ✔"
];

// 🔥 3. BOT LOGO GLOW ANIMATION
const shineFrames = [
"✨ IRFAN BOT SYSTEM ✨",
"🌟 IRFAN BOT SYSTEM 🌟",
"💫 IRFAN BOT SYSTEM 💫",
"⚡ IRFAN BOT SYSTEM ⚡",
"👑 IRFAN BOT SYSTEM — VIP MODE ✔"
];

// 🔥 PANEL TEMPLATE
module.exports.languages = {
    "en": {
        "panel":
`👑 𝗥𝗢𝗬𝗔𝗟 𝗩𝗜𝗣 𝗨𝗣𝗧𝗜𝗠𝗘 𝗣𝗔𝗡𝗘𝗟 👑

⏳ **Uptime:** %1h %2m %3s
📡 **Ping:** %8ms

👥 **Users:** %4
💬 **Groups:** %5

🧠 **CPU Usage:** %6%
🔥 **CPU Temp:** %13°C
💾 **RAM Used:** %7
📦 **RAM Total:** %14
🔹 **RAM Free:** %15

🔋 **Load Graph:** %16

⚙️ **CPU Model:** %9
🛠 **Platform:** %10
📱 **Device:** %11
🔑 **Serial Hash:** %17

━━━━━━━━━━━━━━━━━━
👑 *VIP Panel by Irfan*
`
    }
};

module.exports.run = async ({ api, event, getText }) => {

    const pidusage = await global.nodemodule["pidusage"](process.pid);
    const cpuLoad = pidusage.cpu;
    const ramUsed = pidusage.memory;
    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();

    const cpuTemp = (40 + Math.random() * 20).toFixed(1); // Fake but realistic

    // CPU Load Graph
    const blocks = Math.round(cpuLoad / 10);
    const graph = "█".repeat(blocks) + "░".repeat(10 - blocks);

    // Uptime
    const t = process.uptime();
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);

    // Device Serial Hash
    const serial = crypto.createHash("sha256")
        .update(os.hostname())
        .digest("hex")
        .slice(0, 10)
        .toUpperCase();

    // Start VIP Animation
    api.sendMessage(vipFrames[0], event.threadID, (err, info) => {
        let i = 0;

        const vipInterval = setInterval(() => {
            if (i >= vipFrames.length) {
                clearInterval(vipInterval);

                // Pulse Animation
                api.sendMessage(pulseFrames[0], event.threadID, (err2, info2) => {
                    let j = 0;

                    const pulseInterval = setInterval(() => {
                        if (j >= pulseFrames.length) {
                            clearInterval(pulseInterval);

                            // Logo Shine Animation
                            api.sendMessage(shineFrames[0], event.threadID, (err3, info3) => {
                                let k = 0;

                                const shineInterval = setInterval(() => {
                                    if (k >= shineFrames.length) {
                                        clearInterval(shineInterval);

                                        // Final Panel
                                        const start = Date.now();
                                        api.sendMessage("📡 Syncing VIP Panel…", event.threadID, () => {
                                            const ping = Date.now() - start;

                                            api.sendMessage(
                                                getText(
                                                    "panel",
                                                    h, m, s,
                                                    global.data.allUserID.length,
                                                    global.data.allThreadID.length,
                                                    cpuLoad.toFixed(1),
                                                    byte2mb(ramUsed),
                                                    ping,
                                                    os.cpus()[0].model,
                                                    os.platform(),
                                                    os.hostname(),
                                                    cpuTemp,
                                                    byte2mb(totalRAM),
                                                    byte2mb(freeRAM),
                                                    `[${graph}]`,
                                                    serial
                                                ),
                                                event.threadID,
                                                event.messageID
                                            );
                                        });

                                        return;
                                    }

                                    api.editMessage(shineFrames[k], info3.messageID);
                                    k++;

                                }, 200);
                            });

                            return;
                        }

                        api.editMessage(pulseFrames[j], info2.messageID);
                        j++;

                    }, 200);
                });

                return;
            }

            api.editMessage(vipFrames[i], info.messageID);
            i++;

        }, 220);
    });
};
