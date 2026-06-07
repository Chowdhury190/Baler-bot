const ADMIN_UIDS = [
  "61590172617870",
  "61590500574663",
  "100001979661212"
];

module.exports = {
  config: {
    name: "rag",
    version: "3.1.0",
    author: "Mamun",
    role: 0,
    category: "fun",
  },

  onStart: async function () {
    if (!global.ragAuto) global.ragAuto = {};
  },

  onChat: async function ({ api, event }) {
    if (!event.isGroup) return;
    if (!global.ragAuto) global.ragAuto = {};

    const threadID = event.threadID;
    const senderID = String(event.senderID);

    const body = (event.body || "").toLowerCase().trim();
    const clean = body.replace(/@\S+/g, "").trim();

    // 🔥 UID ADMIN CHECK (FIXED)
    const isAdmin = ADMIN_UIDS.includes(senderID);

    // ON
    if (clean === "-rag korla on") {
      if (!isAdmin)
        return api.sendMessage("⛔ Only Admin can ON", threadID);

      global.ragAuto[threadID] = true;
      return api.sendMessage("🟢 RAG AUTO ENABLED", threadID);
    }

    // OFF
    if (clean === "-rag korla off") {
      if (!isAdmin)
        return api.sendMessage("⛔ Only Admin can OFF", threadID);

      global.ragAuto[threadID] = false;
      return api.sendMessage("🔴 RAG AUTO DISABLED", threadID);
    }

    if (!global.ragAuto[threadID]) return;
    if (senderID === api.getCurrentUserID()) return;

    const text = "⏤͟͟͞͞𝗥𝗮𝗴 𝗸𝗼𝗿𝗹𝗮/-🙂";

    let name = "User";
    try {
      const info = await api.getUserInfo(senderID);
      name = info[senderID]?.name || "User";
    } catch (e) {
      name = "User";
    }

    return api.sendMessage(
      {
        body: `${text} ${name}`,
        mentions: [
          {
            tag: name,
            id: senderID
          }
        ]
      },
      threadID,
      event.messageID
    );
  }
};
