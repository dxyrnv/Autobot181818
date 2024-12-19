const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'upscale',
  version: '1.0.0',
  role: 0,
  aliases: ['increase'],
  description: 'Upscale an image to a higher resolution',
  usage: '<reply to an image>',
  credits: 'Rized',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    api.sendMessage(
      '❌ Please reply to an image to upscale it!',
      threadID,
      messageID
    );
    return;
  }

  const pathie = __dirname + '/cache/upscaled.jpg';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/upscale?url=${encodeURIComponent(imageUrl)}`;

  api.sendMessage(
    '🔼 Upscaling the image, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the upscaled image
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        // Save the image to a temporary file
        fs.writeFileSync(pathie, buffer);

        // Send the upscaled image back to the user
        api.sendMessage(
          {
            body: '⬆️ Your image has been upscaled!',
            attachment: fs.createReadStream(pathie),
          },
          threadID,
          () => fs.unlinkSync(pathie),
          messageID
        );
      } catch (error) {
        console.error('Error during upscaling:', error);
        api.editMessage(
          '❌ An error occurred while processing the image. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
