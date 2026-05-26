module.exports = {
 config: {
 name: "mention",
 version: "3.0",
 author: "〲MAMUNツ࿐",
 countDown: 5,
 role: 2,
 shortDescription: "Auto mention spam",
 longDescription: "Reply and send mentions one by one",
 category: "fun",
 guide: {
 en: "-mention 10"
 }
 },

 onStart: async function ({ api, event, args }) {
 try {

 if (!event.messageReply) {
 return api.sendMessage(
 "❌ | Karor msg er reply dao.",
 event.threadID,
 event.messageID
 );
 }

 const amount = parseInt(args[0]);

 if (isNaN(amount) || amount < 1 || amount > 100) {
 return api.sendMessage(
 "❌ | 1-100 er moddhe number dao.",
 event.threadID,
 event.messageID
 );
 }

 const uid = event.messageReply.senderID;

 const userInfo = await api.getUserInfo(uid);
 const name = userInfo[uid].name;

 for (let i = 0; i < amount; i++) {

 await api.sendMessage({
 body: name,
 mentions: [{
 id: uid,
 tag: name
 }]
 }, event.threadID);

 }

 } catch (e) {
 console.log(e);

 api.sendMessage(
 "❌ | Error hoise.",
 event.threadID,
 event.messageID
 );
 }
 }
};
