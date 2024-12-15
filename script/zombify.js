const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "zombify",
  version: "1.0.0",
  role: 0,
  credits: "Rized",
  aliases: [],
  usages: "< reply to an image >",
  cooldown: 2,
};

module.exports.run = async ({ api, event }) => {
  let pathie = __dirname + `/cache/zombified-image.jpg`;
  const { threadID, messageID } = event;

  // Get the image URL from the reply
  const imageUrl = event.messageReply?.attachments[0]?.url;

  if (!imageUrl) {
    return api.sendMessage("❌ Please reply to an image to use the zombify feature.", threadID, messageID);
  }

  try {
    api.sendMessage("⌛ Creating zombie effect, please wait...", threadID, messageID);

    // Call the zombie API
    const zombifyUrl = `https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`;

    // Fetch the processed image
    const img = (await axios.get(zombifyUrl, { responseType: "arraybuffer" })).data;

    // Save the image to the file system
    fs.writeFileSync(pathie, Buffer.from(img, 'utf-8'));

    // Send the zombified image back to the user
    api.sendMessage({
      body: "🧟| Zombie effect applied successfully!",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
  } catch (error) {
    api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};
