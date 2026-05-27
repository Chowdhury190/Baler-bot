const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return res.data.mahmud69;
};

module.exports = {
  config: {
    name: "alldl",
    aliases: ["download", "dl"],
    version: "2.0",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    description: {
      en: "Download videos from social media"
    },
    category: "media",
    guide: {
      en: "{pn} <video link>"
    }
  },

  langs: {
    en: {
      noLink: "❌ | Please provide a valid video link.",
      error: "❌ | Failed to download video: %1"
    }
  },

  onStart: async function ({ api, message, args, event, getLang }) {
    const url = args[0] || event.messageReply?.body;

    if (!url || !url.startsWith("http")) {
      return message.reply(getLang("noLink"));
    }

    const filePath = path.join(__dirname, "cache", `alldl_${Date.now()}.mp4`);

    try {
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const base = await baseApiUrl();
      const apiUrl = `${base}/api/download?url=${encodeURIComponent(url)}`;

      const apiRes = await axios.get(apiUrl);

      if (!apiRes.data || !apiRes.data.result) {
        throw new Error("No video found");
      }

      const videoUrl = apiRes.data.result;

      const video = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(video.data, "binary"));

      const caption = `𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😘

• 𝐀𝐝𝐦𝐢𝐧: 𝗠𝗔𝗠𝗨𝗡`;

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return message.reply(
        {
          body: caption,
          attachment: fs.createReadStream(filePath)
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return message.reply(getLang("error", err.message));
    }
  }
};
