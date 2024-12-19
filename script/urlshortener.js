const axios = require('axios');

module.exports.config = {
  name: 'urlshortener',
  version: '1.0.0',
  role: 0,
  aliases: ['shortlink'],
  description: 'Shorten a URL using the URL Shortener API',
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

  const apiUrl = `https://kaiz-apis.gleeze.com/api/url-shortener?upload=${encodeURIComponent(urlToShorten)}`;

  // Notify the user about the process
  api.sendMessage(
    '🔗 Shortening the URL, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the shortened URL
        const response = await axios.get(apiUrl);
        const { shortUrl } = response.data;

        if (shortUrl) {
          // Successfully shortened the URL
          api.sendMessage(
            `✅ URL shortened successfully!\n🌐 Shortened URL: ${shortUrl}`,
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
        console.error('Error during URL shortening:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
