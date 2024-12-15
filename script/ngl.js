const axios = require('axios');

module.exports.config = {
  name: "nglspam",
  version: "1.0.1",
  role: 0,
  hasPrefix: false,
  credits: "tukmol",
  description: "Sends a specified message multiple times to a given username using NGL API.",
  usages: "nglspam [username] [message] [amount]",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const username = args[0];
  const amount = parseInt(args[args.length - 1], 10);
  const message = args.slice(1, args.length - 1).join(' ');

  if (!username || !message || isNaN(amount) || amount <= 0) {
    return api.sendMessage('Usage: nglspam [username] [message] [amount]', threadID, messageID);
  }

  api.sendMessage('⚙️ Processing your request to send messages to NGL username...', threadID, messageID);

  for (let i = 0; i < amount; i++) {
    try {
      const response = await axios.get('https://nash-rest-api-production.up.railway.app/ngl', {
        params: {
          username,
          message,
          deviceId: 'myDevice',
          amount: 1
        }
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  api.sendMessage('All messages successfully sent ✅.', threadID, messageID);
};