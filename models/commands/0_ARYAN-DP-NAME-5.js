
module.exports.config = {
  name: "dpname5",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Modified for Sharp (No Canvas Needed)",
  description: "DP Name Maker - दो नामों के साथ स्टाइलिश DP",
  commandCategory: "image",
  usages: "Text1 + Text2",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  try {
    const sharp = global.nodemodule["sharp"];
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    if (!sharp) {
      return api.sendMessage("❌ Sharp module नहीं मिला।\n\nइंस्टॉल करने के लिए टर्मिनल में चलाएं:\nnpm install sharp", threadID, messageID);
    }

    // Input check
    const input = args.join(" ").split("+");
    if (input.length < 2 || !input[0].trim() || !input[1].trim()) {
      return api.sendMessage(
        "❌ गलत फॉर्मेट!\n\n✅ सही तरीका:\n dpname5 पहला नाम + दूसरा नाम\n\nउदाहरण: dpname5 Aryan + Khan",
        threadID,
        messageID
      );
    }

    const text1 = input[0].trim();
    const text2 = input[1].trim();

    // Background इमेज डाउनलोड
    const bgUrl = "https://i.imgur.com/ZQrkbch.jpg"; // तुम्हारा पुराना वाला अच्छा है
    const { data: bgBuffer } = await axios.get(bgUrl, { responseType: "arraybuffer" });

    // Sharp से इमेज बनाओ
    const image = sharp(bgBuffer);

    // Text overlay के लिए SVG बनाओ (sharp में text डालने का सबसे अच्छा तरीका)
    const svgText = `
    <svg width="1080" height="1080">
      <style>
        .title1 { fill: white; font-size: 80px; font-weight: bold; text-anchor: middle; font-family: "Arial", sans-serif; }
        .outline1 { fill: none; stroke: black; stroke-width: 8; text-anchor: middle; font-family: "Arial", sans-serif; }
        .title2 { fill: white; font-size: 70px; font-weight: bold; text-anchor: middle; font-family: "Arial", sans-serif; }
        .outline2 { fill: none; stroke: black; stroke-width: 7; text-anchor: middle; font-family: "Arial", sans-serif; }
      </style>

      <!-- पहला नाम (ऊपर) -->
      <text x="540" y="280" class="outline1" font-size="80">${text1}</text>
      <text x="540" y="280" class="title1" font-size="80">${text1}</text>

      <!-- दूसरा नाम (नीचे) -->
      <text x="540" y="580" class="outline2" font-size="70">${text2}</text>
      <text x="540" y="580" class="title2" font-size="70">${text2}</text>
    </svg>
    `;

    const svgBuffer = Buffer.from(svgText);

    // Final इमेज बनाओ
    const outputBuffer = await image
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .png()
      .toBuffer();

    // Send करो
    api.sendMessage(
      {
        body: "👑 यह रहा आपका स्टाइलिश DP Name! 👑\n\nअगर पसंद आया तो ❤️ रिएक्ट कर देना 😍",
        attachment: outputBuffer
      },
      threadID,
      messageID
    );

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ कुछ गलत हुआ। दोबारा ट्राय करें।\n\nअगर बार-बार आए तो sharp module चेक करें।", threadID, messageID);
  }
};
