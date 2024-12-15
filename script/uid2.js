const axios = require('axios');

module.exports.config = {
  name: 'uid2',
  version: '1.0.0',
  role: 1,
  aliases: ['finduid', 'facebookid'],
  description: 'Retrieve Facebook UID from a profile URL',
  usage: 'uid [Facebook profile URL]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const profileUrl = args.join(' ').trim();

  if (!profileUrl) {
    api.sendMessage(
      '❌ Usage: uid [Facebook profile URL]\nExample: uid https://www.facebook.com/username',
      event.threadID,
      event.messageID
    );
    return;
  }

  api.sendMessage(
    '🔍 Retrieving Facebook UID, please wait...',
    event.threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Call the Facebook UID retrieval API
        const apiUrl = 'https://api.joshweb.click/api/findid';
        const { data } = await axios.get(apiUrl, { params: { url: profileUrl } });

        if (data.status && data.result) {
          const message = `🎯 Facebook ID: ${data.result}`;
          api.sendMessage(message, event.threadID);
        } else {
          throw new Error('Unable to retrieve Facebook ID');
        }
      } catch (error) {
        console.error('Error retrieving Facebook ID:', error);
        api.editMessage(
          '❌ Error retrieving Facebook ID. Please try again or check your input.',
          info.messageID
        );
      }
    }
  );
};
