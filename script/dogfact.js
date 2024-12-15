const axios = require('axios');

module.exports.config = {
  name: 'dogfact',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['dog', 'dog-fact'],
  description: "Fetch a random dog fact",
  usage: "dogfact",
  credits: 'developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage('⚙ Fetching a random dog fact, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://aryanchauhanapi.onrender.com/api/dogfact');
    const fact = response.data.fact;

    if (!fact) {
      api.sendMessage(
        "🥺 Sorry, I couldn't find a dog fact.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const message = `🐶 Here is the dog fact:\n\n${fact}`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching the dog fact: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
