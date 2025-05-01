let handler = async (m, { conn }) => { }; // dummy to activate plugin
handler.all = async function () { }; // keep plugin alive

import fetch from 'node-fetch';

global.conn.ev.on('group-participants.update', async (update) => {
  try {
    const metadata = await conn.groupMetadata(update.id);
    const participants = update.participants;

    for (const user of participants) {
      const groupMemberCount = metadata.participants.length;
      const name = await conn.getName(user);
      const profilePic = await conn.profilePictureUrl(user, 'image').catch(() => 'https://i.imgur.com/RvEKtPJ.jpeg');

      // 🌈 Welcome
      if (update.action === 'add' && process.env.WELCOME_MSG === 'true') {
        const welcome = `🦄 *Sparkle Alert!* 🦄\n\n@${user.split('@')[0]} just joined the magic in *${metadata.subject}*! 🌟\nLet's shower them with glitter and good vibes! ✨\n\n👥 We are now *${groupMemberCount}* unicorns strong!`;

        await conn.sendMessage(update.id, {
          image: { url: profilePic },
          caption: welcome,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363200367779016@newsletter',
              newsletterName: 'Unicorn MD: WELCOME 🌈',
              serverMessageId: 143
            }
          }
        });
      }

      // 🕊 Farewell
      if (update.action === 'remove' && process.env.GOODBYE_MSG === 'true') {
        const goodbye = `🌌 *A Unicorn Flies Away...* \n\n@${user.split('@')[0]} has left the enchanted realm of *${metadata.subject}* 🕊️\nWishing them stardust and smooth travels ahead! 💫\n\n👥 We are now *${groupMemberCount - 1}* magical beings.`;

        await conn.sendMessage(update.id, {
          image: { url: profilePic },
          caption: goodbye,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363200367779016@newsletter',
              newsletterName: 'Unicorn MD: GOODBYE 💔',
              serverMessageId: 143
            }
          }
        });
      }
    }
  } catch (e) {
    console.error('[Group Welcome/Goodbye Error]', e);
  }
});

export default handler;
