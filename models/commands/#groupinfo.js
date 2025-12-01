const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

module.exports.config = {
  name: "groupinfo",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ARYAN | Premium Edition",
  description: "📊 Get detailed group information with aesthetic card",
  commandCategory: "group",
  usages: "[groupinfo] or [groupinfo groupID]",
  cooldowns: 5,
  dependencies: {
    "canvas": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  try {
    // If group ID is provided directly
    if (args[0]) {
      const groupID = args[0];
      try {
        const info = await api.getThreadInfo(groupID);
        if (!info.isGroup) {
          return api.sendMessage("❌ This is not a group ID!", event.threadID, event.messageID);
        }
        return await generateGroupCard(api, event, { threadID: groupID, name: info.name || "Unknown Group" }, info);
      } catch (error) {
        return api.sendMessage("❌ Invalid group ID or bot not in that group!", event.threadID, event.messageID);
      }
    }

    // Interactive menu for group selection
    const threads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = threads.filter(t => t.isGroup);

    if (groupThreads.length === 0) {
      return api.sendMessage("🤖 Bot is not in any groups!", event.threadID, event.messageID);
    }

    // Current group info
    const currentGroup = groupThreads.find(g => g.threadID === event.threadID);
    let msg = `╭─────────────────────────────────╮\n`;
    msg += `│         📋 GROUP INFO MENU         │\n`;
    msg += `├─────────────────────────────────┤\n`;
    
    if (currentGroup) {
      msg += `│ 🏠 Current Group:                │\n`;
      msg += `│   ${currentGroup.name.substring(0, 25).padEnd(25)} │\n`;
      msg += `│   👉 Type: groupinfo current     │\n`;
      msg += `├─────────────────────────────────┤\n`;
    }
    
    msg += `│ 📊 Available Groups: ${groupThreads.length.toString().padStart(2)}         │\n`;
    msg += `╰─────────────────────────────────╯\n\n`;

    // Display groups in columns
    const groupsPerColumn = 8;
    const columns = Math.ceil(groupThreads.length / groupsPerColumn);
    
    for (let col = 0; col < columns; col++) {
      for (let i = 0; i < groupsPerColumn; i++) {
        const index = col * groupsPerColumn + i;
        if (index >= groupThreads.length) break;
        
        const group = groupThreads[index];
        const num = (index + 1).toString().padStart(2, '0');
        const displayName = group.name.length > 15 ? 
          group.name.substring(0, 12) + '...' : group.name.padEnd(15);
        
        msg += `【${num}】 ${displayName} ${col < columns - 1 ? '  ' : '\n'}`;
      }
    }

    msg += `\n╭─────────────────────────────────╮\n`;
    msg += `│ 🔢 Reply 1-${groupThreads.length} for group info │\n`;
    msg += `│ 📝 Or type: groupinfo [ID]       │\n`;
    msg += `│ 🏠 Or type: groupinfo current    │\n`;
    msg += `╰─────────────────────────────────╯`;

    return api.sendMessage(msg, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          groupThreads,
          author: event.senderID,
          timestamp: Date.now()
        });
        // Auto remove after 2 minutes
        setTimeout(() => {
          const index = global.client.handleReply.findIndex(r => r.messageID === info.messageID);
          if (index !== -1) global.client.handleReply.splice(index, 1);
        }, 120000);
      }
    });

  } catch (error) {
    console.error("GroupInfo Error:", error);
    return api.sendMessage("❌ An error occurred while fetching group information!", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  // Check if reply is valid
  if (handleReply.author !== event.senderID) {
    return api.sendMessage("⏳ This menu has expired or is not for you!", event.threadID, event.messageID);
  }

  // Check timeout (2 minutes)
  if (Date.now() - handleReply.timestamp > 120000) {
    return api.sendMessage("⏰ Menu expired! Please use the command again.", event.threadID, event.messageID);
  }

  const input = event.body.trim().toLowerCase();
  
  // Handle "current" command
  if (input === "current") {
    const currentGroup = handleReply.groupThreads.find(g => g.threadID === event.threadID);
    if (!currentGroup) {
      return api.sendMessage("❌ This command only works in groups!", event.threadID, event.messageID);
    }
    const info = await api.getThreadInfo(currentGroup.threadID);
    return await generateGroupCard(api, event, currentGroup, info);
  }

  // Handle numeric selection
  if (!isNaN(input)) {
    const choice = parseInt(input);
    if (choice < 1 || choice > handleReply.groupThreads.length) {
      return api.sendMessage(`❌ Please select between 1-${handleReply.groupThreads.length}`, event.threadID, event.messageID);
    }

    const selected = handleReply.groupThreads[choice - 1];
    try {
      const info = await api.getThreadInfo(selected.threadID);
      return await generateGroupCard(api, event, selected, info);
    } catch (error) {
      return api.sendMessage("❌ Error fetching group information!", event.threadID, event.messageID);
    }
  }

  return api.sendMessage("❌ Invalid input! Please select a number or type 'current'", event.threadID, event.messageID);
};

async function generateGroupCard(api, event, group, threadInfo) {
  try {
    // Send processing message
    await api.sendMessage("🔄 Generating group information card...", event.threadID);

    const participants = threadInfo.participantIDs.length;
    const admins = threadInfo.adminIDs || [];
    const adminNames = [];
    
    // Get admin details
    if (admins.length > 0) {
      try {
        const adminIds = admins.map(a => a.id);
        const users = await api.getUserInfo(adminIds);
        for (const id of adminIds) {
          if (users[id]) adminNames.push(users[id].name);
        }
      } catch (e) {
        console.log("Error fetching admin names:", e);
      }
    }

    // Create canvas
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative elements
    drawGeometricPattern(ctx);
    
    // Main header
    ctx.shadowColor = '#00b4d8';
    ctx.shadowBlur = 25;
    ctx.font = 'bold 65px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('GROUP INFORMATION', 600, 90);
    ctx.shadowBlur = 0;

    // Group name with gradient
    ctx.font = 'bold 55px "Segoe UI", Arial, sans-serif';
    const nameGradient = ctx.createLinearGradient(200, 140, 1000, 140);
    nameGradient.addColorStop(0, '#00b4d8');
    nameGradient.addColorStop(0.5, '#90e0ef');
    nameGradient.addColorStop(1, '#caf0f8');
    ctx.fillStyle = nameGradient;
    ctx.fillText(group.name.toUpperCase(), 600, 170);

    // Main info container
    drawRoundedRect(ctx, 50, 220, 1100, 500, 25);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Group ID
    drawInfoBox(ctx, '🔹 GROUP ID', group.threadID, 260, 280);
    
    // Members count with progress bar
    drawInfoBox(ctx, '👥 TOTAL MEMBERS', participants.toString(), 260, 360);
    drawProgressBar(ctx, participants, 260, 400, 700, 20);
    
    // Admin count
    drawInfoBox(ctx, '👑 TOTAL ADMINS', adminNames.length.toString(), 260, 440);
    
    // Creation date if available
    if (threadInfo.threadMetadata?.createdAt) {
      const created = new Date(threadInfo.threadMetadata.createdAt * 1000);
      const formattedDate = `${created.getDate().toString().padStart(2, '0')}/${(created.getMonth()+1).toString().padStart(2, '0')}/${created.getFullYear()}`;
      drawInfoBox(ctx, '📅 CREATED ON', formattedDate, 260, 520);
      
      // Calculate group age
      const ageInDays = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
      drawInfoBox(ctx, '⏳ GROUP AGE', `${ageInDays} days`, 260, 580);
    }

    // Admins list on right side
    ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#00b4d8';
    ctx.textAlign = 'left';
    ctx.fillText('ADMINISTRATORS', 800, 280);
    
    ctx.font = '28px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    const maxDisplay = 7;
    adminNames.slice(0, maxDisplay).forEach((admin, i) => {
      const yPos = 330 + (i * 40);
      ctx.fillText(`• ${admin.substring(0, 25)}`, 800, yPos);
    });
    
    if (adminNames.length > maxDisplay) {
      ctx.fillText(`+${adminNames.length - maxDisplay} more...`, 800, 330 + (maxDisplay * 40));
    }

    // Watermark and footer
    ctx.font = '22px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, 600, 760);
    ctx.textAlign = 'right';
    ctx.fillText('Made with ARYAN BOT', 1150, 780);

    // Save image
    const fileName = `groupinfo_${group.threadID}_${Date.now()}.png`;
    const filePath = path.join(__dirname, fileName);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    // Prepare statistics
    const maleCount = await getGenderCount(api, threadInfo.participantIDs);
    const femaleCount = participants - maleCount;
    
    // Send result
    const messageBody = `✅ **Group Information Generated**\n\n` +
                       `📛 **Name:** ${group.name}\n` +
                       `🆔 **ID:** ${group.threadID}\n` +
                       `👥 **Members:** ${participants}\n` +
                       `👑 **Admins:** ${adminNames.length}\n` +
                       `👨 **Male:** ${maleCount || 'N/A'}\n` +
                       `👩 **Female:** ${femaleCount || 'N/A'}\n` +
                       `📊 **Activity:** ${getActivityLevel(participants)}\n\n` +
                       `⏰ *This card will auto-delete in 2 minutes*`;

    await api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    // Cleanup after 2 minutes
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }, 120000);

  } catch (error) {
    console.error("Card Generation Error:", error);
    api.sendMessage("❌ Error generating group card. Please try again!", event.threadID, event.messageID);
  }
}

// Helper Functions
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawInfoBox(ctx, label, value, x, y) {
  ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#90e0ef';
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);
  
  ctx.font = '30px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(value, x + 350, y);
}

function drawProgressBar(ctx, value, x, y, width, height) {
  // Background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x, y, width, height);
  
  // Calculate fill percentage (max 500 members for visualization)
  const percentage = Math.min(value / 500, 1);
  const fillWidth = width * percentage;
  
  // Fill with gradient
  const barGradient = ctx.createLinearGradient(x, y, x + fillWidth, y);
  barGradient.addColorStop(0, '#00b4d8');
  barGradient.addColorStop(1, '#0077b6');
  ctx.fillStyle = barGradient;
  ctx.fillRect(x, y, fillWidth, height);
  
  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  
  // Text
  ctx.font = '20px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${value} members`, x + width / 2, y + height / 1.7);
}

function drawGeometricPattern(ctx) {
  ctx.strokeStyle = 'rgba(0, 180, 216, 0.05)';
  ctx.lineWidth = 1;
  
  // Hexagon pattern
  const hexSize = 50;
  for (let x = -hexSize; x < 1300; x += hexSize * 1.5) {
    for (let y = -hexSize; y < 850; y += hexSize * Math.sqrt(3)) {
      drawHexagon(ctx, x + (y % (hexSize * Math.sqrt(3) * 2) ? hexSize * 0.75 : 0), y, hexSize);
    }
  }
}

function drawHexagon(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

async function getGenderCount(api, participantIDs) {
  try {
    // Sample users to check gender (first 20 for performance)
    const sampleIds = participantIDs.slice(0, Math.min(20, participantIDs.length));
    const users = await api.getUserInfo(sampleIds);
    
    let maleCount = 0;
    for (const id in users) {
      // This is a simplified check - actual gender detection would need more logic
      if (users[id].gender === 'MALE') maleCount++;
    }
    
    // Extrapolate for whole group
    return Math.floor((maleCount / sampleIds.length) * participantIDs.length);
  } catch (error) {
    return null;
  }
}

function getActivityLevel(memberCount) {
  if (memberCount > 200) return '🔥 Very Active';
  if (memberCount > 100) return '⚡ Active';
  if (memberCount > 50) return '🌤️ Moderate';
  if (memberCount > 20) return '💤 Low';
  return '😴 Inactive';
}
