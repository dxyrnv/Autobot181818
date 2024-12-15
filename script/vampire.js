const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'vampire',
  version: '1.0.0',
  role: 0,
  aliases: ['vampify'],
  description: 'Transform an image into a vampire version',
  usage: '<reply to an image>',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  const imageUrl = messageReply?.attachments?.[0]?.url;

  if (!imageUrl) {
    api.sendMessage(
      '❌ Please reply to an image to vampify it!',
      threadID,
      messageID
    );
    return;
  }

  const pathie = __dirname + '/cache/vampire.jpg';
  const apiUrl = `https://kaiz-apis.gleeze.com/api/vampire?imageUrl=${encodeURIComponent(imageUrl)}`;

  api.sendMessage(
    '🦇 Vampifying the image, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the vampirized image
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        // Save the image to a temporary file
        fs.writeFileSync(pathie, buffer);

        // Send the transformed image back to the user
        api.sendMessage(
          {
            body: '🧛 Your vampire transformation is complete!',
            attachment: fs.createReadStream(pathie),
          },
          threadID,
          () => fs.unlinkSync(pathie),
          messageID
        );
      } catch (error) {
        console.error('Error during vampirization:', error);
        api.editMessage(
          '❌ An error occurred while processing the image. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
