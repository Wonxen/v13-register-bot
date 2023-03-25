const { Client, Message, MessageEmbed} = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "teyit",
    Komut: ["kayıtbilgi", "kayıtlar","kayıtlarım","kaydettiklerim","kayıt-info","teyit","teyitlerim"],
    Kullanim: "teyit <@Wonxen/ID>",
    Aciklama: "Belirtilen üye ve Komutu kullanan üyenin teyit bilgilerini gösterir.",
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
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    if (!uye) return message.channel.send({ content : Cevaplar.Uyeyok }).Sil(15);
    if (!message.member.roles.cache.has(Config.Permissions.Kayıt) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return

    let teyit = await Kullanici.findOne({ id: uye.id }) || [];
    let erkekTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "erkek").length
    let kizTeyit = teyit.Teyitler.filter(v => v.Cinsiyet === "kadın").length
    
    message.channel.send({embeds : [
        new MessageEmbed().setColor("RANDOM").setAuthor({name : message.guild.name, iconURL : message.guild.iconURL({dynamic : true})}).setFooter({text : Config.Bot.Text, iconURL : message.author.avatarURL({dynamic : true})}).setTimestamp()
        .setDescription(`${uye.toString()} üyesinin **<t:${Math.floor(Date.now()/1000)}:f>** tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam kayıt bilgileri aşağıda belirtilmiştir.`)
        .addFields(
            { name: "__Toplam__",  value: `\`\`\`js\n${erkekTeyit + kizTeyit}\`\`\``, inline: true },
            { name: "__Erkek__",  value: `\`\`\`js\n${erkekTeyit}\`\`\``, inline: true },
            { name:"__Kadın__",  value: `\`\`\`js\n${kizTeyit}\`\`\``, inline: true },)
        .addField(`➥ Genel Kayıt Durumu`, `\`1.\` Erkek: \`${erkekTeyit}\`\n\`2.\` Kadın: \`${kizTeyit}\``, false)
    ]})

  }
};
