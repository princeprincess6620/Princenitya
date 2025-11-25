const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'autosent',
    version: '10.0.0',
    hasPermssion: 0,
    credits: '𝐌.𝐑 𝐀𝐑𝐘𝐀𝐍',
    description: 'Set Karne Ke Bad Automatically Msg Send Karega',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// Get current date and month
const currentDate = moment().tz('Asia/Kolkata');
const day = currentDate.format('DD');
const month = currentDate.format('MMMM');
const formattedDate = `${day} ${month}`;

const messages = [
    { time: '12:00 AM', message: `┏━━━✦❘༻🔮༺❘✦━━━┓\n     🌙 𝗠𝗶𝗱𝗻𝗶𝗴𝗵𝘁 𝗠𝗮𝗴𝗶𝗰 🌙\n  🕛 12:00 AM | 📅 ${formattedDate}\n   💫 Sweet Dreams My Jaan 💫\n    🌌 Good Night My Love 🌌\n┗━━━✦❘༻🔮༺❘✦━━━┛` },
    { time: '12:30 AM', message: `╔═⫸🌠⫷═╗\n   💔 𝗗𝗮𝗿𝗱 𝗕𝗵𝗮𝗿𝗶 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n   📅 ${formattedDate}\n💔 "Kabhi kabhi dil karta hai sab bata du...\nPar phir yaad aata hai, kisi ko farq nahi padta…"\n╚═⫸🌠⫷═╝` },
    { time: '1:00 AM', message: `▛▀▀▀▀▀▀▀▀▀▀▀▀▜\n   🌌 𝗦𝘁𝗮𝗿𝗿𝘆 𝗡𝗶𝗴𝗵𝘁 🌌\n  🕐 1:00 AM | 📅 ${formattedDate}\n   🚩 Jai Shree Ram 🚩\n   🕉️ You're My Everything 🕉️\n▙▄▄▄▄▄▄▄▄▄▄▄▄▟` },
    { time: '1:30 AM', message: `✧˚ ༘ ⋆｡♡⋆｡ ༘˚✧\n   😔 𝗛𝗲𝗮𝗿𝘁𝗳𝗲𝗹𝘁 𝗦𝗵𝗮𝘆𝗿𝗶 😔\n   📆 ${formattedDate}\n😔 "Woh badal gaye, toh hum kya karte?\nWoh apne the hi kab?"\n✧˚ ༘ ⋆｡♡⋆｡ ༘˚✧` },
    { time: '2:00 AM', message: `┌─═══━┈•⊰∙✦∙⊱•┈━═══─┐\n   🌜 𝗟𝗮𝘁𝗲 𝗡𝗶𝗴𝗵𝘁 🌛\n  🕑 2:00 AM | 📅 ${formattedDate}\n   🦉 Still Awake My Night Owl? 🦉\n    💭 Thinking of You 💭\n└─═══━┈•⊰∙✦∙⊱•┈━═══─┘` },
    { time: '2:30 AM', message: `◥◣◥◣◥◣◥◣◥◣◥◣◥◣◥◣\n   🥀 𝗘𝗺𝗼𝘁𝗶𝗼𝗻𝗮𝗹 𝗦𝗵𝗮𝘆𝗿𝗶 🥀\n    🗓️ ${formattedDate}\n🥀 "Tere jaane ke baad dil ne ye sikha,\nKi pyaar karna galti nahi... par har kisi se karna galti hai."\n◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤` },
    { time: '3:00 AM', message: `╒═══════════╕\n   🌃 𝗗𝗿𝗲𝗮𝗺 𝗧𝗶𝗺𝗲 🌃\n  🕒 3:00 AM | 📅 ${formattedDate}\n   💤 May Sweet Dreams Embrace You 💤\n    😴 Sleep Peacefully My Love 😴\n╘═══════════╛` },
    { time: '3:30 AM', message: `█▀▀▀▀▀▀▀▀▀▀▀▀▀▀█\n   💧 𝗗𝗮𝗿𝗱 𝗦𝗵𝗮𝘆𝗿𝗶 💧\n    📅 ${formattedDate}\n💧 "Tere sath guzarhi huyi yaadein,\nAaj bhi muskura kar rulati hain."\n█▄▄▄▄▄▄▄▄▄▄▄▄▄▄█` },
    { time: '4:00 AM', message: `┏┅┉┅┉┅┉┅┉┅┉┅┓\n   🌠 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 𝗦𝘁𝗮𝗿𝘁 🌠\n  🕓 4:00 AM | 📅 ${formattedDate}\n   🌅 Subah Ho Rahi Hai 🌅\n    🌜 Rest Well My Love 🌜\n┗┅┉┅┉┅┉┅┉┅┉┅┛` },
    { time: '4:30 AM', message: `༶•┈┈┈┈┈┈┈ꕥ┈┈┈┈┈┈┈•༶\n   💔 𝗛𝗲𝗮𝗿𝘁𝗯𝗿𝗲𝗮𝗸 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n    📆 ${formattedDate}\n💔 "Tumhe bhoolna chahta hoon,\nPar tum khud ki nahi, meri aadat ho."\n༶•┈┈┈┈┈┈┈ꕥ┈┈┈┈┈┈┈•༶` },
    { time: '5:00 AM', message: `▁▂▃▄▅▆▇█▓▒░✨░▒▓█▇▆▅▄▃▂▁\n   🌸 𝗘𝗮𝗿𝗹𝘆 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 🌸\n  🕔 5:00 AM | 📅 ${formattedDate}\n   🌞 Uth Jaao Sweetu 🌞\n    🎯 New Day Begins 🎯\n▁▂▃▄▅▆▇█▓▒░✨░▒▓█▇▆▅▄▃▂▁` },
    { time: '5:30 AM', message: `꧁🦋══════✮══════🦋꧂\n   😞 𝗦𝗮𝗱 𝗦𝗵𝗮𝘆𝗿𝗶\n    ${formattedDate}\n😞 "Rishto ka toh pata nahi,\nPar dard sach me sath nibhata hai."\n꧁🦋══════✮══════🦋꧂` },
    { time: '6:00 AM', message: `╭┈──────────────┈╮\n   🌄 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 𝗕𝗹𝗲𝘀𝘀 🌄\n  🕕 6:00 AM | 📅 ${formattedDate}\n   🕊️ Assalamu Alaikum 🕊️\n    🙏 May Your Day Be Blessed 🙏\n╰┈──────────────┈╯` },
    { time: '6:30 AM', message: `✧ﾟ･:*:･ﾟ✧*:･ﾟ✧✧ﾟ･:*:･ﾟ✧\n   🥀 𝗧𝗼𝘂𝗰𝗵𝗶𝗻𝗴 𝗦𝗵𝗮𝘆𝗿𝗶 🥀\n    ${formattedDate}\n🥀 "Jo log sach me apne hote hain,\nWoh kabhi busy nahi hote."\n✧ﾟ･:*:･ﾟ✧*:･ﾟ✧✧ﾟ･:*:･ﾟ✧` },
    { time: '7:00 AM', message: `◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤\n   ☀️ 𝗚𝗼𝗼𝗱 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 ☀️\n  🕖 7:00 AM | 📅 ${formattedDate}\n   🌅 Rise and Shine Beautiful! 🌅\n    🎯 Time to Start Your Day 🎯\n◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤` },
    { time: '7:30 AM', message: `▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄\n   💔 𝗠𝗼𝗵𝗮𝗯𝗯𝗮𝘁 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n    ${formattedDate}\n💔 "Mohabbat adhuri hi achhi,\nPuri ho jaye toh kadr nahi rehti."\n▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄` },
    { time: '8:00 AM', message: `┌─∘◦▾◦∘─┐\n   🌼 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 𝗣𝗼𝘄𝗲𝗿 🌼\n  🕗 8:00 AM | 📅 ${formattedDate}\n   😎 Aaj Ka Din Tera Hai 😎\n    💪 Make Today Amazing! 💪\n└─∘◦▾◦∘─┘` },
    { time: '8:30 AM', message: `◐╬◑◐╬◑◐╬◑◐╬◑◐╬◑◐╬◑\n   😔 𝗘𝗺𝗼𝘁𝗶𝗼𝗻𝗮𝗹 𝗦𝗵𝗮𝘆𝗿𝗶\n    ${formattedDate}\n😔 "Aansoo tab nahi aate jab koi chala jata hai,\nAansoo tab aate hai jab pata chale, usse parwaah kabhi thi hi nahi."\n◐╬◑◐╬◑◐╬◑◐╬◑◐╬◑◐╬◑` },
    { time: '9:00 AM', message: `╔⋟ ¤ ┈┈┈┈⊰⊱┈┈┈┈ ¤ ⋞╗\n   🥞 𝗕𝗿𝗲𝗮𝗸𝗳𝗮𝘀𝘁 𝗧𝗶𝗺𝗲 🥞\n  🕘 9:00 AM | 📅 ${formattedDate}\n   🍽️ Nashta Kar Lo Ji 🍽️\n    🥗 Fuel Your Beautiful Body 🥗\n╚⋟ ¤ ┈┈┈┈⊰⊱┈┈┈┈ ¤ ⋞╝` },
    { time: '9:30 AM', message: `✦❃✦❃✦❃✦❃✦❃✦❃✦❃✦\n   💧 𝗧𝗼𝘂𝗰𝗵𝗶𝗻𝗴 𝗦𝗵𝗮𝘆𝗿𝗶 💧\n    ${formattedDate}\n💧 "Tumhara waqt hi theek nahi tha,\nWarna hum bura kab the?"\n✦❃✦❃✦❃✦❃✦❃✦❃✦❃✦` },
    { time: '10:00 AM', message: `▌│█║▌║▌║ 🎒 ║▌║▌║█│▌\n   🎒 𝗖𝗼𝗹𝗹𝗲𝗴𝗲 𝗧𝗶𝗺𝗲 🎒\n  🕙 10:00 AM | 📅 ${formattedDate}\n   😏 Class Mein Ja Raha Hai? 😏\n    💝 Remember I'm Always Here 💝\n▌│█║▌║▌║ 🎒 ║▌║▌║█│▌` },
    { time: '10:30 AM', message: `◖⫙◗◖⫙◗◖⫙◗◖⫙◗◖⫙◗◖⫙◗\n   🥀 𝗦𝗮𝗱 𝗦𝗵𝗮𝘆𝗿𝗶\n    ${formattedDate}\n🥀 "Hum khush rehna bhi chahte the,\nPar kisi ne udaas karne ki zimmedari le rakhi thi."\n◖⫙◗◖⫙◗◖⫙◗◖⫙◗◖⫙◗◖⫙◗` },
    { time: '11:00 AM', message: `◠◡◠ ◠◡◠ ◠◡◠ ◠◡◠\n   🤗 𝗠𝗶𝘀𝘀𝗶𝗻𝗴 𝗬𝗼𝘂 🤗\n  🕚 11:00 AM | 📅 ${formattedDate}\n   🫂 Yaad Aa Raha Hai Tera 🫂\n    💖 Sending Virtual Hugs! 💖\n◠◡◠ ◠◡◠ ◠◡◠ ◠◡◠` },
    { time: '11:30 AM', message: `∞☆∞☆∞☆∞☆∞☆∞☆∞☆∞\n   💔 𝗔𝗽𝗼𝗹𝗼𝗴𝘆 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n    ${formattedDate}\n💔 "Tum maaf kar dena,\nKabhi zyada pyaar kar liya tha."\n∞☆∞☆∞☆∞☆∞☆∞☆∞☆∞` },
    { time: '12:00 PM', message: `╭──────────╮\n   🥪 𝗟𝘂𝗻𝗰𝗵 𝗧𝗶𝗺𝗲 🥪\n  🕛 12:00 PM | 📅 ${formattedDate}\n   💧 Pani Pi Lo Bhook Lagi Hai 💧\n    🍽️ Good Afternoon Everyone! 🍽️\n╰──────────╯` },
    { time: '12:30 PM', message: `◈★◈★◈★◈★◈★◈★◈★◈★◈\n   😞 𝗪𝗮𝗿𝗻𝗶𝗻𝗴 𝗦𝗵𝗮𝘆𝗿𝗶 😞\n    ${formattedDate}\n😞 "Dil todne wale, ek baat yaad rakhna...\nJis din hum badal gaye, samhaal nahi paoge."\n◈★◈★◈★◈★◈★◈★◈★◈★◈` },
    { time: '1:00 PM', message: `▄︻デ═一 🌸 一═デ︻▄\n   🍛 𝗟𝘂𝗻𝗰𝗵 𝗕𝗿𝗲𝗮𝗸 🍛\n  🕐 1:00 PM | 📅 ${formattedDate}\n   🍽️ Khaana Kha Lo Yaar 🍽️\n    🥗 Eat Well My Love 🥗\n▄︻デ═一 🌸 一═デ︻▄` },
    { time: '1:30 PM', message: `❖◥▬▬▬◤❖◥▬▬▬◤❖◥▬▬▬◤❖\n   🥀 𝗠𝗼𝗵𝗮𝗯𝗯𝗮𝘁 𝗦𝗵𝗮𝘆𝗿𝗶 🥀\n    ${formattedDate}\n🥀 "Mohabbat chhodi nahi jaati,\nWo to bas dil se utar jaati hai."\n❖◥▬▬▬◤❖◥▬▬▬◤❖◥▬▬▬◤❖` },
    { time: '2:00 PM', message: `▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃\n   🙏 𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻 🙏\n  🕑 2:00 PM | 📅 ${formattedDate}\n   🚩 Jai Shree Ram 🚩\n    💫 Stay Blessed Always 💫\n▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃` },
    { time: '2:30 PM', message: `◉○◉○◉○◉○◉○◉○◉○◉○◉\n   💔 𝗕𝘂𝘀𝘆 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n    ${formattedDate}\n💔 "Humne toh pyaar karne me jaan laga di,\nWoh humse baat karne me busy ho gaye."\n◉○◉○◉○◉○◉○◉○◉○◉○◉` },
    { time: '3:00 PM', message: `◐▒◑◐▒◑◐▒◑◐▒◑◐▒◑◐▒◑\n   🫖 𝗕𝗿𝗲𝗮𝗸 𝗧𝗶𝗺𝗲 🫖\n  🕒 3:00 PM | 📅 ${formattedDate}\n   ☕ Chai Pi Lo Fresh Ho Jaao ☕\n    😌 You Deserve It! 😌\n◐▒◑◐▒◑◐▒◑◐▒◑◐▒◑◐▒◑` },
    { time: '3:30 PM', message: `◢█◣◢█◣◢█◣◢█◣◢█◣◢█◣\n   💧 𝗟𝗼𝗻𝗲𝗹𝘆 𝗦𝗵𝗮𝘆𝗿𝗶 💧\n    ${formattedDate}\n💧 "Kabhi kabhi lagta hai,\nShayad mai kisi ke liye bana hi nahi."\n◥█◤◥█◤◥█◤◥█◤◥█◤◥█◤` },
    { time: '4:00 PM', message: `╔═╦═╦═╦═╦═╦═╦═╗\n   🥵 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 𝗦𝘁𝗮𝗿𝘁 🥵\n  🕓 4:00 PM | 📅 ${formattedDate}\n   🌇 Sham Ho Rahi Hai 🌇\n    🌆 Evening Approaching 🌆\n╚═╩═╩═╩═╩═╩═╩═╝` },
    { time: '4:30 PM', message: `✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦\n   🥀 𝗧𝗿𝘂𝘁𝗵 𝗦𝗵𝗮𝘆𝗿𝗶 🥀\n    ${formattedDate}\n🥀 "Sach kehna mushkil nahi,\nSach sunna mushkil hota hai."\n✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦` },
    { time: '5:00 PM', message: `◖🌆◗◖🌆◗◖🌆◗◖🌆◗◖🌆◗\n   🌈 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 𝗦𝗺𝗶𝗹𝗲 🌈\n  🕔 5:00 PM | 📅 ${formattedDate}\n   😄 Muskuraate Raho 😄\n    ✨ Smile is Your Power ✨\n◖🌆◗◖🌆◗◖🌆◗◖🌆◗◖🌆◗` },
    { time: '5:30 PM', message: `▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚\n   💔 𝗖𝗵𝗮𝗻𝗴𝗲 𝗦𝗵𝗮𝘆𝗿𝗶 💔\n    ${formattedDate}\n💔 "Hum badal bhi jaye toh kya?\nTum to pehchante hi nahi ab."\n▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚▞▚` },
    { time: '6:00 PM', message: `┌─━━━━━─┐\n   🚩 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 𝗣𝗿𝗮𝘆𝗲𝗿 🚩\n  🕕 6:00 PM | 📅 ${formattedDate}\n   ✨ Har Har Mahadev ✨\n    🙏 Sanatan Dharma Forever 🙏\n└─━━━━━─┘` },
    { time: '6:30 PM', message: `◐❤️◑◐❤️◑◐❤️◑◐❤️◑◐❤️◑◐❤️◑\n   💧 𝗣𝗮𝗶𝗻𝗳𝘂𝗹 𝗦𝗵𝗮𝘆𝗿𝗶 💧\n    ${formattedDate}\n💧 "Kisi ne poocha kitna dard hai?\nMaine kaha bas itna, ki muskuraate hue bhi aansu aa jaye."\n◐❤️◑◐❤️◑◐❤️◑◐❤️◑◐❤️◑◐❤️◑` },
    { time: '7:00 PM', message: `╔════⊰❀⊱════╗\n   🌆 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 𝗣𝗿𝗼𝗺𝗶𝘀𝗲 🌆\n  🕖 7:00 PM | 📅 ${formattedDate}\n   💞 Hum Hamesha Saath Rahenge 💞\n    🤝 Always and Forever 🤝\n╚════⊰❀⊱════╝` },
    { time: '7:30 PM', message: `꧁✬✬✬✬✬✬✬✬✬꧂\n   😔 𝗙𝗶𝗻𝗮𝗹 𝗦𝗵𝗮𝘆𝗿𝗶 😔\n    ${formattedDate}\n😔 "Dil ki duniya ajeeb hai,\nJahan har koi paas hoke bhi door ho jata hai."\n꧁✬✬✬✬✬✬✬✬✬꧂` },
    { time: '8:00 PM', message: `╭─❁─◌─❁─╮\n   🍛 𝗗𝗶𝗻𝗻𝗲𝗿 𝗧𝗶𝗺𝗲 🍛\n  🕗 8:00 PM | 📅 ${formattedDate}\n   🥗 Healthy Khao Fit Raho 🥗\n    🍽️ Dinner Time Everyone! 🍽️\n╰─❁─◌─❁─╯` },
    { time: '8:30 PM', message: `▀█▀ ▀█▀ ▀█▀ ▀█▀ ▀█▀\n   🌙 𝗡𝗶𝗴𝗵𝘁 𝗦𝗵𝗮𝘆𝗿𝗶\n    ${formattedDate}\n🌙 "Zindagi ki har shaam muskurakar bitao,\nKyunki har pal tumhare liye khaas hai."\n▀█▀ ▀█▀ ▀█▀ ▀█▀ ▀█▀` },
    { time: '9:00 PM', message: `◐☾◑◐☾◑◐☾◑◐☾◑◐☾◑◐☾◑\n   🌃 𝗡𝗶𝗴𝗵𝘁 𝗧𝗮𝗹𝗸 🌃\n  🕘 9:00 PM | 📅 ${formattedDate}\n   🥰 Kaisa Raha Din? 🥰\n    💬 Hey My Cute Baby! 💬\n◐☾◑◐☾◑◐☾◑◐☾◑◐☾◑◐☾◑` },
    { time: '9:30 PM', message: `✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼\n   💫 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 𝗕𝗹𝗲𝘀𝘀𝗶𝗻𝗴 💫\n    ${formattedDate}\n💫 "Raat ki chandni tumhare liye,\nKhushiyon ki bauchar le kar aaye."\n✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼ ҉ ✼` },
    { time: '10:00 PM', message: `╔═══✦♡✦═══╗\n   ✨ 𝗟𝗮𝘁𝗲 𝗘𝘃𝗲𝗻𝗶𝗻𝗴 ✨\n  🕙 10:00 PM | 📅 ${formattedDate}\n   ☺️ Sweet Smile Always ☺️\n    😊 Keep Smiling Always! 😊\n╚═══✦♡✦═══╝` },
    { time: '10:30 PM', message: `◖🌟◗◖🌟◗◖🌟◗◖🌟◗◖🌟◗◖🌟◗\n   🌜 𝗡𝗶𝗴𝗵𝘁 𝗪𝗶𝘀𝗵𝗲𝘀 🌛\n    ${formattedDate}\n🌜 "Sote waqt khushiyon ke sapne dekho,\nSubah unhe poora karne ka irada rakho."\n◖🌟◗◖🌟◗◖🌟◗◖🌟◗◖🌟◗◖🌟◗` },
    { time: '11:00 PM', message: `╭─━━⊰✿⊱━━─╮\n   🌜 𝗡𝗶𝗴𝗵𝘁 𝗖𝗮𝗿𝗲 🌛\n  🕚 11:00 PM | 📅 ${formattedDate}\n   🛌 So Jaao Baby 🛌\n    🍽️ Dinner Done Baby? 🍽️\n╰─━━⊰✿⊱━━─╯` },
    { time: '11:30 PM', message: `✧*。✦˛*。✧*。✦˛*。✧\n   🌟 𝗙𝗶𝗻𝗮𝗹 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 🌟\n    ${formattedDate}\n🌟 "Aaj ka din khatam ho raha hai,\nKal naya din naye sapne le kar aayega."\n✧*。✦˛*。✧*。✦˛*。✧` }
];

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#FF6B6B")("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
    console.log(chalk.bold.hex("#4ECDC4")("┃      🚀 AUTOSENT ACTIVATED 🚀     ┃"));
    console.log(chalk.bold.hex("#FF6B6B")("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));
    console.log(chalk.bold.hex("#FFD93D")(`   📅 Date: ${formattedDate}`));
    console.log(chalk.bold.hex("#6BCF7F")("   ⭐ Ready to send amazing messages!"));
    console.log(chalk.bold.hex("#4D96FF")("   💫 Group mein sab bolege WOW!"));

    messages.forEach(({ time, message }) => {
        const [hour, minute, period] = time.split(/[: ]/);
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour !== '12') {
            hour24 += 12;
        } else if (period === 'AM' && hour === '12') {
            hour24 = 0;
        }

        const scheduledTime = moment.tz({ hour: hour24, minute: parseInt(minute, 10) }, 'Asia/Kolkata').toDate();

        schedule.scheduleJob(scheduledTime, () => {
            const mediaFolder = path.join(__dirname, 'autosend');
            const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            let files = [];
            
            if (fs.existsSync(mediaFolder)) {
                files = fs.readdirSync(mediaFolder).filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()));
            }

            let randomImage = null;
            if (files.length > 0) {
                const randomFile = files[Math.floor(Math.random() * files.length)];
                randomImage = fs.createReadStream(path.join(mediaFolder, randomFile));
            }

            global.data.allThreadID.forEach(threadID => {
                api.sendMessage({
                    body: message,
                    attachment: randomImage || undefined
                }, threadID, (error) => {
                    if (error) {
                        console.error(chalk.red(`   ❌ Failed to send to ${threadID}`));
                    } else {
                        console.log(chalk.green(`   ✅ Sent to ${threadID} at ${time}`));
                    }
                });
            });
        });
    });
};

module.exports.run = () => {};
