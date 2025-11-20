const os = require("os");
const moment = require("moment-timezone");

module.exports.config = {
	name: "upt",
	version: "6.0.0",
	hasPermssion: 0,
	credits: "Irfan • GPT Ultra Matrix Edition",
	description: "Cyberpunk Animated Uptime Panel",
	commandCategory: "system",
	cooldowns: 5,
	dependencies: { "pidusage": "" }
};

// Convert bytes
function byte2mb(bytes) {
	return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// 🔥 MATRIX RAIN ANIMATED LOGO
const introFrames = [
"🟢 Initializing MATRIX…",
"🟢 Initializing MATRIX…▮",
"🟢 Initializing MATRIX…██",
"🟢 Initializing MATRIX…███",
"🟢 Initializing MATRIX…████",
"🟢 Initializing MATRIX…█████",
"🟢 Booting System Kernel…",
"🟢 Loading CyberCore…",
"🟢 Access Granted ✔",
"🟢 Launching Uptime Panel…"
];

// ⚡ NEON LOADING BAR FRAMES
const loadingFrames = [
"[□□□□□□□□□□] 0%",
"[■□□□□□□□□□] 10%",
"[■■□□□□□□□□] 20%",
"[■■■□□□□□□□] 30%",
"[■■■■□□□□□□] 40%",
"[■■■■■□□□□□] 50%",
"[■■■■■■□□□□] 60%",
"[■■■■■■■□□□] 70%",
"[■■■■■■■■□□] 80%",
"[■■■■■■■■■□] 90%",
"[■■■■■■■■■■] 100%"
];

module.exports.languages = {
	"en": {
		"returnResult":
`🟩 **CYBER MATRIX UPTIME PANEL**

⏳ **Uptime:** %1h %2m %3s (%12%)
📡 **Ping:** %8ms

👥 **Users:** %4
💬 **Groups:** %5

🧠 **CPU Usage:** %6%
⚡ **CPU LoadBar:** %13
💾 **RAM Used:** %7
📦 **RAM Total:** %14
🟦 **RAM Free:** %15

⚙️ **CPU Model:** %9
🛠 **Platform:** %10
📱 **Device:** %11

━━━━━━━━━━━━━━━━━━
✨ *Matrix Edition by Irfan*
`
	}
};

module.exports.run = async ({ api, event, getText }) => {

	const pidusage = await global.nodemodule["pidusage"](process.pid);
	const cpuLoad = pidusage.cpu;
	const ramUsed = pidusage.memory;
	const totalRAM = os.totalmem();
	const freeRAM = os.freemem();

	// CPU LOAD BAR
	const bar = Math.round(cpuLoad / 10);
	const cpuBar = "█".repeat(bar) + "░".repeat(10 - bar);

	// Uptime
	const t = process.uptime();
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = Math.floor(t % 60);
	const uptimePercent = ((t / 86400) * 100).toFixed(2); // out of 24h

	// Start Matrix Intro
	api.sendMessage(introFrames[0], event.threadID, (err, info) => {
		let i = 0;

		const introInterval = setInterval(() => {
			if (i >= introFrames.length) {
				clearInterval(introInterval);

				// Start neon loading animation
				api.sendMessage("⚡ Loading System Panel…", event.threadID, (err2, info2) => {
					let j = 0;

					const loadInterval = setInterval(() => {
						if (j >= loadingFrames.length) {
							clearInterval(loadInterval);

							// Calculate Ping
							const start = Date.now();
							api.sendMessage("⏳ Finalizing Matrix Report…", event.threadID, () => {
								const ping = Date.now() - start;

								api.sendMessage(
									getText(
										"returnResult",
										h, m, s,
										global.data.allUserID.length,
										global.data.allThreadID.length,
										cpuLoad.toFixed(1),
										byte2mb(ramUsed),
										ping,
										os.cpus()[0].model,
										os.platform(),
										os.hostname(),
										uptimePercent,
										`[${cpuBar}]`,
										(byte2mb(totalRAM)),
										(byte2mb(freeRAM))
									),
									event.threadID,
									event.messageID
								);
							});

							return;
						}

						api.editMessage(loadingFrames[j], info2.messageID);
						j++;

					}, 200);
				});

				return;
			}

			api.editMessage(introFrames[i], info.messageID);
			i++;

		}, 200);
	});
};
