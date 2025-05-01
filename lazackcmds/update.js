import { exec } from "child_process";
import path from "path";

let handler = async (m) => {
  const targetFolder = path.join(process.cwd(), "unicorn-md"); // Path to the Unicorn MD bot folder

  try {
    let output = await execPromise(`git -C ${targetFolder} pull`);

    if (output.includes("Already up to date.")) {
      return m.reply("🟢 *Unicorn MD is already up to date!* ✅\nNo changes found in the repository.");
    }

    m.reply("✅ *Unicorn MD has been updated successfully!* 🚀\nRestart your bot to apply the latest changes.");
    
  } catch (error) {
    m.reply(`❌ *Update failed!*\n\n🔧 Error: ${error.message}\n\nPlease try updating manually or check your repo access.`);
  }
};

// Promisified exec function
const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr.trim() || err.message));
      resolve(stdout.trim());
    });
  });

handler.help = ["update"];
handler.tags = ["system"];
handler.command = /^update$/i;
handler.owner = true;

export default handler;
