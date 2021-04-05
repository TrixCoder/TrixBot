const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  message.delete();
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return message.reply("You must need admin permission to use this command.");;
  }
  if (!args[0]) return message.reply("You didn't specify a channel.")
  else {
    let content = args.slice(0);
    let msg = "";
    for (let i = 0; i < content.length; i++) {
      if (i == content.length - 1) {
        msg += `${content[i]}`;
      } else {
        msg += `${content[i]} `;
      }
    }
    message.channel.send(msg);
  }
}

module.exports.help = {
  name: 'say',
  aliases: [''],
  usage: ['<message>'],
  example: ['Hello!'],
  description: "Make bot say anything",
  category: "Admin"
}
