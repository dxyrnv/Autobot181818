const axios = require('axios');

module.exports.config = {
  name: 'aniquotes',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['aniquotes', 'animequote'],
  description: 'Fetch a random anime quote!',
  usage: 'aniquotes',
  credits: 'Rized',
  cooldown: 3,
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage('⚙ Fetching a random anime quote, please wait...', event.threadID, event.messageID);

  try {
    const response = await axios.get('https://h-anime-quote-api.vercel.app/anime-quote');
    const quoteData = response.data.data;

    const anime = quoteData.anime.name;
    const character = quoteData.character.name;
    const quote = quoteData.content;

    if (!quote || !anime || !character) {
      return api.sendMessage(
        '🥺 Sorry, I couldn\'t find an anime quote.',
        event.threadID,
        event.messageID
      );
    }

    const message = `📝 Anime Quote:\n\n🖋️ "${quote}"\n\n👤 ${character} (${anime})`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred: ${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
