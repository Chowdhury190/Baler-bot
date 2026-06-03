const { commands } = global.GoatBot;

module.exports = {
config: {
name: "help",
version: "2.0",
author: "〲MAMUNツ࿐",
countDown: 5,
role: 0,
shortDescription: "Premium Help Menu",
longDescription: "Show all commands by category",
category: "system",
guide: "{pn} [command]"
},

onStart: async function ({ message, usersData, event, args }) {
let name = "User";

try {  
	name = await usersData.getName(event.senderID);  
} catch (e) {}  

const prefix = global.GoatBot.config.prefix || "-";  

// Show command info  
if (args[0]) {  
	const command = commands.get(args[0].toLowerCase());  

	if (!command)  
		return message.reply("❌ Command not found!");  

	const config = command.config;  

	const msg = `

╭〔  𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 〕╮

┃ ✦ 𝗡𝗮𝗺𝗲 : ${config.name}
┃ ✦ 𝗔𝘂𝘁𝗵𝗼𝗿 : ${config.author || "Unknown"}
┃ ✦ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${config.category || "Others"}
┃ ✦ 𝗥𝗼𝗹𝗲 : ${config.role}
┃ ✦ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻 : ${config.countDown}s
┃ 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻
┃ ${config.longDescription || config.shortDescription}

┣━━━━━━━━━━━━━━━━━⬣

┃ 📖 𝗚𝘂𝗶𝗱𝗲
┃ ${config.guide || "{pn}"}

━━━━━━━━━━━⬣
✨ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗠𝗔𝗠𝗨𝗡 ✨
`;

return message.reply(msg);  
}  

const categories = {};  

for (const [, cmd] of commands) {  
	const category = cmd.config.category || "Others";  

	if (!categories[category])  
		categories[category] = [];  

	categories[category].push(cmd.config.name);  
}  

let body = `

╔═༺❘✦═╗
𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 
╚═ ༺❘✦═╝

`;

for (const category in categories) {  
	body += `╭─────⭓ ${category.toUpperCase()}\n`;  

	categories[category]  
		.sort()  
		.forEach(cmd => {  
			body += `│ >× ${cmd}\n`;  
		});  

	body += `╰────────────⭓\n\n`;  
}  

body += `

╭━━━━━━━━━━━╮
┃ 👤 USER : ${name}
┃ 📊 TOTAL : ${commands.size}
┃ ⚡ PREFIX : ${prefix}
╰━━━━━━━━━━━╯
`;

return message.reply(body);

}

};
