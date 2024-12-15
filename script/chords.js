const axios = require('axios');

module.exports.config = {
  name: 'chords',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['songchords', 'guitar'],
  description: 'Fetch song chords',
  usage: 'chords [song title or artist]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(' ').trim();

  if (!query) {
    api.sendMessage(
      "Please provide the song title or artist to search for chords. Example: 'chords Perfect by Ed Sheeran'",
      event.threadID,
      event.messageID
    );
    return;
  }

  const apiUrl = `https://markdevs-last-api-2epw.onrender.com/search/chords?q=${encodeURIComponent(query)}`;

  api.sendMessage(
    "🎶 Searching for chords, please wait...",
    event.threadID,
    async (err, info) => {
      if (err) return;

      try {
        // Fetch chords from the API
        const { data: { chord: result } } = await axios.get(apiUrl);

        if (result && result.chords) {
          const chordsMessage = `🎸 Title: ${result.title}\n🎤 Artist: ${result.artist}\n🎵 Key: ${result.key}\n\n${result.chords}`;

          // Split long messages into chunks
          const maxMessageLength = 2000;
          const parts = [];
          for (let i = 0; i < chordsMessage.length; i += maxMessageLength) {
            parts.push(chordsMessage.slice(i, i + maxMessageLength));
          }

          // Send chunks one by one
          for (const part of parts) {
            await api.sendMessage(part, event.threadID);
          }

          // If there's a URL, send it as well
          if (result.url) {
            api.sendMessage(`📥 You can also view the chords here: ${result.url}`, event.threadID);
          }
        } else {
          api.editMessage(
            "Sorry, no chords were found for your query.",
            info.messageID
          );
        }
      } catch (error) {
        console.error('Error calling Chords API:', error);
        api.editMessage(
          "An error occurred while fetching the chords. Please try again later.",
          info.messageID
        );
      }
    }
  );
};
