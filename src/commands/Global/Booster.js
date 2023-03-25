const { Client, Message } = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "booster",
    Komut: ["zengin","b"],
    Kullanim: "booster <isim>",
    Aciklama: "",
    Kategori: "Genel",
    
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
    let booster = Config.Role.Booster || undefined;
    if(!booster) return message.channel.send({content : `${Cevaplar.Hata} \`Sistemsel Hata\` Lütfen **${client.users.cache.get(Config.Staff.List[Math.floor(Math.random() * Config.Staff.List.length)]).tag}** yetkilisine ulaşın.`}).Sil(15);
    if(!message.member.roles.cache.has(booster)) return message.channel.send({content : Cevaplar.Yt}).Sil(15);
    let yasaklar = ["discord.gg/", ".gg/", "discord.gg", "https://discord.gg/"];

    let uye = message.guild.members.cache.get(message.author.id);
    let Nick;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    
    if (!isim) return message.channel.send({content : `${Cevaplar.Hata} Lütfen bir isim belirleyiniz!  __Örn:__  \`${System.Bot.Prefix[0]}booster <Belirlenen Isim> Max: 32 Karakter!\``}).Sil(15);
    if (isim && yasaklar.some(w => isim.toLowerCase().includes(w))) {
      message.channel.send({content : `${Cevaplar.Hata} Lütfen bir isim belirleyiniz!  __Örn:__  \`${System.Bot.Prefix[0]}booster <Belirlenen Isim> Max: 32 Karakter!\``}).Sil(15);
      message.delete();
    } else {
      Nick = `${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} ${isim}`;
      if(uye.manageable) {
      uye.setNickname(`${Nick}`).then(devam => {
        message.reply({content : `🎉 Tebrikler **${Nick}** yeni isminizle havanıza hava kattınız!`}).catch();
        message.react(message.guild.Emoji(Config.Others.Yes))
        }).catch(err => message.channel.send({content : Cevaplar.Isim}))
        let data = await Kullanici.findOne({id: uye.id});
        if(data) {
        await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: data.Isim, Yas: data.Yas, islembilgi: "Booster" } } }, { upsert: true }).exec();
        await Kullanici.updateOne({ id: uye.id }, { $set: { "Cinsiyet": new String } }, { upsert: true }).exec();
        };
      } 
    }
  }
};
