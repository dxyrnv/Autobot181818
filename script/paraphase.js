const axios = require('axios');

module.exports.config = {
  name: 'paraphrase',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['rephrase', 'unique'],
  description: 'Paraphrase your text to make it unique',
  usage: 'paraphrase [your text]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(' ').trim() || 'test';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/paraphrase?text=${encodeURIComponent(input)}`;

  if (!input) {
    api.sendMessage(
      "Please provide text to paraphrase after 'paraphrase'. Example: 'paraphrase Rewrite this sentence to make it unique.'",
      event.threadID,
      event.messageID
    );
    return;
  }

  api.sendMessage(
    "Processing your request, please wait...",
    event.threadID,
    async (err, info) => {
      if (err) return;

      try {
        const { data: { response } } = await axios.get(apiUrl);

        const parts = [];
        const maxMessageLength = 2000;
        for (let i = 0; i < response.length; i += maxMessageLength) {
          parts.push(response.substring(i, i + maxMessageLength));
        }

        // Send the response in chunks
        for (const part of parts) {
          await api.sendMessage(part, event.threadID);
        }
      } catch (error) {
        api.editMessage(
          "An error occurred while paraphrasing your text.",
          info.messageID
        );
      }
    }
  );
};
