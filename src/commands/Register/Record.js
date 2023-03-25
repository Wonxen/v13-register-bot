const { Client, Message, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { KayıtDB } = require('../../database/wonxen');

module.exports = {
    Isim: "kayıt",
    Komut: ["kayit", "k", "e"],
    Kullanim: "kayıt <@Wonxen/ID> <isim> <yaş>",
    Aciklama: "Belirtilen üye sunucuda kayıtsız bir üye ise kayıt etmek için kullanılır.",
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
    if (message.author.id === uye.id) return message.channel.send({ content : Cevaplar.Kendi }).Sil(15);
    if (uye.user.bot) return message.channel.send({ content : Cevaplar.Bot }).Sil(15);
    if (!uye.manageable) return message.channel.send({ content : Cevaplar.Dk }).Sil(15);
    if (uye.roles.cache.has(Config.Kayıt.Man[0])) return message.channel.send({ content : Cevaplar.Kayıtlı}).Sil(15);
    if (uye.roles.cache.has(Config.Kayıt.Woman[0])) return message.channel.send({ content : Cevaplar.Kayıtlı}).Sil(15);
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send({ content : Cevaplar.Ytust }).Sil(15);
    if (Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7 && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send({ content : Cevaplar.Yeni }).Sil(15);
    if (Config.Ayar.TagliAlim && Config.Ayar.TagliAlim === true) { if(!uye.roles.cache.has(Config.Role.Family) && !uye.roles.cache.has(Config.Role.Vip) && !uye.roles.cache.has(Config.Role.Booster)) return message.channel.send({content : Cevaplar.Taglı }).Sil(15); }

    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;

    if (yaş < Config.Ayar.MinYas) return message.channel.send({ content : Cevaplar.Yas });
    if(!isim || !yaş) return message.channel.send({ content : Cevaplar.Argüman + " " + `\`${Config.System.Prefix[0]}${module.exports.Kullanim}\``});
    setName = `${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} ${isim} | ${yaş}`;
    uye.setNickname(`${setName}`).catch(err => message.channel.send({ content : Cevaplar.Isim }));

    let embed = new MessageEmbed().setColor("RANDOM").setAuthor({name : message.author.tag, iconURL : message.author.avatarURL({dynamic : true})}).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp();

    const Rows = new MessageActionRow().addComponents([
        new MessageButton().setStyle('SECONDARY').setEmoji("♂").setLabel("Erkek").setCustomId('1'),
        new MessageButton().setStyle('SECONDARY').setEmoji("♀").setLabel("Kadın").setCustomId('2')
    ]);

    const filter = i => i.user.id === message.member.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
    let panel = await message.reply({ embeds : [embed.setDescription(`${uye} (\`${setName}\`) isimli kişinin cinsiyetini aşağıdaki butonlarla belirleyin.`)], components : [Rows]})

    collector.on('collect', async i => {
        if (i.customId === '1') {
            try {
                Kayıt(uye, message.member, isim, yaş, "erkek")
                await panel.edit({ embeds: [embed.setDescription(`${message.guild.Emoji(Config.Others.Yes)} Başarıyla ${uye} isimli üye **Erkek** olarak kayıt edildi.`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()], components: [] }).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 10000);
                })
                message.react(message.guild.Emoji(Config.Others.Yes));
                client.channels.cache.get(Config.Channel.Chat).send(`${uye} adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **${message.guild.memberCount}** kişi oldu!`).then((w) => setTimeout(() => { w.delete(); }, 10000));
            }
            catch (w)
            {
                console.log(w);
            }
        }
        if (i.customId === '2') {
            try {
                Kayıt(uye, message.member, isim, yaş, "kadın")
                await panel.edit({ embeds: [embed.setDescription(`${message.guild.Emoji(Config.Others.Yes)} Başarıyla ${uye} isimli üye **Kadın** olarak kayıt edildi.`).setFooter({text : Config.Bot.Text, iconURL : message.guild.iconURL({dynamic : true})}).setTimestamp()], components: [] }).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 10000);
                })
                message.react(message.guild.Emoji(Config.Others.Yes));
                client.channels.cache.get(Config.Channel.Chat).send(`${uye} adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **${message.guild.memberCount}** kişi oldu!`).then((w) => setTimeout(() => { w.delete(); }, 10000));
            }
            catch (w)
            {
                console.log(w);
            }
        }
    })
    collector.on("end", () => {
        if (uye.roles.cache.has(Config.Kayıt.Man[0]) || uye.roles.cache.has(Config.Kayıt[0])) return;
        uye.setNickname(`${uye.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} İsim | Yaş`);
        if (panel) panel.edit({ content : `${message.guild.Emoji(Config.Others.No)} 15 saniye boyunca cevap verilmediği için ${uye} kullanıcının kayıt işlemi iptal edildi.`, embeds : [], components: []}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 10000);
            message.react(message.guild.Emoji(Config.Others.No))
        })
    })
  }
};

async function Kayıt(uye, yetkili, isim, yaş, cinsiyet) {
    let rol;
    let rolver;
    if(cinsiyet === "erkek") {
        rol = "Erkek"
        rolver = Config.Kayıt.Man
    } else if(cinsiyet == "kadın") {
        rol = "Kadın"
        rolver = Config.Kayıt.Woman
    }
    await uye.RolVer(rolver).then(wonxen => {if(uye.user.username.includes(Config.Guild.Tag)) uye.roles.add(Config.Role.Family)});
    await KayıtDB.kayıtBelirt(uye, isim, yaş, yetkili, rol, cinsiyet)
    await yetkili.guild.Log(yetkili, uye, cinsiyet);
}