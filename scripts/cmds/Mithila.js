module.exports = {
  config: {
    name: "mithila",
    version: "1.0.0",
    author: "MAMUN",
    role: 0,
    shortDescription: "Mithila Profile",
    longDescription: "Show Mithila profile information",
    category: "noprefix",
    guide: {
      en: "Type: mithila"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const msg = event.body?.toLowerCase()?.trim();

      if (msg !== "mithila") return;

      const profileText = `⏤͟͟͞͞𝙊𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢  ☺︎
             ⏤͟͟͞͞𝐍𝐚𝐠𝐢𝐧 🐍✨ ┏━━━━━━━━━━━━━━━━━━
  ⏤͟͟͞͞𝐍𝐚𝐦𝐞 ➯⏤͟͟͞͞𝐌𝐢𝐭𝐡𝐢𝐢

⏤͟͟͞͞𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 ➯⏤͟͟͞͞𝐍𝐚𝐠𝐢𝐧 🐍💋

⏤͟͟͞͞𝐂𝐨𝐮𝐧𝐭𝐫𝐲 ➯⏤͟͟͞͞𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 🇧🇩

🏤⏤͟͟͞͞𝐇𝐨𝐦𝐞 ➯⏤͟͟͞͞𝐂𝐮𝐦𝐢𝐥𝐥𝐚 🎀☠️

🏛️⏤͟͟͞͞𝐃𝐢𝐬𝐭𝐫𝐢𝐜𝐭 ➯⏤͟͟͞͞𝐂𝐮𝐦𝐢𝐥𝐥𝐚💀

⛪⏤͟͟͞͞𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 ➯𝐒𝐬𝐜 𝐛𝐚𝐜𝐡 𝟐𝐤𝟐𝟔😒 🐱

⏤͟͟͞͞𝐀𝐠𝐞 ➯ 𝟏𝟔 🐱💔🫶🏻

🕌⏤͟͟͞͞𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 ➯ 𝐈𝐬𝐥𝐚𝐦 ❤️🖤♡♡

⏤͟͟͞͞𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 ➯ 𝐌𝐢𝐧𝐠𝐥𝐞 ‍♡


⏤͟͟͞͞𝐁𝐞𝐬𝐭 𝐅𝐧𝐝➯ 𝐂𝐡𝐢𝐥𝐨 𝐛𝐮𝐭 𝐚𝐤𝐡𝐨𝐧 𝐧𝐚𝐢 ,,🙂

⏤͟͟͞͞𝐅𝐯𝐭 𝐂𝐨𝐥𝐨𝐮𝐫➯ ⏤͟͟͞͞𝐁𝐥𝐚𝐜𝐤 😺🖤

⏤͟͟͞͞𝐅𝐯𝐭 𝐄𝐦𝐨𝐣𝐢 ➯ 🙂🫣🙃🌚💋👀
            
⏤͟͟͞͞𝐇𝐞𝐢𝐠𝐡𝐭 ➯ 𝟓. 𝟎𝟐 ☺︎`;

      return api.sendMessage(
        profileText,
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.log(error);
      return api.sendMessage(
        "❌ Error occurred while running command.",
        event.threadID,
        event.messageID
      );
    }
  }
};
