import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { text }) => {
  if (!text) throw `🔍 Please enter a search term.\n\nExample: *.wiki Unicorn*`;

  try {
    const response = await axios.get(`https://es.wikipedia.org/wiki/${encodeURIComponent(text)}`);
    const $ = cheerio.load(response.data);
    
    const title = $('#firstHeading').text().trim();
    const summary = $('#mw-content-text > div.mw-parser-output').find('p').first().text().trim();

    if (!summary) throw 'No content found.';

    m.reply(
`🦄 *Unicorn MD — Wikipedia Lookup*

📌 *Query:* ${text}
📖 *Title:* ${title}

${summary}`
    );
  } catch (e) {
    m.reply('⚠️ No results found or an error occurred. Try a different keyword.');
  }
};

handler.help = ['wiki', 'wikipedia'];
handler.tags = ['tools'];
handler.command = ['wiki', 'wikipedia'];

export default handler;
