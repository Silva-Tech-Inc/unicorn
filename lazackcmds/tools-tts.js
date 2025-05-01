import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const defaultLang = 'en'; // Default language is English

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let lang = args[0]; // First argument is the language
  let text = args.slice(1).join(' '); // Remaining text

  // Check if the language is valid (2 characters long)
  if ((args[0] || '').length !== 2) {
    lang = defaultLang; // Default to English if no valid language is provided
    text = args.join(' '); // Use the entire input as text
  }

  if (!text && m.quoted?.text) text = m.quoted.text; // Fallback if quoted text exists

  let res;
  try {
    res = await tts(text, lang); // Generate the TTS file
  } catch (e) {
    m.reply(`❌ Error: ${e}`);
    text = args.join(' '); // Fallback to original text if error occurs
    if (!text) throw `🔹 Example: \n${usedPrefix}${command} en Hello, world!`; // Provide guidance to the user
    res = await tts(text, defaultLang); // Retry with default language
  } finally {
    if (res) {
      // Send the generated TTS file
      conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
    }
  }
};

handler.help = ['tts <lang> <text>']; // Help command
handler.tags = ['tools']; // Command category
handler.command = ['tts', 'voz']; // Command trigger words

export default handler;

// Function to generate the TTS file
function tts(text, lang = 'en') {
  console.log(`[TTS] Language: ${lang}, Text: ${text}`);
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang); // Initialize the TTS engine for the language
      let filePath = join(global.__dirname(import.meta.url), '../tmp', `${Date.now()}.wav`); // Temporary file path
      tts.save(filePath, text, () => {
        resolve(readFileSync(filePath)); // Resolve with the audio file buffer
        unlinkSync(filePath); // Delete the temporary file after sending
      });
    } catch (e) {
      reject(e); // Handle errors
    }
  });
}
