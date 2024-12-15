const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "remini",
  version: "1.0.0",
  role: 0,
  credits: "Developer",
  aliases: [],
  usages: "< reply image >",
  cooldown: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let pathie = __dirname + `/cache/upscaled-image.jpg`;
  const { threadID, messageID } = event;

  // Get the image URL from the reply or from arguments
  var imageUrl = event.messageReply?.attachments[0]?.url || args.join(" ");

  try {
    api.sendMessage("⌛ enhancing image, please wait...", threadID, messageID);

    // Call the upscale image API
    const upscaleUrl = `https://ccprojectapis.ddns.net/api/upscale?url=${encodeURIComponent(imageUrl)}`;

    // Fetch the processed image
    const img = (await axios.get(upscaleUrl, { responseType: "arraybuffer" })).data;

    // Save the image to the file system
    fs.writeFileSync(pathie, Buffer.from(img, 'utf-8'));

    // Send the upscaled image back to the user
    api.sendMessage({
      body: "🪄| Image enhanced successfully",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
  } catch (error) {
    api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};
