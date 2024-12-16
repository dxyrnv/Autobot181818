const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'zombie',
  version: '1.0.0',
  role: 0,
  aliases: ['kupalhshs'],
  description: 'Transform an image into a zombie-themed version',
  usage: '<reply to an image>',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    api.sendMessage(
      '❌ Please reply to an image to transform it into a zombie version!',
      threadID,
      messageID
    );
    return;
  }

  const pathie = __dirname + '/cache/zombie.jpg';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`;

  api.sendMessage(
    '🧟 Transforming the image into a zombie version, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        fs.writeFileSync(pathie, buffer);

        api.sendMessage(
          {
            body: '🧟‍♂️ Here is your zombie transformation!',
            attachment: fs.createReadStream(pathie),
          },
          threadID,
          () => fs.unlinkSync(pathie),
          messageID
        );
      } catch (error) {
        console.error('Error during zombie transformation:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
