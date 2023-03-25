const { Client, Message } = Discord = require("discord.js");
const Kullanici = require('../../database/schema/user');

module.exports = {
    Isim: "taslak",
    Komut: [],
    Kullanim: "taslak",
    Aciklama: "",
    Kategori: "Kurucu",
    
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

  }
};
