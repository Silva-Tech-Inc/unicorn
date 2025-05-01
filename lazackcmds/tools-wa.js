let handler = async (m, { conn, usedPrefix, text, command }) => {
  let waLin = '';

  // Check for different ways to get the phone number
  if (text) {
    waLin = text.replace(/[^0-9]/g, '');
  } else if (m.quoted) {
    waLin = m.quoted.sender.replace(/[^0-9]/g, '');
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    waLin = m.mentionedJid[0].replace(/[^0-9]/g, '');
  } else {
    throw `⚠️ Please provide a valid number, quote a user, or mention a user.`;
  }

  // Construct the WhatsApp link
  const waLink = `https://wa.me/${waLin}`;
  const message = `📱 *Your WhatsApp Link:*\n\n${waLink}`;

  // Send the message with the link
  conn.sendMessage(m.chat, { text: message, quoted: m, contextInfo: { mentionedJid: [m.sender] } });

  // React with a success emoji
  m.react('✅');
}

handler.help = ['wa'];
handler.tags = ['tools'];
handler.command = ['wa'];

export default handler;
