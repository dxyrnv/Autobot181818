const axios = require('axios');

module.exports.config = {
  name: 'adobo',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gptadobo', 'askadobo'],
  description: 'Ask Adobo GPT a question',
  usage: 'adobo [your query]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const userInput = args.join(' ').trim();

  if (!userInput) {
    api.sendMessage(
      '❌ Please provide your query after "adobo". Example: "adobo What is adobo?"',
      event.threadID,
      event.messageID
    );
    return;
  }

  api.sendMessage(
    '🕧 | Searching for Adobo GPT, please wait...',
    event.threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Delay for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Call the Adobo GPT API
        const apiUrl = `https://markdevs-last-api-2epw.onrender.com/api/adobo/gpt?query=${encodeURIComponent(userInput)}`;
        const { data } = await axios.get(apiUrl);

        if (data && data.result) {
          const adoboResponse = data.result;
          const responseTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Manila',
            hour12: true,
          });

          const message = `🥘 Adobo GPT 🐔\n━━━━━━━━━━━━━━━\n${adoboResponse}\n━━━━━━━━━━━━━━━\n⏰ Response Time: ${responseTime}`;
          api.sendMessage(message, event.threadID);
        } else {
          console.error('API response did not contain expected data:', data);
          api.editMessage(
            '❌ An error occurred while fetching the Adobo GPT response. Please try again later.',
            info.messageID
          );
        }
      } catch (error) {
        console.error('Error calling Adobo API:', error);
        api.editMessage(
          `❌ An error occurred while fetching the data. Error details: ${error.message}`,
          info.messageID
        );
      }
    }
  );
};
