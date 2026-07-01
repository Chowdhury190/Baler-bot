const fs = require("fs-extra");
const request = require("request");
const path = require("path");
const os = require("os");

module.exports = {
	config: {
		name: "owner",
		version: "3.0",
		author: "亗•𝘔𝘈𝘔𝘜𝘕✿᭄",
		role: 0,
		shortDescription: "Owner information",
		longDescription: "Show owner information",
		category: "information",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {

		const uptime = process.uptime();
		const hours = Math.floor(uptime / 3600);
		const minutes = Math.floor((uptime % 3600) / 60);
		const seconds = Math.floor(uptime % 60);

		const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
		const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

		const msg = `
╔═════════╗
  𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 
╚═════════╝
╭──────────⭓
│💌𝗡𝗮𝗺𝗲 :    𝗔𝗞𝗔𝗦𝗛 𝗖𝗛𝗢𝗪𝗗𝗛𝗨𝗥𝗬
│🧸𝗡𝗶𝗰𝗸      : 𝗡𝗢𝗧𝗬 𝗕𝗢𝗬 
│🔮 𝗔𝗴𝗲       : 20
│🖤 𝗦𝘁𝗮𝘁𝘂𝘀   :  𝗦𝗜𝗡𝗚𝗟𝗘
│✡️ 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 :  𝗦𝗧𝗨𝗗𝗘𝗡𝗧
 | 🚸𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 :  𝗜𝗡𝗧𝗘𝗥 2𝗡𝗗 𝗬𝗘𝗔𝗥 
│🔶 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻  :  𝗗𝗛𝗔𝗞𝗔
╰──────────⭓
╭─────────⭓
 |🆙  ${hours}h ${minutes}m ${seconds}s
 |
 |💾     : ${freeMem}GB / ${totalMem}GB
╰─────────⭓
╭──────────⭓
│💠 WhatsApp
│🆔  wa.me/01199404605
╰──────────⭓
`;

		const cacheFolder = path.join(__dirname, "cache");
		const imagePath = path.join(cacheFolder, "owner.jpg");

		fs.ensureDirSync(cacheFolder);

		const imageUrl = "https://i.imgur.com/3IGizox.jpeg";

		request(imageUrl)
			.pipe(fs.createWriteStream(imagePath))
			.on("close", () => {
				api.sendMessage(
					{
						body: msg,
						attachment: fs.createReadStream(imagePath)
					},
					event.threadID,
					() => {
						if (fs.existsSync(imagePath))
							fs.unlinkSync(imagePath);
					},
					event.messageID
				);
			})
			.on("error", () => {
				api.sendMessage(msg, event.threadID, event.messageID);
			});
	}
};
