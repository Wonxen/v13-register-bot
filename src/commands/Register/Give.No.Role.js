const { Client, Message, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    Isim: "rolsuzver",
    Komut: ["rolsüzver","rolsüz"],
    Kullanim: "rolsüzver ",
    Aciklama: "",
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
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ content : Cevaplar.Yt }).Sil(15);;

    let Biddik = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guildId).size == 0);

    const Rows = new MessageActionRow().addComponents([
        new MessageButton().setStyle('SECONDARY').setDisabled(Biddik.size == 0).setLabel("Hey" +  " " + message.member.displayName + " " + " Tıkla!").setCustomId('ung')
    ]);

    const filter = i => i.user.id === message.member.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    let panel = await message.channel.send({content : `Sunucuda rolü olmayan (\`${Biddik.size}\`) kişi bulunuyor. Bu kişilere kayıtsız rolü vermek için (__aşağıdaki butonu__) kullanabilirsiniz.`, components : [Rows]});

    collector.on('collect', async i => {
        if (i.customId === 'ung') {
            i.reply({content : `Sunucuda rolü olmayan \`${Biddik.size}\` üyeye kayıtsız rolü verilmeye başlandı!`, ephemeral : true})
            Biddik.forEach(Biddikmis => { 
                Biddikmis.Tanımla(Config.Kayıt.Unregistered).catch(w => {});
            });
        }
    })
    collector.on("end", () => {
        if (panel) setTimeout(() => {panel.delete()}, 10 * 1000);
        message.react(message.guild.Emoji(Config.Others.Yes))
    })
   }
};
