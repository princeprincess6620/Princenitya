module.exports.config = {
  name: "hot girl dp",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LEGEND-ARYAN",
  description: "Gril Dp photos",
  commandCategory: "Random-IMG",
  usages: "hot gril dp",
  cooldowns: 2,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }

};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
"https://i.imgur.com/t9JqWzr.jpeg","https://i.imgur.com/lrY3VRt.jpeg","https://i.imgur.com/gj5rXFr.jpeg","https://i.imgur.com/swsOxAE.jpeg","https://i.imgur.com/CUQpLCF.jpeg","https://i.imgur.com/1GgbeeW.jpeg","https://i.imgur.com/1lfTEfc.jpeg","https://i.imgur.com/8qJ19rP.jpeg","https://i.imgur.com/LTvmTWF.jpeg","https://i.imgur.com/JdaO7D8.jpeg","https://i.imgur.com/KIllSw9.jpeg","https://i.imgur.com/TzTyJ0j.jpeg","https://i.imgur.com/YyJGwft.jpeg","https://i.imgur.com/D52bMAQ.jpeg","https://i.imgur.com/Srqs60R.jpeg","https://i.imgur.com/GRIpaTd.jpeg","https://i.imgur.com/6lVDApB.jpeg","https://i.imgur.com/oyEJoZl.jpeg","https://i.imgur.com/XYtNSBd.jpeg","https://i.imgur.com/tUIk8LS.jpeg","https://i.imgur.com/EfOqu7j.jpeg","https://i.imgur.com/f7E7z1j.jpeg","https://i.imgur.com/ZZA5PUk.jpeg","https://i.imgur.com/Nk9XyF5.jpeg","https://i.imgur.com/H4yYDgH.jpeg","https://i.imgur.com/mGBc75p.jpeg","https://i.imgur.com/hncVLZx.jpeg","https://i.imgur.com/MYeL7Mc.jpeg","https://i.imgur.com/otSfUPs.jpeg","https://i.imgur.com/R9YJv8V.jpeg","https://i.imgur.com/HcAJDQC.jpeg","https://i.imgur.com/asCV7CI.jpeg","https://i.imgur.com/FHezlyG.jpeg","https://i.imgur.com/ZXxweGw.jpeg","https://i.imgur.com/tI6Cwwt.jpeg","https://i.imgur.com/YNjO1Q9.jpeg","https://i.imgur.com/9FQRwc6.jpeg","https://i.imgur.com/rwKQiUB.jpeg","https://i.imgur.com/h274psu.jpeg","https://i.imgur.com/Q5sx37r.jpeg","https://i.imgur.com/i6L3JHu.jpeg","https://i.imgur.com/0WaQeZ2.jpeg","","https://i.imgur.com/Gd8K8Cg.jpeg","https://i.imgur.com/R0mvOeZ.jpeg","https://i.imgur.com/GGLiv35.jpeg","https://i.imgur.com/b4hHhSk.jpeg","https://i.imgur.com/45QWr06.jpeg","https://i.imgur.com/uz7bh1h.jpeg","https://i.imgur.com/7blSNAk.jpeg","https://i.imgur.com/r11VKsm.jpeg","https://i.imgur.com/4NyGJmu.jpeg","https://i.imgur.com/HMMe7fV.jpeg","https://i.imgur.com/447Dsfb.jpeg","https://i.imgur.com/BsfPGOF.jpeg","https://i.imgur.com/h0C5puK.jpeg","https://i.imgur.com/qpgBE0X.jpeg","https://i.imgur.com/f0HFaCv.jpeg","https://i.imgur.com/a4vo9Cv.jpeg","https://i.imgur.com/J7PAAuR.jpeg","https://i.imgur.com/OG7CCAz.jpeg","https://i.imgur.com/tqnzYDJ.jpeg","https://i.imgur.com/3ItPOnW.jpeg","https://i.imgur.com/yCkue9w.jpeg","https://i.imgur.com/jx6VfM6.jpeg"
     ];
     var callback = () => api.sendMessage({body:`┏━━━━━┓\n     ╔╬⓼★⓼╃───────➣™
🄼🅁 🄱🄾🅃 🄾🅆🄽🄴🅁 🄰🅁🅈🄰🄽𝄠━─━Ⓔ⧐
╰✾✾®️╀✿✿╀─━ↈⓇ⧐                 ✧══•❁😛❁•══✧\n┗━━━━━┛\n\n♥️`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };
