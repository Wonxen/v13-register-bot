const { Client, Message, MessageButton, MessageActionRow, MessageEmbed } = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "isimler",
    Komut: ["isimsorgu"],
    Kullanim: "isimler <@Wonxen/ID>",
    Aciklama: "Belirlenen üyenin önceki isim ve yaşlarını gösterir.",
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

    let embed = new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()

    const Rows = new MessageActionRow().addComponents([
        new MessageButton().setStyle('SECONDARY').setEmoji(message.guild.Emoji(Config.Others.Yes)).setLabel("Kayıtlı isimleri göster").setCustomId('name')
    ]);
    
    let isimveri = await Kullanici.findOne({ id: uye.id }) || [];
    if (isimveri.Isimler) {
        let isimler = isimveri.Isimler.length > 0 ? isimveri.Isimler.reverse().map((value, index) => `\`${index + 1}.\` \`${Config.Guild.Tag} ${value.Isim} | ${value.Yas}\` (**${value.islembilgi}**) - ${value.Yetkili ? "<@"+ value.Yetkili + ">" : ""} - <t:${Math.floor(new Date(value.Zaman).getTime() / 1000)}:R>`).join("\n") : "";

        const filter = i => i.user.id === message.member.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
        let panel = await message.channel.send({ embeds : [embed.setDescription(`${uye} (\`${uye.user.tag}\`) kişisinin toplamda **${isimveri.Isimler.length || 0}** isim kayıtı bulundu.`)], components : [Rows]});

        collector.on('collect', async i => {
            if (i.customId === 'name') {
                i.deferUpdate();
                await panel.edit({embeds : [embed.setDescription(`${isimler || `${uye} (\`${uye.user.tag}\`) kişisinin isim kayıtı bulunamadı.`}`)], components : []}).then(x => {
                    setTimeout(() => {
                    if (x) x.delete()
                    }, 60 * 1000);
                    message.react(message.guild.Emoji(Config.Others.Yes));
                })
            }
        })
    } else {
        message.channel.send({content : Cevaplar.Hata + " " + `${uye} üyesinin isim kayıtı bulunamadı.`}).Sil(15);
        message.react(message.guild.Emoji(Config.Others.No));
    }
  }
};
