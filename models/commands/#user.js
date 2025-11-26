const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "15.1.0",
  hasPermssion: 2,
  credits: "ChatGPT Ultra Premium | Aryan System",
  description: "Premium Auto Ban System with DP + Emoji Card + Logs",
  commandCategory: "System",
  usages: "[ban/unban/banlist/whitelist/unwhitelist/logs] @tag",
  cooldowns: 0
};

// storage
global.data.userBanned = global.data.userBanned || new Map();
global.data.userWhitelist = global.data.userWhitelist || new Map();
global.data.userLogs = global.data.userLogs || [];

// admins
const admins = ["10001234567890","61550703367376"]; // change to your UID
const badWords = ["bsdk","madarchod","bahanchod","gandu","chutiya","lund","bitch","randi","bhosdike","madrchod","motherfucker","gaand"];

// MAIN RUN
module.exports.run = async function({ api, event, args }) {
  const { threadID, mentions } = event;
  const cmd = args[0];
  const id = Object.keys(mentions || {})[0];

  if(cmd === "ban") {
    if(!id) return api.sendMessage("⚠ Tag someone to ban.", threadID);
    if(admins.includes(id)) return api.sendMessage("⚠ Cannot ban admin!", threadID);
    global.data.userBanned.set(id, Date.now());
    const imgBuffer = await createUserCard(id, api, "🚫 BANNED ❌", "#ff1744");
    const filePath = path.join(__dirname, `ban_${Date.now()}.png`);
    fs.writeFileSync(filePath,imgBuffer);
    addLog("BAN", id);
    return api.sendMessage({body:`🚫 User Banned!`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  if(cmd === "unban") {
    if(!id) return api.sendMessage("⚠ Tag someone to unban.", threadID);
    global.data.userBanned.delete(id);
    const imgBuffer = await createUserCard(id, api, "🟢 UNBANNED ✅", "#00e676");
    const filePath = path.join(__dirname, `unban_${Date.now()}.png`);
    fs.writeFileSync(filePath,imgBuffer);
    addLog("UNBAN", id);
    return api.sendMessage({body:`🟢 User Unbanned!`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  if(cmd === "banlist") {
    const list = Array.from(global.data.userBanned.entries());
    if(list.length===0) return api.sendMessage("✨ No banned users.", threadID);
    const imgBuffer = await createBanlistImage(list, api);
    const filePath = path.join(__dirname, `banlist_${Date.now()}.png`);
    fs.writeFileSync(filePath,imgBuffer);
    return api.sendMessage({body:`🚫 Banlist (${list.length})`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }

  if(cmd === "whitelist") {
    if(!id) return api.sendMessage("⚠ Tag someone.", threadID);
    global.data.userWhitelist.set(id,true);
    return api.sendMessage(`⭐ User ${id} added to Whitelist`, threadID);
  }

  if(cmd === "unwhitelist") {
    if(!id) return api.sendMessage("⚠ Tag someone.", threadID);
    global.data.userWhitelist.delete(id);
    return api.sendMessage(`🗑 User ${id} removed from Whitelist`, threadID);
  }

  if(cmd === "logs") {
    return api.sendMessage(createLogText(), threadID);
  }

  api.sendMessage("Commands: ban, unban, banlist, whitelist, unwhitelist, logs", threadID);
};

// AUTO-BAN EVENT
module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;
  if(!body || admins.includes(senderID) || global.data.userWhitelist.has(senderID)) return;

  const lower = body.toLowerCase();
  if(badWords.some(w => lower.includes(w))){
    global.data.userBanned.set(senderID, Date.now());
    const imgBuffer = await createUserCard(senderID, api, "⚠ AUTO-BANNED 🚨", "#ff3d00");
    const filePath = path.join(__dirname, `autoban_${Date.now()}.png`);
    fs.writeFileSync(filePath,imgBuffer);
    addLog("AUTO-BAN", senderID);
    return api.sendMessage({body:`⚠ Auto Ban Triggered!`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
  }
};

// CREATE USER CARD
async function createUserCard(id, api, title, color){
  let buffer=null;
  try{ buffer=(await axios.get(`https://graph.facebook.com/${id}/picture?height=600&width=600`,{responseType:"arraybuffer"})).data; }catch(e){}
  let name="Unknown";
  try{ const info = await api.getUserInfo(id); name=info[id]?.name||name; }catch(e){}
  const canvas = createCanvas(900,500);
  const ctx = canvas.getContext("2d");
  // bg gradient
  const grad = ctx.createLinearGradient(0,0,900,0);
  grad.addColorStop(0,color); grad.addColorStop(1,"#000");
  ctx.fillStyle=grad; ctx.fillRect(0,0,900,500);
  ctx.shadowColor="#fff"; ctx.shadowBlur=25;
  // DP
  if(buffer){
    const img = await loadImage(buffer);
    ctx.save(); ctx.beginPath(); ctx.arc(450,200,140,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img,310,60,280,280); ctx.restore();
  }else{
    ctx.fillStyle="#888"; ctx.beginPath(); ctx.arc(450,200,140,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle="#fff"; ctx.font="bold 48px Sans"; ctx.fillText(title,180,380);
  ctx.font="bold 36px Sans"; ctx.fillText(name,300,440);
  ctx.font="24px Sans"; ctx.fillText(`UID: ${id}`,360,470);
  return canvas.toBuffer("image/png");
}

// BANLIST IMAGE
async function createBanlistImage(list, api){
  const width=900,rowHeight=120,height=list.length*rowHeight+120;
  const canvas=createCanvas(width,height); const ctx=canvas.getContext("2d");
  ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,width,height);
  ctx.fillStyle="#fff"; ctx.font="bold 45px Sans"; ctx.fillText("🚫 BAN LIST",320,70);
  let y=140;
  for(const [uid,time] of list){
    const remain=86400000-(Date.now()-time);
    const hrs=Math.floor(remain/3600000); const mins=Math.floor((remain%3600000)/60000);
    let buffer=null;
    try{ buffer=(await axios.get(`https://graph.facebook.com/${uid}/picture?height=200&width=200`,{responseType:"arraybuffer"})).data; }catch(e){}
    if(buffer){ const img=await loadImage(buffer); ctx.save(); ctx.beginPath(); ctx.arc(80,y-20,50,0,Math.PI*2); ctx.clip(); ctx.drawImage(img,30,y-70,100,100); ctx.restore();}
    let name="Unknown"; try{ name=(await api.getUserInfo(uid))[uid].name; }catch(e){}
    ctx.fillStyle="#fff"; ctx.font="bold 30px Sans"; ctx.fillText(name,160,y);
    ctx.font="20px Sans"; ctx.fillText(`UID: ${uid}`,160,y+30); ctx.fillText(`⏳ Left: ${hrs}h ${mins}m`,160,y+60);
    y+=rowHeight;
  }
  return canvas.toBuffer("image/png");
}

// LOGS
function addLog(type,id){
  global.data.userLogs.unshift({type,id,time:new Date().toLocaleString("en-GB",{timeZone:"Asia/Kolkata"})});
  if(global.data.userLogs.length>10) global.data.userLogs.pop();
}

function createLogText(){
  if(global.data.userLogs.length===0) return "📜 No recent actions.";
  let text="📜 Recent Actions:\n";
  global.data.userLogs.forEach(log=>{ text+=`• [${log.type}] UID: ${log.id} at ${log.time}\n`; });
  return text;
}
