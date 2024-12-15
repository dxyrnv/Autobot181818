const axios = require('axios');

module.exports.config = {
  name: 'aidetector',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ai', 'detectai'],
  description: 'Detect if a text was written by AI or a human',
  usage: 'aidetector [your text]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ').trim() || 'test';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/aidetector-v2?q=${encodeURIComponent(input)}`;

  if (!input) {
    api.sendMessage(
      "Please provide text to analyze after 'aidetector'. Example: 'aidetector Is this text AI-generated?'",
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
        const { data: { ai, human, message } } = await axios.get(apiUrl);
        const fullResponse = `🤖 AI Generated: ${ai}\n🧑‍🎓 Human Generated: ${human}\n📃 Message: ${message}`;

        const parts = [];
        for (let i = 0; i < fullResponse.length; i += 1999) {
          parts.push(fullResponse.substring(i, i + 1999));
        }

        for (const part of parts) {
          await api.sendMessage(part, event.threadID);
        }
      } catch (error) {
        api.editMessage(
          "An error occurred while processing your request.",
          info.messageID
        );
      }
    }
  );
};
