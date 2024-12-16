module.exports.config = {
    name: "bogart",
    version: "1.0.0",
    role: 0,
    credits: "Rized",
    description: "Generate a Bogart-style image",
    hasPrefix: false,
    aliases: ["bogart"],
    usage: "[bogart <text>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const text = args.join(" ");
        if (!text) {
            api.sendMessage("Usage: bogart <text>", event.threadID);
            return;
        }

        const encodedText = encodeURIComponent(text);
        const url = `https://api-canvass.vercel.app/bogart?text=${encodedText}`;
        const imagePath = path.join(__dirname, "bogart_image.png");

        api.sendMessage("Generating your Bogart-style image, please wait...", event.threadID);

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
