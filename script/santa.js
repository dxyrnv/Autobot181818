const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'santagif',
  version: '1.0.0',
  role: 0,
  aliases: ['santa'],
  description: 'Transform an image into a Santa-themed GIF',
  usage: '<reply to an image>',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    api.sendMessage(
      '❌ Please reply to an image to create a Santa GIF!',
      threadID,
      messageID
    );
    return;
  }

  const pathie = __dirname + '/cache/santa.gif';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/santa-gif?imageUrl=${encodeURIComponent(imageUrl)}`;

  api.sendMessage(
    '🎅 Creating your Santa GIF, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        fs.writeFileSync(pathie, buffer);

        api.sendMessage(
          {
            body: '🎁 Here is your Santa-themed GIF!',
            attachment: fs.createReadStream(pathie),
          },
          threadID,
          () => fs.unlinkSync(pathie),
          messageID
        );
      } catch (error) {
        console.error('Error during Santa GIF creation:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
