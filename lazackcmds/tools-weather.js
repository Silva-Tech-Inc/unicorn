import axios from "axios";

let handler = async (m, { args }) => {
  if (!args[0]) throw `🌍 Please specify a location.\n\nExample: *.weather Nairobi*`;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
    const data = response.data;

    const name = data.name;
    const country = data.sys.country;
    const weather = data.weather[0].description;
    const temperature = `${data.main.temp}°C`;
    const minTemp = `${data.main.temp_min}°C`;
    const maxTemp = `${data.main.temp_max}°C`;
    const humidity = `${data.main.humidity}%`;
    const wind = `${data.wind.speed} km/h`;

    const message = `
🌐 *Unicorn MD — Weather Report*

📍 *Location:* ${name}
🌎 *Country:* ${country}
🌤️ *Condition:* ${weather}
🌡️ *Temperature:* ${temperature}
📉 *Min Temp:* ${minTemp}
📈 *Max Temp:* ${maxTemp}
💧 *Humidity:* ${humidity}
🌬️ *Wind Speed:* ${wind}
    `.trim();

    m.reply(message);
  } catch {
    return m.reply("⚠️ Unable to fetch weather data. Please check the location and try again.");
  }
};

handler.help = ['weather <place>'];
handler.tags = ['tools'];
handler.command = /^(climate|weather|mosam)$/i;

export default handler;
