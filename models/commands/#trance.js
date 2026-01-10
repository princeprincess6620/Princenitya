const axios = require("axios");

const OCR_API_KEY = "K82167305688957";

module.exports.config = {
  name: "trance",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "M.R ARYAN",
  description: "Image se text nikal ke Hindi, Urdu aur English me translate karta hai",
  commandCategory: "utility",
  usages: "reply image",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return api.sendMessage(
        "❌ Kisi image / screenshot ke reply me command use karo",
        event.threadID
      );
    }

    const imgUrl = event.messageReply.attachments[0].url;

    // OCR API (English + Hindi + Urdu)
    const ocrRes = await axios.get(
      `https://api.ocr.space/parse/imageurl?apikey=${OCR_API_KEY}&language=eng&url=${encodeURIComponent(imgUrl)}`
    );

    const text = ocrRes.data?.ParsedResults?.[0]?.ParsedText;

    if (!text || !text.trim()) {
      return api.sendMessage("❌ Image me readable text nahi mila", event.threadID);
    }

    // Translate to Hindi
    const hiRes = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=hi&dt=t&q=${encodeURIComponent(text)}`
    );
    const hindi = hiRes.data[0].map(i => i[0]).join("");

    // Translate to Urdu
    const urRes = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ur&dt=t&q=${encodeURIComponent(text)}`
    );
    const urdu = urRes.data[0].map(i => i[0]).join("");

    // Translate to English
    const enRes = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const english = enRes.data[0].map(i => i[0]).join("");

    api.sendMessage(
      `🖼 OCR TEXT:\n${text}\n\n` +
      `🇮🇳 Hindi:\n${hindi}\n\n` +
      `🇵🇰 Urdu:\n${urdu}\n\n` +
      `🇬🇧 English:\n${english}`,
      event.threadID
    );

  } catch (err) {
    api.sendMessage("❌ Error aa gaya:\n" + err.message, event.threadID);
  }
};
