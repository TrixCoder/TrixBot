const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
  message.delete();
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return message.reply("You must need admin permission to use this command.");;
  }
  if (!args[0]) return message.reply("You didn't specify a Message.");
  else {
    let content;
    if(['RED', 'BLUE', 'GREEN','PINK', 'BLACK', 'ORANGE', 'PURPLE', 'YELLOW'].includes(args[0])){
      content  = args.slice(1);
    }
    else{
      content  = args.slice(0);
    }
    let msg = "";
    for (let i = 0; i < content.length; i++) {
      if (i == content.length - 1) {
        msg += `${content[i]}`;
      } else {
        msg += `${content[i]} `;
      }
    }
    let embed = new MessageEmbed()
      .setColor(args[0])
      .setDescription(msg);
    message.channel.send(embed);
  }
}

module.exports.help = {
  name: 'embed',
  aliases: ['em']
}
