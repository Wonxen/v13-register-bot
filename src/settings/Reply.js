const Config = require("./Config.json");
let Hata = `Hata:`

module.exports = {
    Hata,
    Yt:            `${Hata} Bu Komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`,
    Bot:           `${Hata} \`BOT ÜYE\` bu üye üzerinde hiç bir şekilde işlem yapamazsın.`,
    Uye:           `${Hata} \`Üye belirtilmedi\` Lütfen bir üye etiketleyin veya ID giriniz! __Örn:__`,
    Sebep:         `${Hata} \`Sebep belirtilmedi\` Sebep yazmalısın veya geçerli bir sebep girmelisin!`,
    Ytust:         `${Hata} \`Yetki Üstünlüğü\` İşlem yapmaya çalıştığın üye senle aynı yetkide veya senden üstün.`,
    Dk:            `${Hata} \`Yönetim/Erişim\` Yetersiz bot yetkisi nedeniyle iptal edildi.`,
    Kayıtlı:       `${Hata} \`Kayıtlı Üye\` Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?`,
    Kayıtsız:      `${Hata} \`Kayıtsız Üye\` Belirlediğiniz üye sunucuda zaten kayıtsız ne için tekrardan kayıtsıza atmaya çalışıyorsun?`,
    Kendi:         `${Hata} \`Aynı Üye\` Lütfen Kendi üzerine işlem uygulamaya çalışma!`,
    Yeni:          `${Hata} \`Yeni Hesap\` Belirtilen üyeye kayıt işlemi yapılamıyor.`,
    Yas:           `${Hata} \`Yaş Sınırı (${Config.Ayar.MinYas})\` Belirtilen üyenin yaşı, yaş sınırının altında olduğu için isim işlemi yapılamadı.`,
    Argüman:       `${Hata} \`Argüman doldurulmadı\` Lütfen tüm Argümanları doldurunuz!  __Örn:__`,
    Taglı:         `${Hata} \`Taglı Alım\` Belirtilen üyenin isminde \`${Config.Guild.Tag}\` bulunmadığından dolayı kayıt işlemi yapılamadı.`,
    Isim:          `${Hata} \`İsim Hatası (32 Karakter)\` İsim karakteri fazla olduğundan dolayı işlem yapılamadı.`
}