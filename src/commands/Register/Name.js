const { Client, Message, MessageButton, MessageActionRow, MessageEmbed } = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "isim",
    Komut: ["i","nick"],
    Kullanim: "isim <@Wonxen/ID> <İsim> <Yaş>",
    Aciklama: "Belirlenen üye sunucuda kayıtsız ise isim değiştirildikten `.e` ile erkek olarak `.k` ile kadın olarak kayıt edebilirsiniz kayıtlı ise sadece isim değiştirir.",
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
    if (!uye) return message.channel.send({ content : Cevaplar.Uye + " " + "\`<@Wonxen/ID>\`"}).Sil(15);
    if (message.author.id === uye.id) return message.channel.send({content : Cevaplar.Kendi}).Sil(15);
    if (uye.user.bot) return message.channel.send({ content : Cevaplar.Bot }).Sil(15);
    if (!uye.manageable) return message.channel.send({ content : Cevaplar.Dk }).Sil(15);
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send({ content : Cevaplar.Ytust }).Sil(15);

    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;

    if (yaş < Config.Ayar.MinYas) return message.channel.send({ content : Cevaplar.Yas });
    if(!isim || !yaş) return message.channel.send({ content : Cevaplar.Argüman + " " + `\`${Config.System.Prefix[0]}${module.exports.Kullanim}\``});
    setName = `${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send({ content : Cevaplar.Isim }));

    await Kullanici.updateOne({ id: uye.id }, { $push: { "Isimler": { Yetkili: message.member.id, Zaman: Date.now(), Isim: isim, Yas: yaş, islembilgi: "İsim Güncelleme" } } }, { upsert: true }).exec();
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${index + 1}.\` \`${Config.Guild.Tag} ${value.Isim} | ${value.Yas}\` (**${value.islembilgi}**) - ${value.Yetkili ? "(<@"+ value.Yetkili + ">)" : ""} - <t:${Math.floor(new Date(value.Zaman).getTime() / 1000)}:R>`).join("\n") : "";
    
    message.guild.Kanal("isim-log").send({ embeds : [new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setDescription(`${uye} adlı kullanıcı ${message.author} (\`${message.author.tag}\`) Tarafından \`${setName}\` Olarak İsmi \`${tarihsel(Date.now())}\` Tarihinde Değiştirildi.`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()]}).catch(err => {});
    
    const Rows = new MessageActionRow().addComponents([
        new MessageButton().setStyle('SECONDARY').setEmoji(message.guild.Emoji(Config.Others.Yes)).setLabel(`${isimveri.Isimler.length} Kayıtlı isimleri göster`).setCustomId('names')
    ]);

    const filter = i => i.user.id === message.member.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    let panel = await message.channel.send({embeds : [new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setDescription(`${uye} kişisinin ismi başarıyla "**${isim} | ${yaş}**" olarak değiştirildi.`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()], components : [Rows]})
    collector.on('collect', async i => {
        if (i.customId === 'names') {
            i.deferUpdate();
            await panel.edit({embeds : [new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setDescription(`${isimler || `${uye} (\`${uye.user.tag}\`) kişisinin isim kayıtı bulunamadı.`}`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()], components : []}).then(x => {
                setTimeout(() => {
                if (x) x.delete()
                }, 60 * 1000);
                message.react(message.guild.Emoji(Config.Others.Yes));
            })
        }
    })
  }
};
