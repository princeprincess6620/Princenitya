const fs = require("fs-extra");

module.exports.config = {
    name: "code",
    version: "1.1.0",
    hasPermssion: 2,
    credits: "M.R PRINCE",
    description: "read / edit / create / delete / rename js files",
    commandCategory: "admin",
    usages: "code read/edit/cre/del/rename",
    cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {

    if (!args[0]) 
        return api.sendMessage("❌ Use: code read/edit/cre/del/rename filename", event.threadID);

    const filePath = (name) => `${__dirname}/${name}.js`;

    try {

        // 📖 READ
        if (args[0] === "read" || args[0] === "-r") {
            if (!args[1]) return api.sendMessage("❌ File name missing", event.threadID);
            if (!fs.existsSync(filePath(args[1])))
                return api.sendMessage("❌ File not found", event.threadID);

            const data = await fs.readFile(filePath(args[1]), "utf-8");
            return api.sendMessage(data, event.threadID);
        }

        // ✏️ EDIT
        if (args[0] === "edit") {
            if (!args[1]) return api.sendMessage("❌ File name missing", event.threadID);

            const newCode = event.body.split(args[1]).slice(1).join(args[1]).trim();
            if (!newCode) return api.sendMessage("❌ No code provided", event.threadID);

            await fs.writeFile(filePath(args[1]), newCode, "utf-8");
            return api.sendMessage(`✅ Updated ${args[1]}.js`, event.threadID);
        }

        // ➕ CREATE
        if (args[0] === "cre") {
            if (!args[1]) return api.sendMessage("❌ File name missing", event.threadID);
            if (fs.existsSync(filePath(args[1])))
                return api.sendMessage("❌ File already exists", event.threadID);

            await fs.writeFile(filePath(args[1]), "// new file\n", "utf-8");
            return api.sendMessage(`✅ Created ${args[1]}.js`, event.threadID);
        }

        // 🗑️ DELETE
        if (args[0] === "del") {
            if (!args[1]) return api.sendMessage("❌ File name missing", event.threadID);
            if (!fs.existsSync(filePath(args[1])))
                return api.sendMessage("❌ File not found", event.threadID);

            await fs.unlink(filePath(args[1]));
            return api.sendMessage(`✅ Deleted ${args[1]}.js`, event.threadID);
        }

        // 🔁 RENAME
        if (args[0] === "rename") {
            if (!args[1] || !args[2])
                return api.sendMessage("❌ Use: code rename old new", event.threadID);

            await fs.rename(filePath(args[1]), filePath(args[2]));
            return api.sendMessage(`✅ Renamed ${args[1]}.js → ${args[2]}.js`, event.threadID);
        }

    } catch (err) {
        console.log(err);
        return api.sendMessage("❌ Error occurred, check console", event.threadID);
    }
};
