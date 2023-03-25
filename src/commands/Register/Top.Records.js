const { Client, Message, MessageEmbed} = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "topteyit",
    Komut: ["Topteyit"],
    Kullanim: "topteyit",
    Aciklama: "Sunucu genelindeki teyit sıralamasını gösterir.",
    Kategori: "Kayıt",
    
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

    const all = await Kullanici.find().sort({ Toplamteyit: "descending" });
    let teyit = all.map((value, index) => `\`${index == 0 ? `👑` : `${index+1}.`}\` ${message.guild.members.cache.get(value.id)} (\`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length + value.Teyitler.filter(v => v.Cinsiyet === "kadın").length}\` Toplam, \`${value.Teyitler.filter(v => v.Cinsiyet === "erkek").length || 0}\` Erkek, \`${value.Teyitler.filter(v => v.Cinsiyet === "kadın").length || 0}\` Kadın)`).slice(0, 20)

    message.channel.send({embeds : [
        new MessageEmbed().setColor("#050244").setAuthor({name : message.guild.name, iconURL : message.guild.iconURL({dynamic : true})}).setThumbnail(message.guild.iconURL({dynamic: true})).setFooter({text : Config.Bot.Text, iconURL : message.author.avatarURL({dynamic : true})}).setTimestamp()
        .setDescription(`➥ \`${message.guild.name}\` sunucusuna ait \`Haftalık\` kayıt sıralaması aşağıda sıralandırılmıştır.\n\n${teyit.join("\n") || "Teyit verisi bulunamadı!"}`)
    ]})
  }
};
