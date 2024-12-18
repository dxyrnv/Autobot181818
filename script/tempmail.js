const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0",
  author: "developer",
  role: 0,
  description: "Generate temporary emails and fetch inbox messages.",
  usage: "{pn} gen\n{pn} inbox <email>",
  cooldowns: 2,
};

module.exports.run = async ({ api, args, event }) => {
  const command = args[0];

  if (command === "gen") {
    try {
      const domains = ["1secmail.com", "1secmail.org", "1secmail.net"];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${Math.random().toString(36).slice(2, 10)}@${domain}`;
      
      return api.sendMessage(`generated email: ${email}`, event.threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("Failed to generate email.", event.threadID);
    }
  } else if (command === "inbox") {
    const email = args[1];

    if (!email) {
      return api.sendMessage("𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗆𝖺𝗂𝗅 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝖿𝗈𝗋 𝗍𝗁𝖾 𝗂𝗇𝖻𝗈𝗑.", event.threadID);
    }

    try {
      const domain = email.split('@')[1];
      if (!["1secmail.com", "1secmail.net", "1secmail.org"].includes(domain)) {
        return api.sendMessage("𝗨𝗻𝘀𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗱𝗼𝗺𝗮𝗶𝗻. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲 𝗼𝗻𝗲 𝗳𝗿𝗼𝗺: 1secmail.com, 1secmail.net, 1secmail.org.", event.threadID);
      }

      const [username, userDomain] = email.split('@');
      const inboxResponse = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${userDomain}`);
      const inboxMessages = inboxResponse.data;

      if (!inboxMessages.length) {
        return api.sendMessage(`📬 𝗜𝗻𝗯𝗼𝘅 𝗶𝘀 𝗲𝗺𝗽𝘁𝘆 𝗳𝗼𝗿 ${email}.`, event.threadID);
      }

      const message = inboxMessages[0];
      const messageDetails = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${userDomain}&id=${message.id}`);
      const { from, subject, date, textBody } = messageDetails.data;

      return api.sendMessage(
        `━━━━━━━━━━━━━\n📧 𝗙𝗿𝗼𝗺: ${from}\n📄 𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${subject}\n🗓️ 𝗗𝗮𝘁𝗲: ${date}\n\n📜 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n${textBody}\n━━━━━━━━━━━━━`,
        event.threadID
      );
    } catch (error) {
      console.error(error);
      return api.sendMessage("𝖥𝖺𝗂𝗅𝖾𝖽 𝖺𝖼𝖼𝗲𝗌𝖲 𝗂𝗇𝖻𝗈𝗑 𝗈𝗿 𝗺𝖾𝗌𝗌𝗮𝗀𝗲𝗌.", event.threadID);
    }
  } else {
    return api.sendMessage("Invalid command. Use {pn} gen or {pn} inbox <email>.", event.threadID);
  }
};
