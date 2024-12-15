const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt3', 'imageai'],
  description: "Recognize or generate images using AI",
  usage: "ai3 [description] or reply to an image",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ').trim();
  const senderId = event.senderID;

  // Send a prompt if no input or image is provided
  if (!input && !event.messageReply?.attachments?.[0]?.url) {
    api.sendMessage(
      "[ AI3 ]\n\n❌ Provide a description for image generation or reply to an image for recognition.",
      event.threadID,
      event.messageID
    );
    return;
  }

  // Notify the user of processing
  const waitingMessage = "[ AI3 ]\n\n⌛ Processing your request, please wait...";
  api.sendMessage(waitingMessage, event.threadID, (err, info) => {
    if (err) return;

    (async () => {
      try {
        let imageUrl = "";

        // Handle image from reply
        if (event.messageReply?.attachments?.[0]?.type === 'photo') {
          imageUrl = event.messageReply.attachments[0].url;
        }

        // API Call
        const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o-pro";
        const { data } = await axios.get(apiUrl, {
          params: {
            q: input || "",
            uid: "conversational",
            imageUrl: imageUrl || ""
          }
        });

        const result = data.response;

        // Handle image generation
        if (result.includes('TOOL_CALL: generateImage')) {
          const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);

          if (imageUrlMatch && imageUrlMatch[1]) {
            const generatedImageUrl = imageUrlMatch[1];
            api.sendMessage(
              {
                attachment: {
                  type: 'photo',
                  payload: { url: generatedImageUrl }
                }
              },
              event.threadID,
              event.messageID
            );
            return;
          }
        }

        // Send text response
        const maxMessageLength = 2000;
        if (result.length > maxMessageLength) {
          const chunks = splitMessageIntoChunks(result, maxMessageLength);
          for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 500));
            api.sendMessage(chunk, event.threadID);
          }
        } else {
          api.editMessage(result, info.messageID);
        }
      } catch (error) {
        console.error("Error in AI3 command:", error);
        api.editMessage(
          "[ AI3 ]\n\n❌ Error: " + (error.message || "Something went wrong."),
          info.messageID
        );
      }
    })();
  });
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
