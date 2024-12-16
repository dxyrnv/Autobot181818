const axios = require('axios');

module.exports.config = {
    name: "imagine",
    version: "1.0.0",
    credits: "rized",
    description: "Generates an image based on a prompt",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["imagin"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("Please provide a prompt for image generation.", event.threadID, event.messageID);

        api.sendMessage("Generating your image ...", event.threadID, async (err, info) => {
            try {
                const apiUrl = `https://ccprojectapis.ddns.net/api/generate-art?prompt=${encodeURIComponent(prompt)}`;
                const response = await axios.get(apiUrl);

                if (!response.data || !response.data.url) {
                    return api.sendMessage("Failed to retrieve image.", event.threadID, event.messageID);
                }

                // Send the generated image as an attachment
                return api.sendMessage({
                    body: 'Here is your generated image',
                    attachment: { type: 'image', payload: { url: response.data.url } }
                }, event.threadID);
            } catch (error) {
                console.error(error);
                api.sendMessage("An error occurred while generating your image.", event.threadID);
            }
        });
    } catch (s) {
        api.sendMessage(s.message, event.threadID);
    }
};
