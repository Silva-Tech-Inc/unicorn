import { xvideosSearch, xvideosdl } from '../lib/scraper.js';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender].age;

  if (!chat.nsfw) {
    throw `🚫 *NSFW Mode is disabled in this group.*\n\n🛠️ To enable it, use: *${usedPrefix}enable nsfw*`;
  }

  if (user < 18) {
    throw `🔞 *Access Denied.* You must be 18+ to use this command.`;
  }

  if (!text) {
    throw `📌 *Usage Guide:*\nSearch example:\n*${usedPrefix + command} hot latina*\n\nLink example:\n*${usedPrefix + command} https://www.xvideos.com/video...*`;
  }

  m.react('⌛'); // Show loading reaction

  const isURL = /^(https?:\/\/)?(www\.)?xvideos\.com\/.+$/i.test(text);

  try {
    if (isURL) {
      // Direct download
      const result = await xvideosdl(text);
      const { title, url } = result.result;

      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      await conn.sendFile(
        m.chat,
        Buffer.from(buffer),
        `${title}.mp4`,
        `🦄 *Unicorn MD* - Xvideos Download\n\n🎬 *Title:* ${title}`,
        m
      );
    } else {
      // Perform search
      const results = await xvideosSearch(text);

      if (!results.length) {
        return m.reply(`🔍 No results found for *"${text}"*.`);
      }

      const formattedResults = results
        .map(
          (r, i) =>
            `🔸 *${i + 1}. ${r.title}*\n🕒 Duration: ${r.duration}\n📶 Quality: ${r.quality}\n🔗 URL: ${r.url}`
        )
        .join('\n\n');

      m.reply(`📽️ *Search Results for:* "${text}"\n\n${formattedResults}`);
    }
  } catch (err) {
    console.error(err);
    throw '🚫 *Error while fetching Xvideos content. Please try again later.*';
  }
};

handler.help = ['xvid'];
handler.tags = ['nsfw'];
handler.command = ['xvid'];
handler.group = true;
handler.premium = false;
handler.register = true;

export default handler;
