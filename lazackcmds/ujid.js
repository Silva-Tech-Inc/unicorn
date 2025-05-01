let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.quoted) {
    return m.reply('📩 Please *reply to a message* within the group to use this command.');
  }

  if (!m.isGroup) {
    return m.reply('👥 This command only works in *group chats*.');
  }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const members = groupMetadata.participants;

    if (!members || members.length === 0) {
      return m.reply('🚫 No members found in this group.');
    }

    const ids = members.map(member => member.id).join(', ');

    m.reply(`🦄 *Unicorn MD — JID Extractor*\n\n📛 Group: *${groupMetadata.subject}*\n\n🧩 *Member JIDs:* \n${ids}`);
  } catch (error) {
    console.error('❗ Error fetching group participants:', error);
    m.reply('⚠️ An error occurred. Ensure the bot has admin rights and try again.');
  }
};

handler.help = ['ujid'];
handler.tags = ['tools'];
handler.command = ['ujid'];

export default handler;
