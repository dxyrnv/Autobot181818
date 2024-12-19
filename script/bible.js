const axios = require('axios');

module.exports.config = {
  name: 'bible',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['bible', 'verse'],
  description: "Fetch a random Bible verse",
  usage: "randombibleverse",
  credits: 'Rized', // Replace with your desired author name
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('⚙ Fetching a random Bible verse, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://aryanchauhanapi.onrender.com/api/bible');
    const { verse } = response.data;

    if (!verse) {
      return api.sendMessage(
        "🥺 Sorry, I couldn't find a Bible verse.",
        event.threadID,
        event.messageID
      );
    }

    const message = {
      body: `📖 Here is a random Bible verse for you:\n\n*${verse}*`,
      mentions: [
        {
          tag: `@${event.senderID}`,
          id: event.senderID
        }
      ]
    };

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching the Bible verse: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
