module.exports = {
  config: {
    name: "linkAutoDownload",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "ARIF-BABU", // ---> DO NOT CHANGE THIS
    description:
      "Automatically detects links in messages and downloads the file.",
    commandCategory: "Utilities",
    usages: "",
    cooldowns: 5,
  },

  // ⛔ CREDIT LOCK SYSTEM
  onLoad: function () {
    const fs = require("fs");
    const path = __filename;
    const fileData = fs.readFileSync(path, "utf8");

    // Check if credits modified
    if (!fileData.includes('credits: "ARIF-BABU"')) {
      console.log("\n========== SECURITY ALERT ==========");
      console.log("❌ Credit name changed! Command disabled.");
      console.log("====================================\n");
      process.exit(1); // stop bot
    }
  },

  run: async function ({ events, args }) {},

  handleEvent: async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const { alldown } = require("arif-babu-downloadr");

    const content = event.body || "";
    const body = content.toLowerCase();

    if (body.startsWith("https://")) {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      try {
        const data = await alldown(content);
        const { high } = data.data;

        api.setMessageReaction("📥", event.messageID, () => {}, true);

        const video = (
          await axios.get(high, { responseType: "arraybuffer" })
        ).data;

        fs.writeFileSync(
          __dirname + "/cache/auto.mp4",
          Buffer.from(video, "utf-8")
        );

        return api.sendMessage(
          {
            body: ``,
            attachment: fs.createReadStream(__dirname + "/cache/auto.mp4"),
          },
          event.threadID,
          event.messageID
        );
      } catch (e) {
        api.sendMessage("❌ Download failed!", event.threadID);
      }
    }
  },
};
