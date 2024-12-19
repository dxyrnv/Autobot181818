const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'upscalev2',
  version: '1.0.0',
  role: 0,
  aliases: ['enhancev2'],
  description: 'Upscale an image to higher resolution using version 2 of the API',
  usage: '<reply to an image>',
  credits: 'Rized',
  cooldown: 3,
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;

  // Check if the message is a reply to an image
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    return api.sendMessage(
      '❌ Please reply to an image to upscale it!',
      threadID,
      messageID
    );
  }

  const tempFilePath = __dirname + '/cache/upscaled-v2.jpg';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/upscale-v2?url=${encodeURIComponent(imageUrl)}`;

  // Notify the user about the upload process
  api.sendMessage(
    '🔼 Upscaling the image (v2), please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the upscaled image
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Save the image to a temporary file
        fs.writeFileSync(tempFilePath, buffer);

        // Send the upscaled image back to the user
        api.sendMessage(
          {
            body: '✅ Your image has been upscaled (v2)!',
            attachment: fs.createReadStream(tempFilePath),
          },
          threadID,
          () => fs.unlinkSync(tempFilePath),
          messageID
        );
      } catch (error) {
        console.error('Error during upscaling (v2):', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
