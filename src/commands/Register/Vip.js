const { Client, Message } = Discord = require("discord.js");

module.exports = {
    Isim: "vip",
    Komut: ["vip","special"],
    Kullanim: "vip <@Wonxen/ID>",
    Aciklama: "",
    Kategori: "Kayıt",
    
   /**
   * @param {Client} client 
   **/
  
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!message.member.permissions.has("ADMINISTRATOR") && !message.member.permissions.has("MANAGE_CHANNELS") && !message.member.permissions.has("MANAGE_ROLES")) return message.channel.send({ content : Cevaplar.Yt }).Sil(15);

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return message.channel.send({ content : Cevaplar.Uye + " " + "\`<@Wonxen/ID>\`"}).Sil(15);
    if (message.author.id === uye.id) return message.channel.send({content : Cevaplar.Kendi}).Sil(15);
    if (uye.user.bot) return message.channel.send({ content : Cevaplar.Bot }).Sil(15);
    if (!uye.manageable) return message.channel.send({ content : Cevaplar.Dk }).Sil(15);
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send({ content : Cevaplar.Ytust }).Sil(15);

    uye.roles.cache.has(Config.Role.Vip) ? uye.roles.remove(Config.Role.Vip) : uye.roles.add(Config.Role.Vip);
    if(!uye.roles.cache.has(Config.Role.Vip)) {
        message.reply({content: `${message.guild.Emoji(Config.Others.Yes)} ${uye} kişisine **${message.guild.roles.cache.get(Config.Role.Vip).name}** adlı rolü başarıyla verdim.`}).then((e) => setTimeout(() => { e.delete() }, 10 * 1000));
        message.react(message.guild.Emoji(Config.Others.Yes));
    } else {
        message.reply({content: `${message.guild.Emoji(Config.Others.No)} ${uye} kişisinden **${message.guild.roles.cache.get(Config.Role.Vip).name}** adlı rolü başarıyla geri aldım.`}).then((e) => setTimeout(() => { e.delete() }, 10 * 1000));
        message.react(message.guild.Emoji(Config.Others.Yes));
    };
  }
};
