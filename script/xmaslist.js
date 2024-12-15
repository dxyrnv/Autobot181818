module.exports.config = {
    name: "xmaslist",
    version: "1.0.0",
    role: 0,
    credits: "Rized",
    description: "Generate a Christmas list-style image",
    hasPrefix: false,
    aliases: ["xmaslist"],
    usage: "[xmaslist <text1> <text2> <text3> <text4>]",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        if (args.length < 4) {
            api.sendMessage("Usage: xmaslist <text1> <text2> <text3> <text4>", event.threadID);
            return;
        }

        const [text1, text2, text3, text4] = args;
        const encodedText1 = encodeURIComponent(text1);
        const encodedText2 = encodeURIComponent(text2);
        const encodedText3 = encodeURIComponent(text3);
        const encodedText4 = encodeURIComponent(text4);
        const url = `https://kaiz-apis.gleeze.com/api/xmas-list?text1=${encodedText1}&text2=${encodedText2}&text3=${encodedText3}&text4=${encodedText4}`;
        const imagePath = path.join(__dirname, "xmaslist_image.png");

        api.sendMessage("Generating your Christmas list-style image, please wait...", event.threadID);

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
