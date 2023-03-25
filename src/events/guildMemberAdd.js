const { GuildMember, MessageEmbed } = require("discord.js");
const moment = require("moment");
const client = global.bot;
moment.locale("tr");

/**
 * 
 * @param {GuildMember} member 
 *
**/

module.exports = async (member) => {
    try {
      if (member.user.bot) return;
      let OneWeak = Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7;
      member = member.guild.members.cache.get(member.id)
    
      if(OneWeak) {
        await member.setNickname(`${member.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} ${Config.Ayar.SupheliName}`);
        await member.Tanımla(Config.Role.Suspect).catch(w => {console.log(`Events ${module.exports.Config.Event} Şüpheli Rolü Tanımlanırken Hata Oluştu!\nHata: ${w}`)});
        await member.guild.channels.cache.get(Config.Channel.Welcome).send(`${client.emojis.cache.find(x => x.name === Emoji.Bot.No)} ${member} isimli üye sunucuya katıldı fakat hesabı <t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R> açıldığı için **şüpheli** olarak işaretlendi.`);
        return guild.Kanal("şüpheli-log").send({embeds: [new MessageEmbed().setColor("RANDOM").setAuthor({name : member.guild.name , iconURL : member.guild.iconURL({dynamic : true})}).setDescription(`${member} isimli üye sunucuya katıldı fakat hesabı **<t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R>** açıldığı için **şüpheli** olarak işaretlendi.`).setFooter({text : Config.Bot.Text, iconURL : member.guild.iconURL({dynamic : true})}).setTimestamp()]});
      };
      
      member.setNickname(`${member.user.username.includes(Config.Guild.Tag) ? Config.Guild.Tag : (Config.Guild.SecondryTag ? Config.Guild.SecondryTag : (Config.Guild.Tag || ""))} ${Config.Ayar.WelcomeName}`);
      member.Tanımla(Config.Kayıt.Unregistered).catch(w => {console.log(`Events ${module.exports.Config.Event} Kayıtsız Rolü Tanımlanırken Hata Oluştu!\nHata: ${w}`)});
      if (member.user.username.includes(Config.Guild.Tag)) member.roles.add(Config.Role.Family);

      let Hg = member.guild.channels.cache.get(Config.Channel.Welcome)
      if (Hg) Hg.send(`${member}, Sunucumuza Hoş Geldin. Hesabın __${moment(member.user.createdTimestamp).format("LLL")}__ tarihinde (<t:${Math.floor(new Date(member.user.createdAt).getTime() / 1000)}:R>) oluşturulmuş!\n\nSunucuya erişebilmek için <#${Config.Channel.WelcomeVoice[Math.floor(Math.random() * Config.Channel.WelcomeVoice.length)]}> kanalında yetkililerimize isim yaş belirtmelisin.\nKayıt işleminden sonra <#${Config.Channel.Rules}> kanalına göz atmayı unutmayın.\n\nTagımıza ulaşmak için herhangi bir kanala \`".tag"\` yazabilirsiniz.\nSeninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı. 🎉`)
      if (!Hg) console.log(w => { "Lütfen sunucu üzerinden hoşgeldin kanalını belirtin. Bir üye girdi fakat hoşgeldin mesajı atamadım." })
    } catch (e) {
        console.log(`Events ${module.exports.Config.Event}\nHata: ${e}`)
    }
}


module.exports.Config = {
    Event: "guildMemberAdd"
}