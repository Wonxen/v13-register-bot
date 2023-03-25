const Config = require('./src/settings/Config.json');
const { wonxen, Mongo } = require('./wonxen');
const client = global.bot = new wonxen({
    presence: {
        status: 'idle',
        afk: false,
        activities: [{
            name: Config.Bot.Text,
            type: "WATCHING", /* WATCHING - LISTENING - PLAYING */
        }],
    },
    fetchAllMembers: true,
    intents: [ 32767 ],
}); 
require('./src/handlers/eventHander');
const chalk = require("chalk");
Mongo.Connect();
client.Cmd();

client
  .login(Config.System.Token).then(x => {
    console.log(`${chalk.grey("Register |")} ${chalk.greenBright(`[${tarihsel(Date.now())}] |`)} ${chalk.magentaBright(`${`Hazırız Kaptan Yelkenler Fora Falan Fıstık İşte Sür Gidelim: ${client.user.tag}`}`)}`);
  }).catch(err => {
    console.log(`${chalk.grey("Register |")} ${chalk.greenBright(`[${tarihsel(Date.now())}] |`)} ${chalk.red(`Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir.`)}`);
    setTimeout(() => {
        process.exit(0);
    }, 5000);
})

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error(`${chalk.red("Beklenmedik Yakalanamayan Hata: ")}`, errorMsg);
    process.exit(1);
});
  
process.on("unhandledRejection", err => {
    console.error(`${chalk.red("Promise Hatası: ")}`, err);
});
