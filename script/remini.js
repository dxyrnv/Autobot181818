const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "remini",
  version: "1.0.0",
  role: 0,
  credits: "dev",
  aliases: [],
  usages: "< reply image >",
  cooldown: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let pathie = __dirname + `/cache/zombie.jpg`;
  const { threadID, messageID } = event;

  // Get the image URL from the reply or from arguments
  var mark = event.messageReply?.attachments[0]?.url || args.join(" ");

  try {
    api.sendMessage("Enhancing photo please wait.....", threadID, messageID);

    // Call the Remini API to process the image
    const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/api/remini?inputImage=${encodeURIComponent(mark)}`);
    const processedImageURL = response.data.image_data;

    // Fetch the processed image
    const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

    // Save the image to the file system
    fs.writeFileSync(pathie, Buffer.from(img, 'utf-8'));

    // Send the processed image back to the user
    api.sendMessage({
      body: "✨ Enhanced successfully",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
  } catch (error) {
    api.sendMessage(`Error processing image: ${error.message}`, threadID, messageID);
  };
};
