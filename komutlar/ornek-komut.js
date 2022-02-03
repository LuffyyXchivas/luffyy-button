const Discord = require('discord.js');

exports.run = (client, message, args) => {
  
  message.reply('Luffyy Was Here Baby 💋')
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [''],
  permLevel: 0
};

exports.help = {
  name: 'ready',
};