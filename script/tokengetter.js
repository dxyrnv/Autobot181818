const axios = require('axios');

module.exports.config = {
  name: "tokengetter",
  version: "1.0.0",
  hasPermmsion: 0, 
  credits: "Mark Hitsuraan",
  usePrefix: true,
  description: "Get token",
  commandCategory: "getter",
  usages: "tokenget [username] [password]",
  cooldowns: 6,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const [username, password] = args; 
    if (!username || !password) { 
      return api.sendMessage("Usage: tokengetter [ username ] [ password ]", event.threadID, event.messageID);
    }

    api.sendMessage(`Getting token, please wait...`, event.threadID, event.messageID);

    const response = await axios.get(`https://markdevs-last-api-as2j.onrender.com/api/token&cookie?username=&password=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    const token = response.data.data.access_token_eaad6v7
const token2 = response.data.data.access_token
const cookie = response.data.data.cookies

  api.sendMessage(`Token Generated\n\n𝗘𝗔𝗔𝗗6𝗩7 𝗧𝗢𝗞𝗘𝗡\n${token}\n\n𝗘𝗔𝗔𝗔𝗔𝗨 𝗧𝗢𝗞𝗘𝗡\n${token2}\n\n𝗖𝗢𝗢𝗞𝗜𝗘 🍪\n${cookie}`, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while getting the token", event.threadID, event.messageID);
  }
};