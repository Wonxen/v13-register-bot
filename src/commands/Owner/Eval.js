const { Client, Message } = Discord = require("discord.js");

module.exports = {
    Isim: "eval",
    Komut: ["ev"],
    Kullanim: "eval <code>",
    Aciklama: "",
    Kategori: "Kurucu",
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if (!Config.Staff.List.includes(message.author.id)) return;
    if (!args[0]) return message.reply({content : Cevaplar.Hata + " " + "`Kod belirtilmedi.`"});
    if (args[0] == "client") return message.reply({content : Cevaplar.Hata + " " + "`Kod belirtilmedi.`"});
    let code = args.join(' ');
    try {
      var result = clean(await eval(code));
      if (result.includes(client.token)) return message.reply({content: Discord.Formatters.codeBlock("js", "Yasaklı Komut.")});
        message.react(message.guild.Emoji(Config.Others.Yes))
        message.channel.send({content: Discord.Formatters.codeBlock("js", result)});
      } catch (err) {
        message.react(message.guild.Emoji(Config.Others.No))
        message.channel.send({content: Discord.Formatters.codeBlock("js", err)});
      }
  },
};

function clean(text) {
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
    text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
