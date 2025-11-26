const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const PDFDocument = require("pdfkit"); // npm i pdfkit

module.exports.config = {
  name: "user",
  version: "15.0.0",
  hasPermssion: 2,
  credits: "ChatGPT Ultra Premium | Aryan System",
  description: "💎 Animated Neon Emoji Card + Countdown + Banlist PDF Export",
  commandCategory: "System",
  usages: "[ban/unban/banlist/whitelist/unwhitelist/logs/pdf] @tag",
  cooldowns: 0
};

// Storage
global.data.userBanned = global.data.userBanned || new Map();
global.data.userWhitelist = global.data.userWhitelist || new Map();
global.data.userLogs = global.data.userLogs || [];

// Bad words
const badWords = ["bsdk","madarchod","bahanchod","gandu","chutiya","lund","bitch","randi","bhosdike","madrchod","motherfucker","gaand"];

// Admins
const admins = ["10001234567890","61550703367376"]; // change to your UID

// MAIN RUN
module.exports.run = async function({ api, event, args }) {
  const { threadID, mentions } = event;
  const cmd = args[0];
  const id = Object.keys(mentions || {})[0];

  switch(cmd){
    case "ban":
      if(!id) return api.sendMessage("⚠ Tag someone to ban.", threadID);
      if(admins.includes(id)) return api.sendMessage("⚠ Cannot ban admin!", threadID);
      global.data.userBanned.set(id, Date.now());
      const banImg = await createAnimatedCard(id, api, "🚫 BANNED ❌", "#ff1744","💀");
      const banFile = path.join(__dirname, `ban_${Date.now()}.png`);
      fs.writeFileSync(banFile, banImg);
      addLog("BAN", id);
      return api.sendMessage({body:`🚫 User Banned!\n⏳ 24H Duration`,attachment:fs.createReadStream(banFile)}, threadID, ()=>fs.unlinkSync(banFile));

    case "unban":
      if(!id) return api.sendMessage("⚠ Tag someone to unban.", threadID);
      global.data.userBanned.delete(id);
      const unbanImg = await createAnimatedCard(id, api, "🟢 UNBANNED ✅", "#00e676","✨");
      const unbanFile = path.join(__dirname, `unban_${Date.now()}.png`);
      fs.writeFileSync(unbanFile, unbanImg);
      addLog("UNBAN", id);
      return api.sendMessage({body:`🟢 User Unbanned!`,attachment:fs.createReadStream(unbanFile)}, threadID, ()=>fs.unlinkSync(unbanFile));

    case "banlist":
      const list = Array.from(global.data.userBanned.entries());
      if(list.length===0) return api.sendMessage("✨ No banned users.", threadID);
      const blImg = await createBanListImage(list, api);
      const blFile = path.join(__dirname, `banlist_${Date.now()}.png`);
      fs.writeFileSync(blFile, blImg);
      return api.sendMessage({body:`🚫 Banlist (${list.length})`,attachment:fs.createReadStream(blFile)}, threadID, ()=>fs.unlinkSync(blFile));

    case "pdf":
      return await createBanlistPDF(api, threadID);

    case "whitelist":
      if(!id) return api.sendMessage("⚠ Tag someone.", threadID);
      global.data.userWhitelist.set(id,true);
      return api.sendMessage(`⭐ User ${id} added to Whitelist`, threadID);

    case "unwhitelist":
      if(!id) return api.sendMessage("⚠ Tag someone.", threadID);
      global.data.userWhitelist.delete(id);
      return api.sendMessage(`🗑 User ${id} removed from Whitelist`, threadID);

    case "logs":
      return api.sendMessage(createLogText(), threadID);

    default:
      return api.sendMessage("Commands: ban, unban, banlist, whitelist, unwhitelist, logs, pdf", threadID);
  }
};

// Auto-ban detector
module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, body } = event;
  if(admins.includes(senderID)) return;
  if(global.data.userWhitelist.has(senderID)) return;
  if(!body) return;

  const lower = body.toLowerCase();
  if(badWords.some(w=>lower.includes(w))){
    global.data.userBanned.set(senderID, Date.now());
    const img = await createAnimatedCard(senderID, api, "⚠ AUTO BANNED 🚨", "#ff3d00","💥");
    const file = path.join(__dirname, `autoban_${Date.now()}.png`);
    fs.writeFileSync(file, img);
    addLog("AUTO-BAN", senderID);
    return api.sendMessage({body:`⚠ Auto Ban Triggered! 24H`,attachment:fs.createReadStream(file)}, threadID, ()=>fs.unlinkSync(file));
  }
};

// Animated Emoji Card + Countdown Timer
async function createAnimatedCard(id, api, title, color, emoji){
  let buffer=null;
  try{ buffer=(await axios.get(`https://graph.facebook.com/${id}/picture?height=600&width=600`,{responseType:"arraybuffer"})).data; }catch(e){}
  const info = await api.getUserInfo(id);
  const name = info[id]?.name||"Unknown";

  const canvas = createCanvas(900,500);
  const ctx = canvas.getContext("2d");

  // Background neon gradient
  const grad = ctx.createLinearGradient(0,0,900,0);
  grad.addColorStop(0,color);
  grad.addColorStop(1,"#000");
  ctx.fillStyle = grad; ctx.fillRect(0,0,900,500);

  // Shadow & glow
  ctx.shadowColor = "#fff"; ctx.shadowBlur = 25;

  // DP Circle
  if(buffer){
    const img = await loadImage(buffer);
    ctx.save(); ctx.beginPath(); ctx.arc(450,200,140,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img,310,60,280,280); ctx.restore();
  }

  // Countdown Timer Overlay (24h)
  const start = global.data.userBanned.get(id) || Date.now();
  const remain = 24*60*60*1000 - (Date.now()-start);
  const hrs = Math.floor(remain/3600000);
  const mins = Math.floor((remain%3600000)/60000);
  ctx.fillStyle="#fff"; ctx.font="28px Sans";
  ctx.fillText(`⏳ ${hrs}h ${mins}m left`,330,540);

  // Title + Emoji
  ctx.fillStyle="#fff"; ctx.font="bold 48px Sans"; ctx.fillText(title,180,380);
  ctx.font="bold 36px Sans"; ctx.fillText(`${emoji} ${name} ${emoji}`,250,440);
  ctx.font="24px Sans"; ctx.fillText(`UID: ${id}`,360,470);

  return canvas.toBuffer("image/png");
}

// Banlist Image
async function createBanListImage(list, api){
  const width=900,rowHeight=120,height=list.length*rowHeight+120;
  const canvas=createCanvas(width,height); const ctx=canvas.getContext("2d");
  ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,width,height);
  ctx.fillStyle="#fff"; ctx.font="bold 45px Sans"; ctx.fillText("🚫 BAN LIST",320,70);
  let y=140;
  for(const [uid,time] of list){
    const remain=86400000-(Date.now()-time);
    const hrs=Math.floor(remain/3600000);
    const mins=Math.floor((remain%3600000)/60000);
    let buffer=null;
    try{ buffer=(await axios.get(`https://graph.facebook.com/${uid}/picture?height=200&width=200`,{responseType:"arraybuffer"})).data; }catch(e){}
    if(buffer){ const img=await loadImage(buffer); ctx.save(); ctx.beginPath(); ctx.arc(80,y-20,50,0,Math.PI*2); ctx.clip(); ctx.drawImage(img,30,y-70,100,100); ctx.restore();}
    let name="Unknown"; try{ name=(await api.getUserInfo(uid))[uid].name; }catch(e){}
    ctx.fillStyle="#fff"; ctx.font="bold 30px Sans"; ctx.fillText(name,160,y);
    ctx.font="20px Sans"; ctx.fillText(`UID: ${uid}`,160,y+30);
    ctx.fillText(`⏳ Left: ${hrs}h ${mins}m`,160,y+60);
    y+=rowHeight;
  }
  return canvas.toBuffer("image/png");
}

// Banlist PDF Export
async function createBanlistPDF(api, threadID){
  const list=Array.from(global.data.userBanned.entries());
  if(list.length===0) return api.sendMessage("✨ No banned users.", threadID);
  const doc = new PDFDocument({margin:30, size:"A4"});
  const filePath = path.join(__dirname, `banlist_${Date.now()}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(28).text("🚫 BAN LIST", {align:"center"});
  doc.moveDown();
  for(const [uid,time] of list){
    const remain=86400000-(Date.now()-time);
    const hrs=Math.floor(remain/3600000);
    const mins=Math.floor((remain%3600000)/60000);
    let name="Unknown"; try{name=(await api.getUserInfo(uid))[uid].name;}catch(e){}
    doc.fontSize(20).text(`• ${name} (UID: ${uid}) ⏳ Left: ${hrs}h ${mins}m`);
  }
  doc.end();
  return api.sendMessage({body:`🚀 Banlist PDF`,attachment:fs.createReadStream(filePath)}, threadID, ()=>fs.unlinkSync(filePath));
}

// Action log
function addLog(type,id){
  global.data.userLogs.unshift({type,id,time:new Date().toLocaleString("en-GB",{timeZone:"Asia/Kolkata"})});
  if(global.data.userLogs.length>10) global.data.userLogs.pop();
}

function createLogText(){
  if(global.data.userLogs.length===0) return "📜 No recent actions.";
  let text="📜 Recent Actions:\n";
  global.data.userLogs.forEach(log=>{
    text+=`• [${log.type}] UID: ${log.id} at ${log.time}\n`;
  });
  return text;
}
