const axios = require('axios');

module.exports.config = {
  name: 'tinyurl',
  version: '1.0.0',
  role: 0,
  aliases: ['shorturls'],
  description: 'Shorten a URL using TinyURL API',
  usage: '<url>',
  credits: 'Rized',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // Ensure a URL is provided
  const urlToShorten = args[0];
  if (!urlToShorten) {
    return api.sendMessage(
      '❌ Please provide a URL to shorten!',
      threadID,
      messageID
    );
  }

  // Construct the API URL
  const apiUrl = `https://kaiz-apis.gleeze.com/api/tinyurl?upload=${encodeURIComponent(urlToShorten)}`;

  // Notify the user about the process
  api.sendMessage(
    '🔗 Shortening the URL, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the shortened URL
        const response = await axios.get(apiUrl);
        const { tinyurl } = response.data;

        if (tinyurl) {
          // Successfully shortened
          api.sendMessage(
            `✅ URL shortened successfully!\n🌐 TinyURL: ${tinyurl}`,
            threadID,
            messageID
          );
        } else {
          // Handle failure
          api.editMessage(
            '❌ Failed to shorten the URL. Please try again.',
            info.messageID
          );
        }
      } catch (error) {
        // Handle errors
        console.error('Error during URL shortening:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
