-cmd install msg.js const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "msg",
		version: "2.1",
		author: "〲𝗠𝗔𝗠𝗨𝗡ツ࿐",
		countDown: 5,
		role: 0,
		shortDescription: "Broadcast + Reply System",
		longDescription: "Send notification to all groups and handle admin-user reply system",
		category: "admin",
		guide: "{pn} <message>"
	},

	onStart: async function ({ api, args, message, threadsData, event }) {

		// 🔒 Only Bot Admin can use
		const { adminBot = [] } = global.GoatBot.config;
		if (!adminBot.includes(event.senderID))
			return message.reply("❌ | Only Bot Admin can use this command.");

		const ADMIN_GROUP_ID = "4095426180772827";

		const content = args.join(" ");
		if (!content)
			return message.reply("❌ | Please enter a message.");

		const allThreads = await threadsData.getAll();
		let success = 0;

		for (const thread of allThreads) {
			if (!thread.threadID || thread.threadID === ADMIN_GROUP_ID) continue;

			try {
				api.sendMessage(
					`📢 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡\n\n${content}\n\n↩️ Reply to this message to contact Admin.`,
					thread.threadID,
					(error, info) => {
						if (!error && info) {
							global.GoatBot.onReply.set(info.messageID, {
								commandName: "msg",
								type: "userReply",
								threadID: thread.threadID,
								adminGroup: ADMIN_GROUP_ID,
								messageID: info.messageID
							});
						}
					}
				);

				success++;
			} catch (e) {}
		}

		return message.reply(`✅ | Notification sent to ${success} groups.`);
	},

	onReply: async function ({ api, event, Reply, message, usersData }) {

		// ================= USER → ADMIN =================
		if (Reply.type === "userReply") {

			let userName = "Unknown User";
			let groupName = "Unknown Group";

			try {
				const u = await usersData.get(event.senderID);
				userName = u?.name || "Unknown User";
			} catch {}

			try {
				const t = await api.getThreadInfo(event.threadID);
				groupName = t?.threadName || "Unknown Group";
			} catch {}

			const attachments = [];

			if (event.attachments?.length) {
				for (const att of event.attachments) {
					try {
						attachments.push(await getStreamFromURL(att.url));
					} catch {}
				}
			}

			api.sendMessage(
				{
					body:
`📩 𝗡𝗘𝗪 𝗥𝗘𝗣𝗟𝗬

👤 User: ${userName}
🆔 UID: ${event.senderID}

🏘️ Group: ${groupName}
🆔 TID: ${event.threadID}

💬 Message:
${event.body || "[Attachment]"}`,
					attachment: attachments
				},
				Reply.adminGroup,
				(error, info) => {
					if (!error && info) {
						global.GoatBot.onReply.set(info.messageID, {
							commandName: "msg",
							type: "adminReply",
							threadID: event.threadID,
							adminGroup: Reply.adminGroup,
							messageID: info.messageID
						});
					}
				}
			);

			return message.reply("✅ | Your message has been sent to Admin.");
		}

		// ================= ADMIN → USER =================
		if (Reply.type === "adminReply") {

			const attachments = [];

			if (event.attachments?.length) {
				for (const att of event.attachments) {
					try {
						attachments.push(await getStreamFromURL(att.url));
					} catch {}
				}
			}

			api.sendMessage(
				{
					body:
`📨 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗣𝗟𝗬

Admin: 〲𝗠𝗔𝗠𝗨𝗡ツ࿐

💬 Message:
${event.body || ""}`,
					attachment: attachments
				},
				Reply.threadID,
				(error, info) => {
					if (!error && info) {
						global.GoatBot.onReply.set(info.messageID, {
							commandName: "msg",
							type: "userReply",
							threadID: Reply.threadID,
							adminGroup: event.threadID,
							messageID: info.messageID
						});
					}
				},
				Reply.messageID
			);

			return message.reply("✅ | Reply sent successfully.");
		}
	}
};
