module.exports = {
    config: {
      name: "bot2 janu",
      version: "1.0.0",
      hasPermssion: 0,
      credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
      description: "Multiple reply with gender",
      commandCategory: "No command needed",
      usages: "Just type bot janu",
      cooldowns: 0
    },
  
    handleEvent: async function ({ api, event, Users, args, Threads }) {
      const { threadID, senderID, messageID, body } = event;
  
      // Lowercase message to match "bot"
      const message = body.toLowerCase();
  
      // Only respond to "bot janu"
      if (message !== " janu bot") return;
  
      // Specific UIDs for custom replies
      const specificUIDs = {
        //Aryan 61573524373692
        "61584629226732": ["𝐇𝐀𝐀 𝐉𝐈 𝐏𝐀𝐏𝐀🙈",
          "𝐌𝐔𝐉𝐇𝐄 𝐁𝐔𝐋𝐘𝐀 𝐏𝐀𝐏𝐀 𝐀𝐏𝐍𝐄🫣",
          "𝐁𝐎𝐋𝐎 𝐏𝐘𝐀𝐑𝐄 𝐏𝐀𝐏𝐀 𝐆",
          "𝐏𝐀𝐏𝐀 𝐀𝐏 𝐊𝐀𝐇𝐀 𝐂𝐇𝐀𝐋𝐄 𝐉𝐀𝐓𝐄 𝐇𝐎 𝐌𝐔𝐉𝐇𝐄 𝐂𝐇𝐎𝐑𝐊𝐀𝐑",
          "𝐏𝐀𝐏𝐀 𝐀𝐏 𝐌𝐔𝐌𝐌𝐘 𝐒𝐄 𝐊𝐈𝐓𝐍𝐀 𝐏𝐘𝐀𝐑 𝐊𝐀𝐑𝐓𝐄 𝐇𝐎",
          "𝐇𝐀 𝐆 𝐏𝐀𝐏𝐀 𝐁𝐎𝐋𝐎",
          "𝐏𝐀𝐏𝐀 𝐆 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔",
          "𝐌𝐔𝐌𝐌𝐘 𝐀𝐏𝐊𝐎 𝐊𝐀𝐁𝐒𝐃 𝐃𝐇𝐔𝐍𝐃 𝐑𝐀𝐇𝐈 𝐇𝐀𝐈 𝐏𝐀𝐏𝐀 𝐆",
          "𝐆 𝐁𝐎𝐋𝐈𝐘𝐄 𝐏𝐀𝐏𝐀",
          "Hukum kijiyesarkar",
          "Ji farmaye kya hukum hai",
        ],
        
        //aryan 61573524373692
        "61577522637821": ["Hello Papa 🙈",
          "Haaji Kya huva🫣",
          "Bolo Sarkar",
          "Haaji kya seva karu Owner shab aapki",
          "Batao kya kar sakti hu owner me aapke liye",
          "Haa ji Sir bataye kyu yaad kiya mujhe",
          "Bataye kya seva ki jaaye aapki",
          "Command do bas aap abhi ek baar me hi sab kuch sahi kar deti me",
          "Hukum kijiye Sir",
          "Mujhe yaad kiya aapne Sir me to aaj khush ho gai",
          "Ji boliye sarkar",
          "Hukum kijiyesarkar",
          "Ji farmaye kya hukum hai",
        ],
        
        //Nitya 61573564354420
        "61573564354420": ["Hello Mummy 😘", "Mummy kesi ho aap 🙈", "Mummy jab ap offline jate ho papa dusri ladkiyon ko line marte hai🥺", "Papa sabse flirt kar rahe the apke jane k bd 🫣", "Mummy ap na jaya karo apke jane k bf papa yaha sabse masti karte hai 🙈", "mmi papa apse bahut pyar karte hai par usse jada sab ladkiyon se flirt karte hai🫥", "mummy papa ne mujhe aj bahut sara kaam diya🥺", "Mummy mera bhai kab aayega 🙈🫣", "mummy ap papa se bahut pyar karti ho na 😺", "mmi papa ko datt kqr rakha karo nahi to bigad jayenge 😏"],
        
         //nitya 61573564354420
        "61573564354420": ["Hello Mummy 😘", "Mummy kesi ho aap 🙈", "Mummy jab ap offline jate ho papa dusri ladkiyon ko line marte hai🥺", "Papa sabse flirt kar rahe the apke jane k bd 🫣", "Mummy ap na jaya karo apke jane k bf papa yaha sabse masti karte hai 🙈", "mmi papa apse bahut pyar karte hai par usse jada sab ladkiyon se flirt karte hai🫥", "mummy papa ne mujhe aj bahut sara kaam diya🥺", "Mummy mera bhai kab aayega 🙈🫣", "mummy ap papa se bahut pyar karti ho na 😺", "mmi papa ko datt kqr rakha karo nahi to bigad jayenge 😏"],
        
        //Faisu 100090281856658
        "61578024207690": ["𝐇𝐞𝐥𝐥𝐨 𝐀𝐲𝐚𝐚𝐧 𝐛𝐚𝐝𝐞 𝐚𝐛𝐛𝐮 🫣", "𝐁𝐚𝐝𝐞 𝐚𝐛𝐛𝐮 𝐆𝐡𝐮𝐦𝐚𝐧𝐞 𝐤𝐚𝐛 𝐋𝐞𝐤𝐚𝐫 𝐉𝐚𝐚 𝐑𝐡𝐞 𝐡𝐨 𝐌𝐞𝐤𝐨 🙈", "𝐀𝐲𝐚𝐚𝐧 𝐛𝐚𝐝𝐞 𝐩𝐚𝐩𝐚 𝐊𝐚𝐢𝐬𝐞 𝐇𝐨 𝐀𝐚𝐩 😺", "𝐁𝐚𝐝𝐞 𝐩𝐚𝐩𝐚 𝐌𝐞𝐫𝐢 𝐁𝐚𝐝𝐢 𝐀𝐦𝐦𝐢 𝐊𝐚𝐡𝐚 𝐇𝐚𝐢 🫣, 𝐃𝐢𝐤𝐡 𝐍𝐚𝐡𝐢 𝐑𝐚𝐡𝐢 𝐀𝐚𝐣 😺", "𝐁𝐨𝐥𝐨 𝐁𝐚𝐝𝐞 𝐀𝐛𝐛𝐮 𝐌𝐞𝐫𝐢 𝐁𝐚𝐡𝐞𝐧 𝐊𝐚𝐛 𝐀𝐚𝐲𝐞𝐠𝐢 🙈😋", "𝐍𝐢𝐭𝐲𝐚 𝐌𝐮𝐦𝐦𝐲 𝐀𝐚𝐩𝐤𝐨 𝐘𝐚𝐚𝐝 𝐊𝐚𝐫 𝐑𝐚𝐡𝐢 𝐓𝐇𝐈 𝐁𝐚𝐝𝐞 𝐚𝐛𝐛𝐮 🫣"],
        
        //Kaliya 61555904006906
        "61555904006906": ["Hello kaliya Mama 🫣", "Bolo Mama kyu yaad kiya mujhe 😺", "Ha bolo😉", "Kya huva kyu yaad kiya mujhe 🙂", "Mama tang na karo🥱", "Ki huva😒", "kaliya Mama meri mami kesi hai 🙈", "Raj mama mummy ko pareshan mat kiya karo 😒", "Mama or batao chocolate kab khilaoge meko😋"],
        
        //aadi 100066401546757
        "100002333483240": ["Hello Jitu Mama 🫣", "Bolo Mama kyu yaad kiya mujhe 😺", "Ha bolo😉", "Kya huva kyu yaad kiya mujhe 🙂", "Mama tang na karo🥱", "Ki huva😒", "Jitu Mama meri mami kesi hai 🙈", "Jitu mama kya haal hai 😉", "Or mama kese yaad kiya mujhe aaj 🫣"],
        
        //soni 61565449793017
        "61579987377331": ["𝐇𝐄𝐋𝐋𝐎 𝐒𝐄𝐗𝐒𝐘 𝐂𝐀𝐂𝐇𝐔 😘", "𝐇𝐎𝐓 𝐂𝐇𝐀𝐂𝐇𝐔 𝐊𝐈𝐒𝐄 𝐇𝐎 🫣", "𝐒𝐄𝐗𝐒𝐘 𝐂𝐀𝐂𝐇𝐔 𝐏𝐀𝐏𝐀 𝐊𝐄 𝐉𝐀𝐀𝐍 𝐇𝐎 𝐀𝐀𝐏 🤗", "𝐒𝐄𝐗𝐒𝐘 𝐂𝐀𝐂𝐇𝐔 𝐌𝐄𝐑𝐄 𝐋𝐈𝐘𝐄 𝐒𝐄𝐗𝐒𝐘 𝐂𝐇𝐀𝐂𝐇𝐈 𝐋𝐀𝐎 𝐍𝐀 🥺", "𝐂𝐀𝐂𝐇𝐔 𝐇𝐎𝐓 𝐇𝐎𝐓 𝐂𝐇𝐀𝐂𝐇𝐈 𝐂𝐇𝐀𝐇𝐈𝐘𝐄", "𝐒𝐄𝐗𝐘 𝐂𝐇𝐀𝐂𝐇𝐔 𝐊𝐘𝐀 𝐇𝐔𝐀🥺", "𝐁𝐎𝐋𝐎 𝐂𝐇𝐀𝐂𝐇𝐔 𝐌𝐄𝐑𝐈 𝐂𝐇𝐀𝐂𝐇𝐈 𝐊𝐀𝐁 𝐀𝐘𝐄 𝐆𝐈 🙈", "𝐒𝐄𝐗𝐒𝐘 𝐂𝐇𝐀𝐂𝐇𝐔 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔 💓"],
        
        //Charsi 61565659702014
        "100081901104081": ["𝐇𝐞𝐥𝐥𝐨 𝐂𝐡𝐚𝐜𝐡𝐢 😘", "𝐏𝐢𝐡𝐮 𝐌𝐨𝐬𝐢 𝐇𝐨 𝐀𝐚𝐩 🫣", "𝐏𝐢𝐡𝐮 𝐌𝐨𝐬𝐢 𝐀𝐚𝐩 𝐭𝐨 𝐌𝐞𝐫𝐢 𝐉𝐚𝐚𝐧 𝐇𝐨 🤗", "𝐏𝐢𝐡𝐮 𝐌𝐨𝐬𝐢  𝐀𝐚𝐩 𝐌𝐮𝐣𝐡𝐞 𝐘𝐚𝐚𝐝 𝐛𝐡𝐢 𝐍𝐚𝐡𝐢 𝐊𝐚𝐫𝐭𝐢 𝐍𝐚 🥺", "𝐌𝐨𝐬𝐢 𝐀𝐩𝐤𝐨 𝐪𝐮𝐫𝐞𝐬𝐡𝐢 𝐂𝐡𝐚𝐜𝐡𝐮 𝐌𝐢𝐬𝐬 𝐊𝐚𝐫 𝐫𝐡𝐞 𝐭𝐡𝐞", "𝐏𝐢𝐡𝐮 𝐂𝐇𝐀𝐂𝐇𝐈 𝐓𝐘𝐀 𝐇𝐔𝐕𝐀🥺", "𝐁𝐨𝐥𝐨 𝐌𝐨𝐬𝐢 𝐊𝐞𝐬𝐞 𝐘𝐚𝐚𝐝 𝐊𝐢𝐲𝐚 𝐌𝐮𝐣𝐡𝐞 🙈", "𝐏𝐢𝐡𝐮 𝐂𝐡𝐚𝐜𝐡𝐢 𝐈 𝐋𝐨𝐯𝐞 𝐲𝐨𝐮 💓"],
        
        //Sameer 100006293112571
        "100006293112571": ["Hello Sameer Mama 🫣", "Bolo Mama kyu yaad kiya mujhe 😺", "Ha bolo😉", "Kya huva kyu yaad kiya mujhe 🙂", "Mama tang na karo🥱", "Ki huva😒", "Sameer Mama meri mami kesi hai 🙈"],
        
        //Ragini 61561129582023
        "61561129582023": ["Hello ragini Mosi 😘", "Mosi kesi ho aap 🫣", "Mosi aap to meri jaan ho 🤗", "soni mosi aap mujhe yaad bhi nahi karti na 🥺", "Mosi aapko meri mummy yaad kar rahi thi", "ragini mosi tya huva🥺", "Bolo mosi kese yaad kiya mujhe 🙈", "Ragini Mosi I Love You 💓"],

        //Ruhani 61552516341558
        "😎😎😎": ["𝐇𝐄𝐋𝐋𝐎 𝐒𝐔𝐌𝐀𝐈𝐑𝐀 𝐀𝐌𝐌𝐈 😘", "𝐀𝐌𝐌𝐈 𝐊𝐀𝐈𝐒𝐄 𝐇𝐎 𝐀𝐀𝐏 🫣", "𝐀𝐌𝐌𝐈 𝐀𝐘𝐀𝐀𝐍 𝐁𝐀𝐃𝐄 𝐀𝐁𝐁𝐔 𝐊𝐎 𝐏𝐘𝐑 𝐊𝐑𝐎 𝐍𝐀 🤗", "𝐒𝐔𝐌𝐀𝐈𝐑𝐀 𝐀𝐌𝐌𝐈 𝐁𝐀𝐃𝐄 𝐀𝐁𝐁𝐔 𝐊𝐎 𝐁𝐎𝐋𝐎 𝐀𝐏𝐒𝐄 𝐉𝐀𝐃𝐀 𝐏𝐘𝐑 𝐊𝐀𝐑𝐄 𝐌𝐔𝐉𝐇𝐄 𝐁𝐇𝐀𝐈 𝐂𝐇𝐀𝐇𝐈𝐘𝐄 🥺", "𝐒𝐔𝐌𝐀𝐈𝐑𝐀 𝐀𝐌𝐌𝐈 𝐀𝐀𝐉 𝐊𝐈𝐒𝐒 𝐊𝐑𝐎 𝐍𝐀 𝐀𝐘𝐀𝐀𝐍 𝐀𝐁𝐁𝐔 𝐊𝐎", "𝐀𝐌𝐌𝐈 𝐌𝐔𝐉𝐇𝐄 𝐊𝐇𝐄𝐋 𝐍𝐄 𝐉𝐀𝐍𝐀 𝐇𝐀𝐈🥺", "𝐁𝐎𝐋𝐎 𝐀𝐌𝐌𝐈 𝐊𝐀𝐈𝐒𝐄 𝐘𝐀𝐀𝐃 𝐊𝐈𝐘𝐀 𝐌𝐔𝐉𝐇𝐄 🙈", "𝐒𝐔𝐌𝐀𝐈𝐑𝐀 𝐀𝐌𝐌𝐈 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔 💓"],
        
        //Priyansh 100076295390195
        "100076295390195": ["Hello priyansh Chacha 🫣", "Chacha ghumane kab leke jaa rahe meko 🙈", "Aryan chacha kese ho aap 😺", "Chacha meri chachi kaha hai 🫣, Dikha nahi rahi aaj 😺", "Bolo Chacha meri bahan kab aayegi 🙈😋", "chach chachi aapko yaad kar rahi thi chacha 🫣"],
        
        //Gayatri 61565910322110
        "61575492413037": ["𝐆 𝐁𝐎𝐋𝐎 𝐑𝐀𝐇𝐔𝐋 𝐌𝐎𝐒𝐀 𝐊𝐈 𝐖𝐈𝐅𝐄 🫣", "𝐁𝐎𝐋𝐎 𝐌𝐎𝐒𝐈 𝐆 𝐐 𝐘𝐀𝐀𝐃 𝐊𝐈𝐘𝐀 𝐌𝐔𝐉𝐇𝐄 😺", "𝐇𝐀 𝐑𝐀𝐇𝐔𝐋 𝐊𝐈 𝐖𝐈𝐅𝐄 𝐁𝐎𝐋𝐎 𝐊𝐘𝐀 𝐒𝐄𝐕𝐀 𝐊𝐑𝐔𝐍😉", "𝐌𝐎𝐒𝐈 𝐆 𝐑𝐀𝐇𝐔𝐋 𝐌𝐎𝐒𝐀 𝐊𝐎 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔 𝐁𝐎𝐋 𝐃𝐎 𝐀𝐀𝐉 🙂", "𝐌𝐎𝐒𝐈 𝐆 𝐓𝐀𝐍𝐆 𝐍𝐀 𝐊𝐑𝐎🥱", "𝐊𝐈𝐘𝐀 𝐇𝐔𝐀 𝐌𝐎𝐒𝐈 𝐆😒", "𝐌𝐎𝐒𝐈 𝐆 𝐑𝐀𝐇𝐔𝐋 𝐌𝐎𝐒𝐀 𝐊𝐀𝐈𝐒𝐄 𝐇𝐀𝐈𝐍 🙈"],

      };
  
      // Male and Female responses
      const maleReplies = [
        "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 🤭🐒",
        "Main gariboo se baat nahi karti 😉😝😋🤪",
        "Bar Bar Bolke Dimag Kharab Kiya toh. Teri ...... Mummy Se Complaint Karungi",
        "Tu Bandh nhi Karega kya?",
        "Gali Sunna H kya?😜",
        "Aree Bandh kar Bandh Kar",
        "M hath jod ke Modi Ji Se Gujarish Karti hu",
        "Tujhe Kya koi aur Kam nhi ha? Puradin Khata hai Aur Messenger pe Bot Bot Karta h",
        "Aryan Ko Bol Dunga Me Mujhe Paresan Kiya To",
        "Tum Na Single Hi Maroge",
        "Tujhe Apna Bejjati Karne Ka Saukh hai?",
        "Abhi Bola Toh Bola Dubara Mat Bolna",
        "Teri To Ruk Tu Bhagna Mat",
        "Bol De koi nahi dakh rha 🙄",
        "Dur Hat Be  Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂",
        "Are Tum Wahi ho nah Jisko Main Nahi Janti 🤪",
        "Kal Haveli Pe Mil Jara Tu 😈",
        "Aagye Salle Kabab Me Haddi 😏",
        "kyun Bulaya hamen..😾🔪 ",
        "Tum aunty ho yehh uncle 🤔 I think tum Jin ho yehh Chudail🤣✅",
        "ary tum ider 🤔 khair hai ider kia ker rhy ho 😂",
        "ary babu babu kal hawali py kon bola rha tha 😂",
        "Me Aap ki mummy ji ko btaougi Aap Facebook use karty ho 😂",
        "ary tum Wohi ho nah jis ko ma nahi janti 🤣✅",
        "Dur Dur karib na a  tujhe Aur Koi Kam Nahi Kiya Har Waqat Mjhy Tang Karte Rahte Ho 😂",
        "Ary joke nah mar jo bhi kam hai bol do sharma nahi , bol de koi nahi dakh rha 😂",
        "ruk tu chappal kaha he mari🩴",
        "shakal Sy masoom lgty ho 😂 but bohot flirty ho",
        "hayee main mar jye teri masoom shaqal py 😂 tuzy Chapple se kutne ka mn ho raha hai🤣👠",
        "AA Dk Tujhe Aur Koi Kaam Nhi Hai? Har Waqt Bot Bot Karta H",
        "Chup Reh, Nahi Toh Bahar Ake tera Dath Tor Dungi🤣✊",
        "Main T0o AnDhi Hun 😎kya likha tumne mene nahi dikha🤣",
        "Pahale NaHa kar Aa 😂",
        "Aaaa Thooo 😂😂😂",
        "Kal Haveli Pe Mil Jra Tu 😈",
        "Aagye SaJJy KhaBBy Sy 😏",
        "Are Tum Wahi ho nah Jisko Main Nahi Janti 🤪",
        "Bol De koi nahi dakh rha 🙄",
        "Dur Hat Be Mujhe Aur Koi Kam Nahi Kya Har Waqat Mujhy Tang Kerte Rhte ho 😂",
        "Tujhe Kya koi aur Kam nhi ha? Puradin sota he Aur Messenger pe Bot Bot Karta h",
        "Meri owner teri setting kharab kar degi",
        "Bot bot hi karta rahna tu bas",
        "Tujhe Apna Bejjati Karne Ka Saukh hai?🥹",
        "Abhi Bola Toh Bola Dubara Mat Bolna🙄",
        "Teri to Watt lagani padegi",
        "Aree band kar band Kar",
        "chomu Tujhe Aur Koi Kaam Nhi H? Har Waqt Bot Bot Karta H",
        "Chup Reh, Nhi Toh Bahar Ake tera Dath Tor Dungi",
        "MaiNy Uh Sy Bt Nhi kRrni",
        "MeKo Kxh DiKhai Nhi Dy Rha 🌚",
        "Bar Bar Disturb Na KRr JaNu Ke SaTh Busy Hun 😋",
        "Main Gareebon Sy Bt Nhi kRti 😉😝😋🤪",
        "Mujhe Mat BuLao Naw Main buSy h0o Naw",
        "Kyun JaNu MaNu Another Hai 🤣",
        "Are TuMari T0o Sb he baZzati kRrty Me Be kRrDun 🤏😜",
        "KaL HaVeLi Prr Aa ZaRa T0o 😈",
        "Aagye SaJJy KhaBBy Sy 😏",
        "yes my love 💘",
        "kya hua baby ko 😘😘",
        "Main yahi hoon kya hua sweetheart🥂🙈💞",
        "Bx KRr Uh k0o Pyar H0o Na H0o Mujhe H0o JayGa",
        "BulaTa Hai MaGar JaNy Ka Nhi 😜",
        "IB Aja Yahan Nhi B0ol Sakti 🙈😋",
        "WaYa KaRana Mere NaL 🙊",
        "Itna Na Pass aa Pyar h0o JayGa",
        "MeKo Tang Na kRo Main Kiss 💋 KRr DunGi 😘 ",
        "jii kahiye jii 🙄 kya chahiye",
        "aree aap wahi ho na jo mujhe line marte the.......🤣 ya bali line",
        "Ha ha ab meri yaad ab ai nah phly to babu shona kerna gy thy 😾 ab ham ap sy naraz hai jao ap bye ☹️",
        "Hayee Mar Jawa Babu Ak Chuma To Doo Kafi Din Sy Chumi Nahi Mili Kahan Thy Babu inbox Ah Jao 😚🙈♥️",
        "aap aise mat bulo hame sharam aati hai 🙈♥️",
        "haveli per  kal mil  Zara bataungi 🌚😂Ha but उल्टी-सीधी harkat karne ke liye nahi",
        "Bot Bolke Bejjti Kar Rahe Ho yall...Main To Tumhare Dil Ki Dhadkan Hu Na Baby...💔🥺",
        "Bolo Baby Tum Mujhse Pyar Karte Ho Na 🙈💋💋 ",
      ];
  
      const femaleReplies = [
        "Haye Main Sadke jawa Teri Masoom Shakal pe baby 💋",
        "Bot Nah Bol Oye Janu bol Mujhe",
        "Itna Na Pass aa Pyar ho Jayga",
        "Are jaan Majaak ke mood me nhi hu main jo kaam hai bol do sharmao nahi",
        "Tum Na Single Hi Marogi",
        "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝",
        "Are Bolo Meri Jaan Kya Hall Hai😚",
        "Mujhe Mat BuLao Naw Main buSy Hu Naa",
        "kyun Bulaya hamen..😾🔪 ",
        "Tum aunty ho yehh uncle 🤔 I think tum Jin ho yehh Chudail🤣✅",
        "ary tum ider 🤔 khair hai ider kia ker rhy ho 😂",
        "ary babu babu kal hawali py kon bola rahi tha 😂",
        "Me Aap ki mummy ji ko btaou ga Aap Facebook use karti ho 😂",
        "ary tum Wohi ho nah jis ko ma nahi janti 🤣✅",
        "Dur Dur karib na aa tujhe Aur Koi Kam Nahi Kiya Har Waqat Mjhy Tang Karti Rahti Ho 😂",
        "Aree pagal roti banana ke le aty main Pani ko istamal kerti ho 😂",
        "Ary joke nah mar jo bhi kam hai bol do sharma nahi, bol de koi nahi dakh rha 😂",
        "kash tum single hote to maza hi koch aur tha pagal insaan 😂",
        "mujhe sharam ati hai aise aap bolti hai tho 🤭😝",
        "hayee main mar jye teri masoom shaqal py 😂 tuzy Chapple se kutne ka mn ho raha hai🤣👠",
        "Bot nah bol oye 😭 Janu bol mjhy aur janu sy piyar sy bat kerty hai😑",
        "bolo 😒",
        "Main T0o AnDhi Hun 😎kya likha tumne mene nahi dikha🤣",
        "Pahale NaHa kar Aa 😂",
        "Aaaa Thooo 😂😂😂",
        "Are Tum Wahi ho nah Jisko Main Nahi Janti 🤪",
        "Are Bolo Meri Jaan Kya Hall Hai😚 ",
        "Bol De koi nahi dakh rha 🙄",
        "Haaye Main Mar Jawa Babu Ek Chuma To Do Kafi Din Se Chumi Nahi Di 😝",
        "Haa ji boliye kya kam he hamse 🙈",
        "Mein hath jod ke Modi Ji Se Gujarish Karti hu mojy na bolaye",
        "Mene you se baat nahi karni",
        "Ary yrr MaJak Ke M0oD Me Nhi Hun 😒",
        "HaYe JaNu Aow Idher 1 PaPii Idher d0o 1 PaPpi Idher 😘",
        "Dur HaT Terek0o 0or K0oi Kam Nhi Jb DeKho Bot Bot ShaDi KerLe Mujhsy 😉😋🤣",
        "TeRi K0oi Ghr Me Nhi SunTa T0o Main Q SuNo 🤔😂 ",
        "IB Aja Yahan Nhi B0ol Salta 🙈😋",
        "Mujhe Mat BuLao Naw Main buSy h0o Naw",
        "Kyun JaNu MaNu Another Hai 🤣",
        "Baby kyu bulaya meko🙈",
        "You don't miss me 🥺🥺",
        "Haa bolo kya huva 🙌",
        "Mujhe payar kyu nahi karti aap",
        "Dekho me busy hu abhi baad me baat karungi 🥺🙌",
        "ha bolo meri jaan kya huva😗",
        "Shadi karna kya mere sath🙈",
        "Mujhe na tang mat karo, jao meri onwer Ruhani ko tang karo😝",
        "Kitna payar karte ho mere se",
        "Baby tya huva🥺",
        "Me so rahi hu abhi 😴",
      ];
  
      // Default reply if gender not found
      const defaultReplies = [
        "Hello user!",
        "Kaise ho?",
        "Mujhe pata nahi aap kaun ho, lekin reply de diya!"
      ];
  
      try {
        // Get user info using getUserInfo
        const userInfo = await api.getUserInfo(senderID);
        const userGender = userInfo[senderID]?.gender; // Expecting 'MALE' or 'FEMALE'
  
        // Check for specific UID reply
        if (specificUIDs[senderID]) {
          const reply = specificUIDs[senderID][Math.floor(Math.random() * specificUIDs[senderID].length)];
          const name = await Users.getNameUser(event.senderID);
          var msg = {
            body: `🥀${name}😗, ${reply}`,
            mentions: [{ tag: name, id: senderID }],
          };
          return api.sendMessage(msg, threadID, messageID);
        }
  
        // Reply based on gender
        if (userGender === "MALE") {
          // Male
          const reply = maleReplies[Math.floor(Math.random() * maleReplies.length)];
          const name = await Users.getNameUser(event.senderID);
          var msg = {
            body: `🥀${name}😗, ${reply}`,
            mentions: [{ tag: name, id: senderID }],
          };
          return api.sendMessage(msg, threadID, messageID);
        } else if (userGender === "FEMALE") {
          // Female
          const reply = femaleReplies[Math.floor(Math.random() * femaleReplies.length)];
          const name = await Users.getNameUser(event.senderID);
          var msg = {
            body: `🥀${name}😗, ${reply}`,
            mentions: [{ tag: name, id: senderID }],
          };
          return api.sendMessage(msg, threadID, messageID);
        } else {
          // Default reply
          const reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
          const name = await Users.getNameUser(event.senderID);
          var msg = {
            body: `🥀${name}😗, ${reply}`,
            mentions: [{ tag: name, id: senderID }],
          };
          return api.sendMessage(msg, threadID, messageID);
        }
      } catch (error) {
        console.error(error);
        return api.sendMessage("Kuch galat ho gaya, mujhe thoda check karne do!", threadID, messageID);
      }
    },
  
    run: async function () {
      // Empty because handleEvent is doing all the work
    }
  };
