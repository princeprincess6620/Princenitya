const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "11.0.0",
  hasPermssion: 2,
  credits: "ChatGPT Ultra | Aryan System",
  description: "Auto Ban System with DP Ban Screenshot + Banlist Screenshot + Auto Unban",
  commandCategory: "System",
  usages: "[ban/unban/banlist/whitelist/unwhitelist] @tag",
  cooldowns: 0
};

// STORAGE
global.data.userBanned = global.data.userBanned || new Map();
global.data.userWhitelist = global.data.userWhitelist || new Map();

// BAD WORDS LIST
const badWords = ["bsdk","madarchod","bahanchod","gandu","chutiya","lund","bitch","randi","bhosdike","madrchod","motherfucker","gaand"];

// MAIN EXECUTION
module.exports.run = async function({ api, event, args }) {
  const { threadID, mentions } = event;
  const cmd = args[0];
  const id = Object.keys(mentions || {})[0];
  if(!id && cmd !== "banlist") return api.sendMessage("⚠ Tag someone.", threadID);

  // BAN COMMAND
  if(cmd === "ban") {
    global.data.userBanned.set(id, Date.now());
    const buffer = await createBanImage(id, api);
    const filePath = path.join(__dirname, `ban_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);
    return api.sendMessage({body:`🚫 User Banned!\n⏳ Duration: 24H`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  // UNBAN COMMAND
  if(cmd === "unban") {
    global.data.userBanned.delete(id);
    const buffer = await createUnbanImage(id, api);
    const filePath = path.join(__dirname, `unban_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);
    return api.sendMessage({body:`🟢 User Unbanned!`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  // BANLIST COMMAND
  if(cmd === "banlist") {
    const list = Array.from(global.data.userBanned.entries());
    if(list.length === 0) return api.sendMessage("✨ No banned users.", threadID);
    const buffer = await createBanListImage(list, api);
    const filePath = path.join(__dirname, `banlist_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);
    return api.sendMessage({body:`🚫 Banlist (${list.length})`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  // WHITELIST COMMAND
  if(cmd === "whitelist") {
    global.data.userWhitelist.set(id,true);
    return api.sendMessage(`⭐ User ${id} added to Whitelist`, threadID);
  }

  // UNWHITELIST COMMAND
  if(cmd === "unwhitelist") {
    global.data.userWhitelist.delete(id);
    return api.sendMessage(`🗑 User ${id} removed from Whitelist`, threadID);
  }

  api.sendMessage("Commands: ban, unban, banlist, whitelist, unwhitelist", threadID);
};

// AUTO BAN DETECTOR
module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;
  const admins = ["61581359639498","61581359639498"];
  if(admins.includes(senderID)) return; // skip admins

  if(global.data.userWhitelist.has(senderID)) return; // skip whitelist

  if(!body) return;

  const lower = body.toLowerCase();
  if(badWords.some(x=>lower.includes(x))) {
    global.data.userBanned.set(senderID, Date.now());
    const buffer = await createBanImage(senderID, api);
    const filePath = path.join(__dirname, `autoban_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);
    return api.sendMessage({body:`⚠ Auto Ban Triggered!\n🚫 Duration: 24H`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }
};

// CREATE BAN IMAGE
async function createBanImage(id, api){
  const dpUrl = `https://graph.facebook.com/${id}/picture?height=600&width=600`;
  let buffer = null;
  try{ buffer = (await axios.get(dpUrl,{responseType:"arraybuffer"})).data; } catch(e){}
  const info = await api.getUserInfo(id);
  const name = info[id]?.name || "Unknown";

  const canvas = createCanvas(900,500);
  const ctx = canvas.getContext("2d");
  if(buffer){
    const img = await loadImage(buffer);
    ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,900,500);
    ctx.save(); ctx.beginPath(); ctx.arc(450,200,140,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img,310,60,280,280); ctx.restore();
  }

  ctx.fillStyle="#fff"; ctx.font="bold 45px Sans"; ctx.fillText("🚫 BANNED USER 🚫",240,380);
  ctx.font="bold 32px Sans"; ctx.fillText(name,330,430);
  ctx.font="24px Sans"; ctx.fillText(`UID: ${id}`,360,470);
  return canvas.toBuffer("image/png");
}

// CREATE UNBAN IMAGE
async function createUnbanImage(id, api){
  const dpUrl = `https://graph.facebook.com/${id}/picture?height=600&width=600`;
  let buffer = null;
  try{ buffer = (await axios.get(dpUrl,{responseType:"arraybuffer"})).data; } catch(e){}
  const info = await api.getUserInfo(id);
  const name = info[id]?.name || "Unknown";

  const canvas = createCanvas(900,500);
  const ctx = canvas.getContext("2d");
  if(buffer){
    const img = await loadImage(buffer);
    ctx.fillStyle="#065f46"; ctx.fillRect(0,0,900,500);
    ctx.save(); ctx.beginPath(); ctx.arc(450,200,140,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img,310,60,280,280); ctx.restore();
  }

  ctx.fillStyle="#fff"; ctx.font="bold 45px Sans"; ctx.fillText("🟢 UNBANNED",300,380);
  ctx.font="bold 32px Sans"; ctx.fillText(name,350,430);
  ctx.font="24px Sans"; ctx.fillText(`UID: ${id}`,380,470);
  return canvas.toBuffer("image/png");
}

// CREATE BANLIST IMAGE
async function createBanListImage(list, api){
  const width=900,rowHeight=120,height=list.length*rowHeight+120;
  const canvas = createCanvas(width,height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,width,height);
  ctx.fillStyle="#fff"; ctx.font="bold 45px Sans"; ctx.fillText("🚫 BAN LIST",320,70);
  let y=140;
  for(const [uid,time] of list){
    const remain=86400000-(Date.now()-time);
    const hrs=Math.floor(remain/3600000);
    const mins=Math.floor((remain%3600000)/60000);
    let buffer=null;
    try{ buffer=(await axios.get(`https://graph.facebook.com/${uid}/picture?height=200&width=200`,{responseType:"arraybuffer"})).data; } catch(e){}
    if(buffer){
      const img = await loadImage(buffer);
      ctx.save(); ctx.beginPath(); ctx.arc(80,y-20,50,0,Math.PI*2); ctx.clip();
      ctx.drawImage(img,30,y-70,100,100); ctx.restore();
    }

    let name="Unknown";
    try{ name = (await api.getUserInfo(uid))[uid].name; } catch(e){}

    ctx.fillStyle="#fff"; ctx.font="bold 30px Sans"; ctx.fillText(name,160,y);
    ctx.font="20px Sans"; ctx.fillText(`UID: ${uid}`,160,y+30);
    ctx.fillText(`⏳ Left: ${hrs}h ${mins}m`,160,y+60);
    y+=rowHeight;
  }
  return canvas.toBuffer("image/png");
}
