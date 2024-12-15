const axios = require('axios');

module.exports.config = {
    name: "geminiv",
    role: 0,
    credits: "developer",
    description: "Interact with Gemini 1.5 Flash Vision",
    hasPrefix: false,
    version: "1.0.0",
    aliases: ["gemini"],
    usage: "gemini [reply to photo or provide description]",
};

module.exports.run = async function ({ api, event, args }) {
    const prompt = args.join(" ").trim();

    // Check if prompt or image is missing
    if (!prompt && (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo")) {
        return api.sendMessage(
            '❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲.',
            event.threadID,
            event.messageID
        );
    }

    // Handle image URL
    let imageUrl = "";
    if (event.messageReply && event.messageReply.attachments[0].type === "photo") {
        imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
    }

    // Indicate typing
    api.sendTypingIndicator(event.threadID);

    // Send processing message
    api.sendMessage(
        '👽 𝗚𝗘𝗠𝗜𝗡𝗜 𝟭.𝟱\n━━━━━━━━━━━━━━━━━━\nRecognizing picture or processing your query, please wait...\n━━━━━━━━━━━━━━━━━━',
        event.threadID
    );

    try {
        // Make API request
        const apiUrl = `https://api.joshweb.click/gemini`;
        const response = await axios.get(apiUrl, {
            params: {
                prompt,
                url: imageUrl,
            },
        });

        const description = response.data.gemini;

        // Get response time in Manila timezone
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        // Send formatted response
        return api.sendMessage(
            `👽 𝗚𝗘𝗠𝗜𝗡𝗜 𝟭.𝟱 𝗙𝗹𝗮𝘀𝗵 𝗩𝗶𝘀𝗶𝗼𝗻 𝗩𝟮 ♊\n━━━━━━━━━━━━━━━━━━\n${description}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        console.error("Error in Gemini command:", error);

        // Handle errors
        return api.sendMessage(
            '❌ | An error occurred while processing your request.',
            event.threadID,
            event.messageID
        );
    }
};
