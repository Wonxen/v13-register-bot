const { Client, Message, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");

module.exports = {
    Isim: "help",
    Komut: ["yardım"],
    Kullanim: "yardım",
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
    let command = args[0]
    if (client.Komutlar.has(command)) {
      command = client.Komutlar.get(command)
      message.channel.send({embeds : [
        new MessageEmbed().setColor("#1e68d8")
        .addFields(
          { name: 'Komut Adı', value: `${command.Isim || 'Bulunmuyor'}`, inline: true },
          { name: 'Komut Açıklaması', value: `${command.Aciklama || 'Bulunmuyor'}`, inline: false },
          { name: 'Komut Kullanımı', value: `${command.Kullanim || 'Bulunmuyor'}`, inline: true },
          { name: 'Komut Alternatifleri', value: `${command.Komut[0] ? command.Komut.join(', ') : 'Bulunmuyor'}`, inline: true },
        )
      ], components : [new MessageActionRow().addComponents([new MessageButton().setStyle('SECONDARY').setEmoji("🚫").setCustomId('delete')])]}).then(msg => {
        const filter = i => i.user.id === message.member.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
          if (i.customId === "delete") {
            if (msg) msg.delete();
            if (message) message.react(message.guild.Emoji(Config.Others.Yes));
            i.reply({content : `${msg.guild.Emoji(Config.Others.Yes)} Başarılı: **${args[0]}** adlı komut bilgisi istek üzerine kapatıldı.`, ephemeral : true});
          }
        })
      })
      return;
    }
    message.channel.send({embeds : [
        new MessageEmbed().setColor("#1e68d8").setAuthor({name : message.guild.name, iconURL : message.guild.iconURL({dynamic : true})}).setFooter({text : Config.Bot.Text, iconURL : message.author.avatarURL({dynamic : true})}).setTimestamp()
        .setDescription(`Aşağıda sunucudaki Komutlar sıralandırılmıştır Komut bilgisini detaylı öğrenmek için \`${Config.System.Prefix[0]}${module.exports.Isim} <Komut Ismi>\` Komutu ile Komutun detaylı bilgilerini görebilirsin.
        \`\`\`md\n# Kullanılabilir tüm Komutlar (${client.Komutlar.size})\`\`\``)
        .addFields(
          { name: 'Kullanıcı', value: `\`${client.Komutlar.filter(x => x.Kategori === "Genel").map(x => Config.System.Prefix[0] + x.Kullanim ).join('\n')}\``, inline: true },
          { name: 'Bilgi', value: `\`${client.Komutlar.filter(x => x.Kategori === "Bilgi").map(x => Config.System.Prefix[0] + x.Kullanim ).join('\n')}\``, inline: true },
          { name: '\u190b', value: '\u190b' },
          { name: 'Kayıt', value: `\`${client.Komutlar.filter(x => x.Kategori === "Kayıt").map(x => Config.System.Prefix[0] + x.Kullanim ).join('\n')}\``, inline: true },
          { name: 'Sahip', value: `\`${client.Komutlar.filter(x => x.Kategori === "Kurucu").map(x => Config.System.Prefix[0] + x.Kullanim ).join('\n')}\``, inline: true },
        )
    ]})
  }
};
