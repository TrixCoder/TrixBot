const { MessageEmbed } = require('discord.js');
const config = require('./../config.js');
let Afk = require('./../models/afk.js');

module.exports = async (client, msg) => {
  if (!msg.guild || msg.author.bot) return;
  let find = await Afk.find({ guild: msg.guild.id });
  for(let i=0;i<find.length;i++){
    if(msg.content.includes(`<@!${find[i].user}>`) && msg.author.id !== find[i].user){
      let user = msg.guild.members.cache.get(find[i].user);
      return msg.channel.send(`${user.user.tag} is AFK: ${find[i].message}`);
    }
  }
  //if(msg.content.includes())
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