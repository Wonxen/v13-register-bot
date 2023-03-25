const { Client, Message, MessageEmbed} = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "kayıtsız",
    Komut: ["unregisted"],
    Kullanim: "kayıtsız <@Wonxen/ID>",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
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
    if(!message.member.roles.cache.has(Config.Permissions.Kayıt) && !message.member.permissions.has('VIEW_AUDIT_LOG')) return message.channel.send({ content : Cevaplar.Yt }).Sil(15);
    
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (uye.roles.cache.has(Config.Kayıt.Unregistered[0])) return message.channel.send({ content : Cevaplar.Kayıtsız}).Sil(15);
    if (message.author.id === uye.id) return message.channel.send({content : Cevaplar.Kendi}).Sil(15);
    if (!uye) return message.channel.send({ content : Cevaplar.Uye + " " + "\`<@Wonxen/ID>\`"}).Sil(15);
    if (uye.user.bot) return message.channel.send({ content : Cevaplar.Bot }).Sil(15);
    if (!uye.manageable) return message.channel.send({ content : Cevaplar.Dk }).Sil(15);
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send({ content : Cevaplar.Ytust }).Sil(15);

    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.channel.send({ content : Cevaplar.Sebep }).Sil(15);

    if(uye.voice.channel) uye.voice.disconnect().catch(err => {})

    uye.Tanımla(Config.Kayıt.Unregistered)
    uye.setNickname(`${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} İsim | Yaş`)

    let data = await Kullanici.findOne({id: uye.id});
    if(data) {
    await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: data.Isim, Yas: data.Yas, islembilgi: "Kayıtsıza Atıldı" } } }, { upsert: true }).exec();
    await Kullanici.updateOne({ id: uye.id }, { $set: { "Cinsiyet": new String } }, { upsert: true }).exec();
    };

    message.guild.Kanal("kayıtsız-log").send({ embeds : [new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setDescription(`${uye} isimli üye ${message.author} tarafından \`${tarihsel(Date.now())}\` tarihinde \`${sebep}\` nedeniyle kayıtsız üye olarak belirlendi.`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()]}).catch(err => {});
    message.reply(`${uye} Adlı kullanıcı, ${message.author} tarafından, \`${sebep}\` sebebiyle kayıtsız olarak belirlendi.`).then(x => {
      setTimeout(() => {
          x.delete()
      }, 10000);
      message.react(message.guild.Emoji(Config.Others.Yes))
    });
  }
};
