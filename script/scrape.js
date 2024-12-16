const axios = require('axios');

module.exports.config = {
  name: 'scrape',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['htmlscraper'],
  description: 'Scrape HTML content from a provided URL',
  usage: 'scrape [URL]',
  credits: 'dev',
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const senderId = event.senderID;

  if (args.length === 0) {
    api.sendMessage(
      "❌ Please provide a URL to scrape. Example: 'scrape https://example.com'",
      event.threadID,
      event.messageID
    );
    return;
  }

  const url = args[0];
  const apiUrl = `https://kaiz-apis.gleeze.com/api/scrape?url=${encodeURIComponent(url)}`;

  api.sendMessage("Processing your request, please wait...", event.threadID, async (err, info) => {
    if (err) return;

    try {
      const response = await axios.get(apiUrl);
      const htmlData = response.data.data;

      const maxMessageLength = 2000;
      const messages = htmlData.length > maxMessageLength
        ? splitMessageIntoChunks(htmlData, maxMessageLength)
        : [htmlData];

      for (const message of messages) {
        await api.sendMessage(message, event.threadID);
      }
    } catch (error) {
      api.editMessage("An error occurred while processing your request.", info.messageID);
    }
  });
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
