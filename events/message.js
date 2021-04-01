const { MessageEmbed } = require('discord.js');
const config = require('./../config.js');

module.exports = async (client, msg) => {
  if (!msg.guild || msg.author.bot) return;

  if (!msg.content.startsWith(config.prefix)) return;

  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
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