const axios = require('axios');

module.exports.config = {
  name: 'motivation',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['motivate', 'quote'],
  description: "Fetch a random motivation quote",
  usage: "motivation",
  credits: 'developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('⚙ Fetching a motivation quote, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://aryanchauhanapi.onrender.com/api/motivation');
    const motivation = response.data.motivation;

    if (!motivation) {
      api.sendMessage(
        "🥺 Sorry, I couldn't find a motivation quote.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const message = `💡 Here is the motivation:\n\n${motivation}`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching the motivation quote: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
