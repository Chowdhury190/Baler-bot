const fs = require("fs");
const axios = require("axios");
const path = require("path");

const API_BASE = "https://exxdev.onrender.com/api";

async function downloadVideo(url) {
 const res = await axios.get(`${API_BASE}/alldownload`, {
 params: { url },
 timeout: 30000
 });

 if (!res.data?.success) throw new Error(res.data?.error || "Failed");

 const data = res.data;
 const title = data.title || "Video";
 const videoUrl = data.video_url || data.hd || data.sd;

 if (!videoUrl) throw new Error("No video URL found");

 const filePath = path.join("/tmp", `autolink_${Date.now()}.mp4`);
 const fileRes = await axios.get(videoUrl, {
 responseType: "arraybuffer",
 timeout: 120000,
 headers: {
 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
 "Referer": "https://www.facebook.com/"
 }
 });

 fs.writeFileSync(filePath, Buffer.from(fileRes.data));
 return { title, filePath };
}

module.exports = {
 config: {
 name: "autolink",
 version: "1.4",
 author: "MOHAMMAD AKASH",
 countDown: 5,
 role: 0,
 shortDescription: "Auto-download & send videos silently (no messages)",
 category: "media",
 },

 onStart: async function () {},

 onChat: async function ({ api, event }) {
 const threadID = event.threadID;
 const messageID = event.messageID;
 const message = event.body || "";

 const linkMatches = message.match(/(https?:\/\/[^\s]+)/g);
 if (!linkMatches || linkMatches.length === 0) return;

 const uniqueLinks = [...new Set(linkMatches)];

 api.setMessageReaction("⏳", messageID, () => {}, true);

 let successCount = 0;
 let failCount = 0;

 for (const url of uniqueLinks) {
 try {
 const { title, filePath } = await downloadVideo(url);
 if (!filePath || !fs.existsSync(filePath)) throw new Error();

 const stats = fs.statSync(filePath);
 const fileSizeInMB = stats.size / (1024 * 1024);

 if (fileSizeInMB > 25) {
 fs.unlinkSync(filePath);
 failCount++;
 continue;
 }

 await api.sendMessage(
 {
 body:
`𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😘

• 𝐀𝐝𝐦𝐢𝐧: 𝗠𝗔𝗠𝗨𝗡
 🎬 ${title || "Video File"}
 📦 ${fileSizeInMB.toFixed(2)} MB`,
 attachment: fs.createReadStream(filePath)
 },
 threadID,
 () => fs.unlinkSync(filePath)
 );

 successCount++;

 } catch {
 failCount++;
 }
 }

 const finalReaction =
 successCount > 0 && failCount === 0 ? "✅" :
 successCount > 0 ? "⚠️" : "❌";

 api.setMessageReaction(finalReaction, messageID, () => {}, true);
 }
};
