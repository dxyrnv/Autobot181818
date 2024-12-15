module.exports.config = {
    name: "sadcat",
    version: "1.0.0",
    role: 0,
    credits: "Rized",
    description: "Generate a Sad Cat-style image",
    hasPrefix: false,
    aliases: ["sadcat"],
    usage: "[sadcat <text>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const text = args.join(" ");
        if (!text) {
            api.sendMessage("Usage: sadcat <text>", event.threadID);
            return;
        }

        const encodedText = encodeURIComponent(text);
        const url = `https://kaiz-apis.gleeze.com/api/sadcat?text=${encodedText}`;
        const imagePath = path.join(__dirname, "sadcat_image.png");

        api.sendMessage("Generating your Sad Cat-style image, please wait...", event.threadID);

        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            try {
                await api.sendMessage({
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID);

                fs.unlinkSync(imagePath);
            } catch (sendError) {
                console.error('Error sending image:', sendError);
                api.sendMessage("An error occurred while sending the image.", event.threadID);
            }
        });

        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
