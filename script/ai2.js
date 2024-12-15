const axios = require('axios');

module.exports.config = {
  name: 'ai2',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt4', 'assistant'],
  description: 'Interact with an AI assistant',
  usage: 'ai [your message]',
  credits: 'coffee',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const senderId = event.senderID;
  const input = args.join(' ').trim() || 'hello';
  const systemRole = 'You are Tr1pZzey AI, a helpful and friendly assistant.';
  const prompt = `${systemRole}\n${input}`;
  const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;

  if (!input) {
    api.sendMessage(
      "Please provide a message after 'ai'. Example: 'ai How are you?'",
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
        // Make the API request
        const { data: { response } } = await axios.get(apiUrl);

        // Split the response into manageable chunks
        const parts = [];
        for (let i = 0; i < response.length; i += 1999) {
          parts.push(response.substring(i, i + 1999));
        }

        // Send the response back to the user
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
