const axios = require('axios');

module.exports = {
  name: 'riddle',
  description: 'fetch a random riddle for some fun!',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗶𝗱𝗱𝗹𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://fetching-riddle-api.vercel.app/random');
      const data = response.data;

      if (!data || !data.riddle) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗿𝗶𝗱𝗱𝗹𝗲." }, pageAccessToken);
      }

      const riddle = data.riddle;
      sendMessage(senderId, { text: `🧩 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗿𝗶𝗱𝗱𝗹𝗲:\n\n${riddle}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};