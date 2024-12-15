const axios = require('axios');

module.exports.config = {
  name: 'catfact',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['catfact', 'catinfo'],
  description: "Fetch a random cat fact",
  usage: "catfact",
  credits: 'developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('⚙ Fetching a cat fact, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://aryanchauhanapi.onrender.com/api/catfact');
    const fact = response.data.fact;

    if (!fact) {
      api.sendMessage(
        "🥺 Sorry, I couldn't find a cat fact.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const message = `🐱 Here is the cat fact:\n\n${fact}`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching the cat fact: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
