const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "removebg",
  version: "1.0.0",
  role: 0,
  credits: "Harith",
  aliases: [],
  usages: "< reply image >",
  cd: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  // Get the image URL from the reply or from arguments
  let imageUrl = event.messageReply?.attachments[0]?.url || args.join(" ");

  // Check if an image URL was provided
  if (!imageUrl) {
    return api.sendMessage(
      "𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 \"𝗿𝗲𝗺𝗼𝘃𝗲𝗯𝗴\" 𝘁𝗼 𝗿𝗲𝗺𝗼𝘃𝗲 𝗶𝘁𝘀 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱.",
      threadID,
      messageID
    );
  }

  try {
    // Notify the user that the background removal process is starting
    api.sendMessage(
      "⌛ 𝗥𝗲𝗺𝗼𝘃𝗶𝗻𝗴 𝗯𝗮𝗰𝗸𝗴𝗿𝗼𝘂𝗻𝗱 𝗶𝗺𝗮𝗴𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...",
      threadID,
      messageID
    );

    // Make the API call to remove the background
    const removeBgUrl = `https://ccprojectapis.ddns.net/api/removebg?url=${encodeURIComponent(imageUrl)}`;

    // Send the processed image back to the user
    api.sendMessage(
      {
        attachment: {
          type: 'image',
          payload: {
            url: removeBgUrl
          }
        }
      },
      threadID,
      messageID
    );
  } catch (error) {
    // Handle any errors that occur during processing
    api.sendMessage(
      `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}`,
      threadID,
      messageID
    );
  }
};
