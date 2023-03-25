const { User } = Discord = require("discord.js");
const client = global.bot;

/**
 * 
 * @param {User} oldUser 
 * @param {User} newUser 
 *
**/

module.exports = (oldUser, newUser) => {
    try 
    {
        if (oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
        let guild = client.guilds.cache.get(Config.Guild.ID);
        if (!guild) return;
        let user = guild.members.cache.get(oldUser.id);
        if (!user) return;
        let log = guild.Kanal("tag-log");
        if (!log) return;
        
    
        if(newUser.username.includes(Config.Guild.Tag) && !user.roles.cache.has(Config.Role.Family)){
            if (log) log.send({content : `${user} adlı üye (\`${Config.Guild.Tag}\`) tagını kullanıcı adına yerleştirerek aramıza katıldı! | Sunucuda bulunan toplam taglı üyemiz: (\`${client.users.cache.filter(user => user.username.includes(Config.Guild.Tag)).size}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``});
            if (Config.Role.Jail && user.roles.cache.has(Config.Role.Jail)) return;
            if (Config.Role.YasaklıTag && user.roles.cache.has(Config.Role.YasaklıTag)) return;
            user.roles.add(Config.Role.Family).catch();
            if (user.manageable) user.setNickname(user.displayName.replace(Config.Guild.SecondryTag, Config.Guild.Tag))
        } else if(!newUser.username.includes(Config.Guild.Tag) && user.roles.cache.has(Config.Role.Family)) {
            if (log) log.send({content : `${user} adlı üye (\`${Config.Guild.Tag}\`) tagını kullanıcı adından silerek aramızdan ayrıldı! | Sunucuda bulunan toplam taglı üyemiz: (\`${client.users.cache.filter(user => user.username.includes(Config.Guild.Tag)).size}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``});
            if (Config.Role.Jail && user.roles.cache.has(Config.Role.Jail)) return;
            if (Config.Role.YasaklıTag && user.roles.cache.has(Config.Role.YasaklıTag)) return;
            user.setNickname(user.displayName.replace(Config.Guild.Tag, Config.Guild.SecondryTag)).catch(err =>{})
            let tagRol = guild.roles.cache.get(Config.Role.Family);
            user.roles.remove(user.roles.cache.filter(rol => tagRol.position <= rol.position)).catch(err =>{});
        }
    
    }
    catch (e) {
        console.log(`Events ${module.exports.Config.name}\nHata: ${e}`);
    }
}


module.exports.Config = {
  Event: "userUpdate"
}