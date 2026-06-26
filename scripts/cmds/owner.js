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
│💌𝗡𝗮𝗺𝗲 :    亗•𝘔𝘈𝘔𝘜𝘕✿᭄
│🧸𝗡𝗶𝗰𝗸      :  Vondo
│🔮 𝗔𝗴𝗲       : 20
│🖤 𝗦𝘁𝗮𝘁𝘂𝘀   :  Single
│✡️ 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 :  Student
 | 🚸𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 :   Inter 2nd Year
│🔶 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻  :  Khulna
╰──────────⭓
╭─────────⭓
 |🆙  ${hours}h ${minutes}m ${seconds}s
 |
 |💾     : ${freeMem}GB / ${totalMem}GB
╰─────────⭓
╭──────────⭓
│💠 WhatsApp
│🆔  wa.me/01830981279
╰──────────⭓
`;

		const cacheFolder = path.join(__dirname, "cache");
		const imagePath = path.join(cacheFolder, "owner.jpg");

		fs.ensureDirSync(cacheFolder);

		const imageUrl = "https://i.imgur.com/g0GpgfG.jpeg";

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
