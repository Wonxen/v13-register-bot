const { Message } = Discord = require("discord.js");
const client = global.bot;

/**
 * 
 * @param {Message} message 
 *
**/

module.exports =  async (message) => {
  try 
  {
    let prefix = Config.System.Prefix.find((x) => message.content.toLowerCase().startsWith(x));
    if (message.author.bot || !message.content.startsWith(prefix) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(prefix.length).split(" ");
    let Komutcuklar = args[0];
    let bot = message.client;
    args = args.splice(1);
    let calistirici;
    if (bot.Komut.has(Komutcuklar)) {
      calistirici = bot.Komut.get(Komutcuklar);
      calistirici.onRequest(bot, message, args);
    } else if (bot.Komutlar.has(Komutcuklar)) {
      calistirici = bot.Komutlar.get(Komutcuklar);
      calistirici.onRequest(bot, message, args);
    }
    if ([".tag", "!tag"].includes(message.content.toLowerCase())) { 
      if((!message.mentions.members.first() || !message.guild.members.cache.get(args[0]))) return Config.Guild.Tag ? message.channel.send({content : `\`${Config.Guild.Tag}\``}).then(w => message.react(message.guild.Emoji(Config.Others.Yes))) : message.channel.send(`Sistemsel Hata: \`Bu sunucuya ait tag ayarı bulunamadı.\` Lütfen tag belirleyiniz!`).then(x => {
      setTimeout(() => {
          x.delete()
        }, 7500);
      }) 
    }
  }
  catch (e) {
    console.log(`Events ${module.exports.Config.Event}\nHata: ${e}`);
  }
}

module.exports.Config = {
  Event: "messageCreate"
}