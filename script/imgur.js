const axios = require('axios');

module.exports.config = {
  name: 'imgur',
  version: '1.0.0',
  role: 0,
  aliases: ['uploadimg'],
  description: 'Upload an image to Imgur and get the link',
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
      '❌ Please reply to an image to upload it to Imgur!',
      threadID,
      messageID
    );
  }

  // Construct the API URL
  const apiUrl = `https://kaiz-apis.gleeze.com/api/imgur?url=${encodeURIComponent(imageUrl)}`;

  // Notify the user about the upload process
  api.sendMessage(
    '🌐 Uploading the image to Imgur, please wait...',
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Make the API request
        const response = await axios.get(apiUrl);
        const { link } = response.data;

        if (link) {
          // Successfully uploaded
          api.sendMessage(
            `✅ Image uploaded successfully!\n🌐 Link: ${link}`,
            threadID,
            messageID
          );
        } else {
          // Handle upload failure
          api.editMessage(
            '❌ Failed to upload the image. Please try again.',
            info.messageID
          );
        }
      } catch (error) {
        // Handle errors
        console.error('Error during image upload:', error);
        api.editMessage(
          '❌ An error occurred while processing your request. Please try again later.',
          info.messageID
        );
      }
    }
  );
};
