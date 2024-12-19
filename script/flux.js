const axios = require('axios');

module.exports.config = {
  name: "flux",
  version: "1.0.0",
  credits: "Rized",
  description: "Generates an image based on the provided prompt using Flux API",
  hasPrefix: false,
  cooldown: 5,
  aliases: ["fluximage"],
};

module.exports.run = async function ({ api, event, args }) {
  try {
    // Join all arguments into a single string as the prompt
    let prompt = args.join(" ");
    
    if (!prompt) {
      return api.sendMessage("❌ Please provide a prompt for image generation.", event.threadID, event.messageID);
    }

    api.sendMessage("🖼️ Generating your image using Flux API, please wait...", event.threadID, async (err, info) => {
      if (err) return;

      try {
        // Construct the API URL with the prompt
        const apiUrl = `https://kaiz-apis.gleeze.com/api/flux-1.1-pro?prompt=${encodeURIComponent(prompt)}`;
        
        // Call the API to generate the image
        const response = await axios.get(apiUrl);

        // Check if the response contains an image URL
        if (response.data && response.data.imageUrl) {
          const imageUrl = response.data.imageUrl;

          // Send the generated image to the user
          api.sendMessage({
            body: '✅ Here is your generated image from Flux API:',
            attachment: imageUrl,
          }, event.threadID);
        } else {
          // Handle failure in retrieving the image
          api.sendMessage("❌ Failed to generate the image. Please try again.", event.threadID);
        }
      } catch (error) {
        console.error("Error during image generation:", error);
        api.sendMessage("❌ An error occurred while generating your image. Please try again later.", event.threadID);
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    api.sendMessage("❌ An unexpected error occurred. Please try again.", event.threadID);
  }
};
