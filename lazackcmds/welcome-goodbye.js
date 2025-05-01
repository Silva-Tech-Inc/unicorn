let handler = async (m, { conn }) => { }; // Unicorn MD plugin starter
handler.all = async function () { }; // Keep Unicorn MD plugin alive

import fetch from 'node-fetch';

global.conn.ev.on('group-participants.update', async (update) => {
  try {
    const metadata = await conn.groupMetadata(update.id);
    const participants = update.participants;

    for (const user of participants) {
      const groupMemberCount = metadata.participants.length;
      const name = await conn.getName(user);
      const profilePic = await conn.profilePictureUrl(user, 'image').catch(() => 'https://i.imgur.com/unicorn_default.jpg');

      // 🌈 Welcome Message
      if (update.action === 'add' && process.env.WELCOME_MSG === 'true') {
        const welcome = `🦄 *Unicorn Alert!* 🦄\n\n✨ @${user.split('@')[0]} just arrived in *${metadata.subject}*! 🌟\nRoll out the sparkle carpet, fam! 💫💖\n\n👥 We’re now *${groupMemberCount}* enchanted beings in this realm!`;

        await conn.sendMessage(update.id, {
          image: { url: profilePic },
          caption: welcome,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363200367779016@newsletter',
              newsletterName: 'Unicorn MD: ✨WELCOME✨',
              serverMessageId: 143
            }
          }
        });
      }

      // 👋 Goodbye Message
      if (update.action === 'remove' && process.env.GOODBYE_MSG === 'true') {
        const goodbye = `🌪️ *Farewell, Starwalker!* 🌌\n\n@${user.split('@')[0]} just left *${metadata.subject}* 🕊️\nTheir journey continues beyond the magical gate. 🌠\n\n👥 Remaining legends: *${groupMemberCount - 1}*`;

        await conn.sendMessage(update.id, {
          image: { url: profilePic },
          caption: goodbye,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363200367779016@newsletter',
              newsletterName: 'Unicorn MD: 💔GOODBYE💔',
              serverMessageId: 143
            }
          }
        });
      }
    }
  } catch (e) {
    console.error('[Unicorn MD Welcome/Goodbye Error]', e);
  }
});

export default handler;
