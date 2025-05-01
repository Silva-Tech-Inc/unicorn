import fetch from 'node-fetch';
import fg from 'api-dylux';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const chat = global.db.data.chats[m.chat];

  if (!chat.nsfw) {
    throw `🚫 *Contenido NSFW desactivado en este grupo.*\n\n👉 Usa: *${usedPrefix}enable nsfw* para activarlo.`;
  }

  const user = global.db.data.users[m.sender].age;
  if (user < 17) {
    throw `❎ *Acceso restringido.*\nDebes ser mayor de 18 años para usar este comando.`;
  }

  if (!text) {
    throw `🧩 *Uso correcto:*\n\n📌 Buscar contenido:\n*${usedPrefix + command} <búsqueda>*\n\n📌 Descargar desde URL:\n*${usedPrefix + command} <link de xnxx.com>*`;
  }

  m.react(rwait); // Optional loading reaction

  if (text.includes('http://') || text.includes('https://')) {
    if (!text.includes('xnxx.com')) {
      return m.reply(`❎ *Sólo se permiten enlaces de xnxx.com*`);
    }

    try {
      let xn = await fg.xnxxdl(text);
      conn.sendFile(
        m.chat,
        xn.url_dl,
        `${xn.title}.mp4`,
        `
🔞 *Descarga Completa - Unicorn NSFW*

✨ *Título:* ${xn.title}
⌚ *Duración:* ${xn.duration}
🎞️ *Calidad:* ${xn.quality}
`.trim(),
        m,
        false,
        { asDocument: chat.useDocument }
      );
      m.react(done);
    } catch (e) {
      console.error(e);
      m.reply(`🔴 *Error inesperado. Intenta más tarde.*`);
    }
  } else {
    try {
      let res = await fg.xnxxSearch(text);
      if (res.status) {
        let resultText = res.result
          .map(
            (v, i) =>
              `🔹 *${i + 1}.*\n📌 *Título:* ${v.title}\n🔗 *Link:* ${v.link}\n`
          )
          .join('\n');
        m.reply(`📑 *Resultados encontrados:*\n\n${resultText}`);
      } else {
        m.reply(`⚠️ *No se encontraron resultados.*`);
      }
    } catch (e) {
      console.error(e);
      m.reply(`🔴 *Error durante la búsqueda. Intenta más tarde.*`);
    }
  }
};

handler.help = ['xnxx'];
handler.tags = ['nsfw', 'prem'];
handler.command = ['xnxxsearch', 'xnxxdl', 'xnxx'];
handler.diamond = 2;
handler.premium = false;
handler.register = true;

export default handler;
