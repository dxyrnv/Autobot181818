const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: 'imghippo',
  version: '1.0.0',
  role: 0,
  aliases: ['hippoupload'],
  description: 'Upload an image to ImgHippo and get the link',
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
      '❌ Please reply to an image to upload it to ImgHippo!',
      threadID,
      messageID
    );
  }

  const apiUrl = `https://kaiz-apis.gleeze.com/api/imghippo?uploadImageUrl=${encodeURIComponent(imageUrl)}`;

  // Notify the user about the process
  api.sendMessage(
    '🌐 Uploading the image to ImgHippo, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch the uploaded image link
        const response = await axios.get(apiUrl);
        const { link } = response.data;

        if (link) {
          // Successfully uploaded
          api.sendMessage(
            `✅ Image uploaded successfully!\n🌐 ImgHippo Link: ${link}`,
            threadID,
            messageID
          );
        } else {
          // Handle failure
          api.editMessage(
            '❌ Failed to upload the image. Please try again.',
            info.messageID
          );
        }
      } catch (error) {
        console.error('Error during ImgHippo upload:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
