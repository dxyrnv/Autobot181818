const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "xmascap",
  version: "1.0.0",
  role: 0,
  credits: "Rized",
  aliases: [],
  usages: "< reply to an image > [color]",
  cooldown: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let pathie = __dirname + `/cache/xmascap-image.jpg`;
  const { threadID, messageID } = event;

  // Get the image URL from the reply
  const imageUrl = event.messageReply?.attachments[0]?.url;
  const color = args[0] || "red"; // Default color is red if not provided

  if (!imageUrl) {
    return api.sendMessage("❌ Please reply to an image to xmascap choose cap red or blue.", threadID, messageID);
  }

  try {
    api.sendMessage("🎅 Adding Christmas cap, please wait...", threadID, messageID);

    // Call the Christmas cap API
    const xmasCapUrl = `https://kaiz-apis.gleeze.com/api/xmas-cap?imageUrl=${encodeURIComponent(imageUrl)}&color=${encodeURIComponent(color)}`;

    // Fetch the processed image
    const img = (await axios.get(xmasCapUrl, { responseType: "arraybuffer" })).data;

    // Save the image to the file system
    fs.writeFileSync(pathie, Buffer.from(img, 'utf-8'));

    // Send the image with the Xmas cap back to the user
    api.sendMessage({
      body: `🎄| Christmas cap added successfully with color: ${color}`,
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
  } catch (error) {
    api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};
