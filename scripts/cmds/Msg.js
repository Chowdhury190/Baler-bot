const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "msg",
		version: "2.0",
		author: "〲MAMUNツ࿐",
		countDown: 5,
		role: 0,
		shortDescription: "Broadcast notification",
		longDescription: "Send notification to all groups and receive replies",
		category: "admin",
		guide: "{pn} <message>"
	},

	onStart: async function ({ api, args, message, threadsData }) {
		const ADMIN_GROUP_ID = "4095426180772827";

		const content = args.join(" ");
		if (!content)
			return message.reply("❌ | Please enter a message.");

		const allThreads = await threadsData.getAll();
		let success = 0;

		for (const thread of allThreads) {
			if (!thread.threadID || thread.threadID == ADMIN_GROUP_ID)
				continue;

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
			}
			catch (e) {}
		}

		return message.reply(`✅ | Notification sent to ${success} groups.`);
	},

	onReply: async function ({
		api,
		event,
		Reply,
		message,
		usersData,
		threadsData
	}) {

		if (Reply.type === "userReply") {

			let userName = "Unknown User";
			let groupName = "Unknown Group";

			try {
				const userData = await usersData.get(event.senderID);
				userName = userData?.name || "Unknown User";
			}
			catch (e) {}

			try {
				const threadInfo = await api.getThreadInfo(event.threadID);
				groupName = threadInfo.threadName || "Unknown Group";
			}
			catch (e) {}

			const attachments = [];

			if (event.attachments?.length > 0) {
				for (const att of event.attachments) {
					try {
						attachments.push(await getStreamFromURL(att.url));
					}
					catch (e) {}
				}
			}

			api.sendMessage(
				{
					body:
`

👤 User: ${userName}
🆔 UID: ${event.senderID}

🏘️ Group: ${groupName}
🆔 TID: ${event.threadID}

💬 Message:
${event.body || "[Attachment/Sticker]"}`,
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
							messageID: event.messageID
						});
					}
				}
			);
		}

		if (Reply.type === "adminReply") {

			const attachments = [];

			if (event.attachments?.length > 0) {
				for (const att of event.attachments) {
					try {
						attachments.push(await getStreamFromURL(att.url));
					}
					catch (e) {}
				}
			}

			api.sendMessage(
				{
					body: `📨 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗣𝗟𝗬 n\n\n\n${event.body || ""}`,
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
