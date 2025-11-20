const os = require("os");
const moment = require("moment-timezone");

module.exports.config = {
	name: "upt",
	version: "4.0.0",
	hasPermssion: 0,
	credits: "Irfan • GPT-Ultra Edition",
	description: "Ultra Premium Animated Uptime Panel",
	commandCategory: "system",
	cooldowns: 5,
	dependencies: { "pidusage": "" }
};

function byte2mb(bytes) {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let i = 0;
	while (bytes >= 1024 && i < units.length - 1) {
		bytes /= 1024;
		i++;
	}
	return `${bytes.toFixed(2)} ${units[i]}`;
}

// 🔥 ANIMATED ASCII FRAMES
const frames = [
`╔════════════════════╗
║  ⚡ SYSTEM CHECK ⚡  ║
╚════════════════════╝`,

`╔════════════════════╗
║  ⚡ SYSTEM CHECK ⚡▮ ║
╚════════════════════╝`,

`╔════════════════════╗
║  ⚡ SYSTEM CHECK ⚡██║
╚════════════════════╝`,

`╔════════════════════╗
║  ⚡ SYSTEM CHECK ⚡███║
╚════════════════════╝`,

`╔════════════════════╗
║  ⚡ SYSTEM CHECK ⚡████║
╚════════════════════╝`
];

module.exports.languages = {
	"en": {
		"returnResult":
`🌐 **𝙐𝙇𝙏𝙍𝘼 𝙋𝙍𝙊 𝙐𝙋𝙏𝙄𝙈𝙀 𝙎𝙔𝙎𝙏𝙀𝙈**

⏳ **Uptime:** %1h %2m %3s
📡 **Ping:** %8ms

👥 **Users:** %4
💬 **Groups:** %5

🧠 **CPU Usage:** %6%
💾 **RAM Usage:** %7
⚙️ **CPU Model:** %9
🛠 **Platform:** %10
📱 **Device:** %11

──────────────────
✨ *Developed by Aryan | GPT-Ultra Edition*
`
	}
};

module.exports.run = async ({ api, event, getText }) => {

	const pidusage = await global.nodemodule["pidusage"](process.pid);

	// Uptime
	const t = process.uptime();
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = Math.floor(t % 60);

	// System Info
	const cpuModel = os.cpus()[0].model;
	const platform = os.platform();
	const device = os.hostname();

	// Start Animation
	let i = 0;
	api.sendMessage(frames[0], event.threadID, async (err, info) => {
		const interval = setInterval(() => {
			if (i >= frames.length) {
				clearInterval(interval);

				// Ping Calculate
				const start = Date.now();
				api.sendMessage("⏳ Finalizing report…", event.threadID, () => {
					const ping = Date.now() - start;

					api.sendMessage(
						getText(
							"returnResult",
							h, m, s,
							global.data.allUserID.length,
							global.data.allThreadID.length,
							pidusage.cpu.toFixed(1),
							byte2mb(pidusage.memory),
							ping,
							cpuModel,
							platform,
							device
						),
						event.threadID,
						event.messageID
					);
				});

				return;
			}

			api.editMessage(frames[i], info.messageID);
			i++;

		}, 250); // Animation speed
	});
};
