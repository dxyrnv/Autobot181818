const axios = require('axios');

module.exports.config = {
  name: 'quotes',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['quote', 'motivate'],
  description: "Fetch a random motivational quote",
  usage: "quotes",
  credits: 'Ali',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('⚙ Fetching a random quote, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://aryanchauhanapi.onrender.com/api/quote');
    const quote = response.data.quote;

    if (!quote) {
      api.sendMessage(
        "🥺 Sorry, I couldn't find a quote.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const message = `💡 Here is the quote:\n\n${quote}`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching the quote: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
