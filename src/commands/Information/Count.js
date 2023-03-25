const { Client, Message, MessageEmbed} = Discord = require("discord.js");

module.exports = {
    Isim: "say",
    Komut: [],
    Kullanim: "say ",
    Aciklama: "",
    Kategori: "Bilgi",
    
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
    if(!message.member.permissions.has("VIEW_AUDIT_LOG")) return message.channel.send({ content : Cevaplar.Yt }).Sil(15);

    message.react(message.guild.Emoji(Config.Others.Yes));
    message.channel.send({ embeds : [new MessageEmbed().setColor("RANDOM").setDescription(`\`•\` Seste toplam **${message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.filter(member => !member.user.bot).size).reduce((a, b) => a + b)}** kullanıcı var.\n\`•\` Toplam **${client.users.cache.filter(x => x.username.includes(Config.Guild.Tag)).size}** kişi tagımıza sahip.\n\`•\` Sunucumuzda toplam **${message.guild.members.cache.size}** üye var. (**${message.guild.members.cache.filter(m => (m.presence && m.presence.status !== "offline")).size}** Aktif)\n\`•\` Sunucumuza toplam **${message.guild.premiumSubscriptionCount || "0"}** takviye yapılmış.`)]})
  }
};
