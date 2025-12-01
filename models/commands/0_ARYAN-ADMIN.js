const fs = require("fs");
const path = require("path");
const axios = require("axios");

class AdminModule {
    constructor() {
        this.config = {
            name: "admin",
            version: "5.0.0",
            hasPermssion: 0,
            credits: "LEGEND-ARYAN",
            description: "✨ AI-Powered Bot Owner Interaction System",
            commandCategory: "premium",
            cooldowns: 3,
            dependencies: {
                "axios": "",
                "fs-extra": ""
            },
            envConfig: {
                ADMIN_ID: "61580003810694", // Your Facebook UID
                BOT_ID: "100088878352342", // Bot ID
                BOT_NAME: "FB Bot",
                CONTACT_LINK: "https://www.facebook.com/profile.php?id=61580003810694", // Your Facebook link
                PROFILE_LINK: "https://www.facebook.com/profile.php?id=61580003810694", // Your profile link
                VIP_USERS: [] // Add VIP user IDs
            },
            // Your bot info from screenshot
            botInfo: {
                name: "FB Bot",
                id: "100088878352342",
                prefix: "/",
                commands: 141,
                totalUsers: 6917,
                totalThreads: 43,
                ownerName: "M.R ARYAN",
                ownerUID: "61580003810694",
                ownerMessage: "Tjost Me Baby I Will 💤 💤 Break Your Heart",
                status: "Online",
                profileLink: "https://www.facebook.com/profile.php?id=61580003810694"
            }
        };
        
        this.cooldowns = new Map();
        this.stats = {
            triggers: 0,
            users: new Set(),
            lastTrigger: null
        };
    }

    async checkCooldown(userID) {
        const now = Date.now();
        const cooldownTime = this.config.cooldowns * 1000;
        const userCooldown = this.cooldowns.get(userID);
        
        if (userCooldown && (now - userCooldown) < cooldownTime) {
            return false;
        }
        this.cooldowns.set(userID, now);
        return true;
    }

    async generateSmartResponse(name, userID) {
        const responses = [
            {
                condition: () => this.stats.users.has(userID),
                message: `🌟 Welcome back ${name}! Always great to see you again!`
            },
            {
                condition: () => new Date().getHours() < 12,
                message: `🌅 Good morning ${name}! Starting your day with bot magic?`
            },
            {
                condition: () => new Date().getHours() > 18,
                message: `🌙 Good evening ${name}! How can I assist you tonight?`
            },
            {
                condition: () => Math.random() > 0.7,
                message: `🎯 Hey ${name}! You found the secret trigger! Here's your exclusive access!`
            },
            {
                message: `👋 Hello ${name}! How can I help you today?`
            }
        ];

        const response = responses.find(r => !r.condition || r.condition()) || responses[responses.length - 1];
        return response.message;
    }

    async fetchOwnerData() {
        try {
            return {
                name: this.config.botInfo.ownerName,
                uid: this.config.botInfo.ownerUID,
                role: "Bot Owner & Developer",
                skills: ["Bot Development", "System Administration", "AI Integration"],
                experience: "2+ Years",
                projects: this.config.botInfo.commands,
                status: "🟢 Online",
                quote: this.config.botInfo.ownerMessage,
                profileLink: this.config.botInfo.profileLink
            };
        } catch {
            return null;
        }
    }

    createScreenshotDisplay() {
        const botInfo = this.config.botInfo;
        
        const screenshotArt = `
╔════════════════════════════════════════════╗
║         📱 𝗕𝗢𝗧 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗩𝗜𝗘𝗪          ║
╠════════════════════════════════════════════╣
║  𝗢𝘄𝗻𝗲𝗿: ${botInfo.ownerName.padEnd(30)}║
║  𝗢𝘄𝗻𝗲𝗿 𝗨𝗜𝗗: ${botInfo.ownerUID.padEnd(25)}║
║  𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${botInfo.name.padEnd(27)}║
║  𝗕𝗼𝘁 𝗜𝗗: ${botInfo.id.padEnd(29)}║
╠════════════════════════════════════════════╣
║  𝗣𝗿𝗲𝗳𝗶𝘅: ${botInfo.prefix.padEnd(29)}║
║  𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${botInfo.commands.toString().padEnd(25)}║
║  𝗨𝘀𝗲𝗿𝘀: ${botInfo.totalUsers.toString().padEnd(28)}║
║  𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${botInfo.totalThreads.toString().padEnd(26)}║
╠════════════════════════════════════════════╣
║  𝗦𝘁𝗮𝘁𝘂𝘀: 🟢 ${botInfo.status.padEnd(26)}║
║                                           ║
║  "${botInfo.ownerMessage}"                ║
║                                           ║
║  🔗 Profile:                              ║
║  ${botInfo.profileLink}   ║
╚════════════════════════════════════════════╝
        `.trim();
        
        return screenshotArt;
    }

    createVisualArt() {
        const arts = [
            this.createScreenshotDisplay(),
            
            `╔══════════════════════════════════╗
║      👑 𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘  👑      ║
╠══════════════════════════════════╣
║ 𝗡𝗮𝗺𝗲  : ${this.config.botInfo.ownerName.slice(0, 25).padEnd(25)}║
║ 𝗨𝗜𝗗   : ${this.config.botInfo.ownerUID}    ║
║ 𝗕𝗼𝘁 𝗜𝗗: ${this.config.botInfo.id}    ║
║ 𝗦𝘁𝗮𝘁𝘂𝘀: 🟢 𝗢𝗡𝗟𝗜𝗡𝗘               ║
║ 𝗟𝗲𝘃𝗲𝗹 : ██████████ 100%         ║
╠══════════════════════════════════╣
║ 🔗 ${this.config.botInfo.profileLink.slice(0, 30)}... ║
╚══════════════════════════════════╝`,

            `┌─────────────────────────────┐
│     ⚡ 𝗕𝗢𝗧 𝗠𝗔𝗦𝗧𝗘𝗥 ⚡      │
├─────────────────────────────┤
│ ➤ 𝗢𝘄𝗻𝗲𝗿: ${this.config.botInfo.ownerName.slice(0, 12)}  │
│ ➤ 𝗨𝗜𝗗: ${this.config.botInfo.ownerUID}   │
│ ➤ 𝗕𝗼𝘁 𝗜𝗗: ${this.config.botInfo.id.slice(0, 8)}... │
│ ➤ 𝗨𝘀𝗲𝗿𝘀: ${this.config.botInfo.totalUsers}         │
│ ➤ 𝗦𝘁𝗮𝘁𝘂𝘀: Active          │
├─────────────────────────────┤
│ 🔗 Profile Link:            │
│ ${this.config.botInfo.profileLink} │
└─────────────────────────────┘`
        ];
        
        return arts[Math.floor(Math.random() * arts.length)];
    }

    async handleEvent({ api, event, Users }) {
        try {
            const triggers = [
                "admin", "boss", "akashi", "owner", "malik",
                "creator", "developer", "bot father", "sir",
                "master", "legend", "akashi bhai", "admin sir",
                "my id", "bot info", "screenshot", "profile",
                "uid", "facebook", "profile link", "contact"
            ];
            
            const message = (event.body || "").toLowerCase();
            const shouldTrigger = triggers.some(trigger => 
                new RegExp(`\\b${trigger}\\b`, 'i').test(message)
            );
            
            if (!shouldTrigger || event.senderID === api.getCurrentUserID()) {
                return;
            }
            
            if (!await this.checkCooldown(event.senderID)) {
                const timeLeft = Math.ceil((this.config.cooldowns * 1000 - 
                    (Date.now() - this.cooldowns.get(event.senderID))) / 1000);
                
                if (Math.random() > 0.5) {
                    api.sendMessage({
                        body: `⏳ Please wait ${timeLeft}s before summoning again!`,
                        mentions: [{
                            tag: await Users.getNameUser(event.senderID),
                            id: event.senderID
                        }]
                    }, event.threadID, event.messageID);
                }
                return;
            }
            
            this.stats.triggers++;
            this.stats.users.add(event.senderID);
            this.stats.lastTrigger = new Date();
            
            const userName = await Users.getNameUser(event.senderID);
            const { threadID, messageID } = event;
            const ownerData = await this.fetchOwnerData();
            
            const smartGreeting = await this.generateSmartResponse(userName, event.senderID);
            const visualArt = this.createVisualArt();
            
            const attachments = [];
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            
            for (const ext of imageExtensions) {
                const imagePath = path.join(__dirname, "assets", `profile${ext}`);
                if (fs.existsSync(imagePath)) {
                    attachments.push(fs.createReadStream(imagePath));
                    break;
                }
            }
            
            const messageData = {
                body: `${visualArt}\n\n` +
                      `🎯 ${smartGreeting}\n\n` +
                      `📊 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:\n` +
                      `├─ 𝗡𝗮𝗺𝗲: ${ownerData?.name || this.config.botInfo.ownerName}\n` +
                      `├─ 𝗨𝗜𝗗: ${this.config.botInfo.ownerUID}\n` +
                      `├─ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${this.config.botInfo.name}\n` +
                      `├─ 𝗕𝗼𝘁 𝗜𝗗: ${this.config.botInfo.id}\n` +
                      `├─ 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${this.config.botInfo.totalUsers}\n` +
                      `└─ 𝗦𝘁𝗮𝘁𝘂𝘀: ${ownerData?.status || "🟢 Online"}\n\n` +
                      `🔗 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗟𝗜𝗡𝗞:\n` +
                      `${this.config.botInfo.profileLink}\n\n` +
                      `💡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦:\n` +
                      `• /admin - Show this menu\n` +
                      `• /admin screenshot - Show bot screenshot\n` +
                      `• /admin stats - View statistics\n` +
                      `• /admin contact - Contact owner\n` +
                      `• /admin uid - Show UID information\n\n` +
                      `⚡ Try typing "/help" to see all commands!`,
                attachment: attachments.length > 0 ? attachments[0] : null,
                mentions: [{
                    tag: userName,
                    id: event.senderID
                }]
            };
            
            api.sendTypingIndicator(threadID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const sentMsg = await api.sendMessage(messageData, threadID);
            
            const reactions = ["❤️", "🔥", "👑", "⚡"];
            for (const reaction of reactions) {
                await new Promise(resolve => setTimeout(resolve, 500));
                api.setMessageReaction(reaction, event.messageID, () => {}, true);
            }
            
            console.log(`📈 [ADMIN MODULE] Triggered by ${userName} | Total: ${this.stats.triggers}`);
            
        } catch (error) {
            console.error("🚨 Admin Module Error:", error);
            
            const fallbackMsg = {
                body: `⚡ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗟𝗘𝗥𝗧 ⚡\n\n` +
                      `The admin module is experiencing issues!\n` +
                      `But don't worry, ${await Users.getNameUser(event.senderID)}!\n\n` +
                      `👑 Owner: ${this.config.botInfo.ownerName}\n` +
                      `🆔 UID: ${this.config.botInfo.ownerUID}\n` +
                      `🔗 Profile: ${this.config.botInfo.profileLink}\n` +
                      `📧 Contact: ${this.config.envConfig.CONTACT_LINK}`
            };
            
            api.sendMessage(fallbackMsg, event.threadID, event.messageID);
        }
    }

    async run({ api, event, args, Users }) {
        const subCommand = args[0]?.toLowerCase();
        const userName = await Users.getNameUser(event.senderID);
        
        switch(subCommand) {
            case 'screenshot':
            case 'ss':
            case 'profile':
                const screenshotMsg = {
                    body: this.createScreenshotDisplay() + `\n\n` +
                          `👋 Hello ${userName}! This is your bot's profile screenshot.\n` +
                          `📱 Bot Name: ${this.config.botInfo.name}\n` +
                          `🆔 Owner UID: ${this.config.botInfo.ownerUID}\n` +
                          `🔗 Profile Link: ${this.config.botInfo.profileLink}\n` +
                          `👑 Owner: ${this.config.botInfo.ownerName}`
                };
                api.sendMessage(screenshotMsg, event.threadID, event.messageID);
                break;
                
            case 'stats':
                const statsMsg = {
                    body: `📊 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦\n\n` +
                          `├─ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${this.config.botInfo.name}\n` +
                          `├─ 𝗕𝗼𝘁 𝗜𝗗: ${this.config.botInfo.id}\n` +
                          `├─ 𝗢𝘄𝗻𝗲𝗿 𝗨𝗜𝗗: ${this.config.botInfo.ownerUID}\n` +
                          `├─ 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${this.config.botInfo.totalUsers}\n` +
                          `├─ 𝗧𝗼𝘁𝗮𝗹 𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${this.config.botInfo.totalThreads}\n` +
                          `├─ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${this.config.botInfo.commands}\n` +
                          `├─ 𝗣𝗿𝗲𝗳𝗶𝘅: ${this.config.botInfo.prefix}\n` +
                          `├─ 𝗔𝗗𝗠𝗜𝗡 𝗧𝗿𝗶𝗴𝗴𝗲𝗿𝘀: ${this.stats.triggers}\n` +
                          `└─ 𝗨𝗻𝗶𝗾𝘂𝗲 𝗨𝘀𝗲𝗿𝘀: ${this.stats.users.size}\n\n` +
                          `🔗 Profile: ${this.config.botInfo.profileLink}\n\n` +
                          `👋 Hello ${userName}! Thanks for checking stats!`
                };
                api.sendMessage(statsMsg, event.threadID, event.messageID);
                break;
                
            case 'contact':
            case 'link':
            case 'profilelink':
                const contactMsg = {
                    body: `📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n\n` +
                          `👑 𝗢𝘄𝗻𝗲𝗿: ${this.config.botInfo.ownerName}\n` +
                          `🆔 𝗨𝗜𝗗: ${this.config.botInfo.ownerUID}\n` +
                          `💼 𝗥𝗼𝗹𝗲: Bot Owner & Developer\n` +
                          `🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${this.config.botInfo.name}\n` +
                          `🆔 𝗕𝗼𝘁 𝗜𝗗: ${this.config.botInfo.id}\n\n` +
                          `🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗣𝗿𝗼𝗳𝗶𝗹𝗲:\n` +
                          `${this.config.botInfo.profileLink}\n\n` +
                          `📧 For support or inquiries about ${this.config.botInfo.name}!`
                };
                api.sendMessage(contactMsg, event.threadID, event.messageID);
                break;
                
            case 'id':
            case 'myid':
            case 'uid':
                const idMsg = {
                    body: `🆔 𝗨𝗜𝗗 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n\n` +
                          `┌─────────────────────────┐\n` +
                          `│     👤 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢     │\n` +
                          `├─────────────────────────┤\n` +
                          `│ 𝗡𝗮𝗺𝗲: ${userName.slice(0, 18).padEnd(18)} │\n` +
                          `│ 𝗨𝗜𝗗: ${event.senderID}    │\n` +
                          `│ 𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗗: ${event.threadID} │\n` +
                          `└─────────────────────────┘\n\n` +
                          `👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:\n` +
                          `• Name: ${this.config.botInfo.ownerName}\n` +
                          `• UID: ${this.config.botInfo.ownerUID}\n` +
                          `• Bot ID: ${this.config.botInfo.id}\n\n` +
                          `🔗 Owner Profile Link:\n` +
                          `${this.config.botInfo.profileLink}`
                };
                api.sendMessage(idMsg, event.threadID, event.messageID);
                break;
                
            case 'facebook':
            case 'fb':
            case 'profilelink':
                const fbMsg = {
                    body: `📱 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘\n\n` +
                          `👤 Profile Owner: ${this.config.botInfo.ownerName}\n` +
                          `🆔 Facebook UID: ${this.config.botInfo.ownerUID}\n\n` +
                          `🔗 Direct Profile Link:\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `${this.config.botInfo.profileLink}\n\n` +
                          `💡 Click the link above to visit the profile!\n` +
                          `🌟 Or copy and paste it in your browser.`
                };
                api.sendMessage(fbMsg, event.threadID, event.messageID);
                break;
                
            default:
                const mainMsg = {
                    body: `🎮 𝗔𝗗𝗠𝗜𝗡 𝗠𝗢𝗗𝗨𝗟𝗘 - ${this.config.botInfo.name.toUpperCase()}\n\n` +
                          `Available commands:\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `📱 /admin screenshot - Show bot profile\n` +
                          `📊 /admin stats - View bot statistics\n` +
                          `📞 /admin contact - Contact owner\n` +
                          `🆔 /admin uid - Show UID information\n` +
                          `📱 /admin facebook - Get Facebook link\n` +
                          `🎯 /admin help - Show this menu\n\n` +
                          `👑 Owner: ${this.config.botInfo.ownerName}\n` +
                          `🆔 UID: ${this.config.botInfo.ownerUID}\n` +
                          `🔗 Profile: ${this.config.botInfo.profileLink}\n\n` +
                          `💬 Try: "show my uid" or "facebook link" to activate!`
                };
                api.sendMessage(mainMsg, event.threadID, event.messageID);
        }
    }
}

const adminModule = new AdminModule();
module.exports = {
    config: adminModule.config,
    handleEvent: adminModule.handleEvent.bind(adminModule),
    run: adminModule.run.bind(adminModule)
};
