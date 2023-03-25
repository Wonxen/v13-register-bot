const { joinVoiceChannel } = require("@discordjs/voice");
const client = global.bot;

/**
 * 
 * @param {Ready} ready 
 *
**/

module.exports = async () => {
    try 
    {
    const Voice = client.channels.cache.get(Config.Bot.Voice);
    joinVoiceChannel({ channelId: Voice.id, guildId: Voice.guild.id, adapterCreator: Voice.guild.voiceAdapterCreator, selfDeaf: true, selfMute: true});
    setInterval(() => {
        try {
            client.guilds.cache.get(Config.Guild.ID).members.cache.filter(w => w.roles.cache.filter(r => r.id !== Config.Guild.ID).size == 0).forEach(x => { 
                x.Tanımla(Config.Kayıt.Unregistered)
            })
        } catch (w) {
            console.log(w);
        } 
    }, 60 * 1000);
    }
    catch (e) {
        console.log(`Events ${module.exports.Config.Event}\nHata: ${e}`);
    }
}

module.exports.Config = {
    Event: "ready",
};
  