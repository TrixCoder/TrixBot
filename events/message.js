const { MessageEmbed } = require('discord.js');
const config = require('./../config.js');
let Afk = require('./../models/afk.js');
let Guild = require('./../models/guild.js');

module.exports = async (client, msg) => {
  if (!msg.guild || msg.author.bot) return;
  let find = await Afk.find({ guild: msg.guild.id });
  for (let i = 0; i < find.length; i++) {
    if (msg.content.includes(`<@!${find[i].user}>`) && msg.author.id !== find[i].user) {
      let user = msg.guild.members.cache.get(find[i].user);
      let embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor(user.user.tag, user.user.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setDescription(`${user.user} is AFK: ${find[i].message}`)
      return msg.channel.send(embed);
    }
    if (msg.content.includes(`<@${find[i].user}>`) && msg.author.id !== find[i].user) {
      let user = msg.guild.members.cache.get(find[i].user);
      let embed = new MessageEmbed()
        .setColor('RED')
        .setAuthor(user.user.tag, user.user.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setDescription(`${user.user} is AFK: ${find[i].message}`)
      return msg.channel.send(embed);
    }
  }
  //if(msg.content.includes())
  const guild = await Guild.findOne({ guild: msg.guild.id });
  let prefix = guild.prefix || config.prefix;
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));

  if (!cmd) return;

  try {
    cmd.run(client, msg, args);
  } catch (e) {
    console.error(e);
    return msg.channel.send('An error occured while trying to execute the command!')
  }
}