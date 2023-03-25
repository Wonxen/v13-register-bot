const { Client, Collection, GuildMember, Guild, MessageEmbed } = Discord = require('discord.js');
const Config = require('./src/settings/Config.json');
const Reply = require('./src/settings/Reply');
const moment = require('moment');
const chalk = require("chalk");
const fs = require('fs');

require("moment-duration-format");
require("moment-timezone");
moment.locale("tr");

class wonxen extends Client {
    constructor(options) {
        super(options);

            /*-------- Sistem Gereksinimi --------*/
                this.Cevaplar = global.Cevaplar = Reply;
                this.Config = global.Config = Config;
            /*-------- Sistem Gereksinimi --------*/

            /*-------- Handler --------*/
                this.Komutlar = new Collection();
                this.Komut = new Collection();
            /*-------- Handler --------*/
    }

    Cmd() {
        let dirs = fs.readdirSync("./src/commands", { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./src/commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let referans = require(`./src/commands/${dir}/${file}`);
                if(typeof referans.onLoad === "function") referans.onLoad(this);
                this.Komutlar.set(referans.Isim, referans);
                if (referans.Komut) referans.Komut.forEach(alias => this.Komut.set(alias, referans));
            });
        });
    }
}


class Mongo {
    static Connect() {
        require('mongoose').connect(Config.System.MongoDb, {
            connectTimeoutMS: 1000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(`${chalk.grey("Register |")} ${chalk.greenBright(`[${tarihsel(Date.now())}] |`)} ${chalk.cyanBright(`Mongo Veritabanı Bağlantısı Başarıyla Kuruldu.`)}`);
        }).catch((err) => {
            console.log(`${chalk.grey("Register |")} ${chalk.greenBright(`[${tarihsel(Date.now())}] |`)} ${chalk.red(`MongoDB Bağlantısı Başarısız.\nHata: ${err}`)}`);
        });
    }
}

const sayilariCevir = global.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
    global.aylar = aylartoplam;
    const tarihsel = global.tarihsel = function(tarih) {
    let tarihci = moment().format('LLL')  
    return tarihci;
};

Guild.prototype.Kanal = function(isim) {
    let kanal = this.channels.cache.find(k => k.name === isim)
    return kanal;
}

GuildMember.prototype.Tanımla = function (rolidler = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler);
    return this.roles.set(rol);
}

GuildMember.prototype.RolVer = function (rolidler = []) {
    let rol;
    if(this.roles.cache.has(Config.Role.Vip)) { 
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler).concat(Config.Role.Vip) 
    } else {
    rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(rolidler)
    };
    return this.roles.set(rol);
}

Guild.prototype.Log = async function Log(yetkili, üye, cins) {
    let kanal = this.channels.cache.find(x=> x.name === "kayıt-log");
    let cinsiyet;
    if(cins === "erkek") { cinsiyet = "Erkek" } else if(cins === "kadın") { cinsiyet = "Kadın" }
    if(kanal) {
        kanal.send({ embeds : [new MessageEmbed().setColor("RANDOM").setAuthor({name : üye.guild.name, iconURL : üye.guild.iconURL({dynamic : true})}).setDescription(`${üye} isimli üye \`${tarihsel(Date.now())}\` tarihinde ${yetkili} tarafından \`${cinsiyet}\` olarak kayıt edildi.`).setFooter({ text : Config.Bot.Text , iconURL : üye.guild.iconURL({dynamic : true})}).setTimestamp()]})
    };
}

Guild.prototype.Emoji = function(content) {
    let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content) 
    if(!emoji) {
        if(this.client.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.name === content)) {
            let emojicik = this.client.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.name === content)
            if(!emojicik) return '#EmojiBulunamadı';
            if(emojicik.animated) return `<a:${emojicik.name}:${emojicik.id}>`;
            return `<:${emojicik.name}:${emojicik.id}>`;
        }
    }
    return emoji;
}

Promise.prototype.Sil = function(time) {
    if (this) this.then(msg => {
        if (msg.deletable) setTimeout(() => { msg.delete(); }, time * 1000);
    });
};

module.exports = { wonxen, Mongo };