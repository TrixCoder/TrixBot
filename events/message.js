const { MessageEmbed, Collection } = require('discord.js');
const config = require('./../config.js');
let Afk = require('./../models/afk.js');
let Guild = require('./../models/guild.js');
const Level = require('./../models/level.js');

module.exports = async (client, msg) => {
  if (!msg.guild || msg.author.bot) return;
  const result = await Level.findOne({ id: msg.author.id, guildID: msg.guild.id }) || new Level({ id: msg.author.id, guildID: msg.guild.id });

  await updateXp(msg, result);

  let find = await Afk.find({ guild: msg.guild.id });
  for (let i = 0; i < find.length; i++) {
    if (find[i].user) {
      if (msg.author.id == find[i].user && find[i].type == "auto") {
        let user = msg.guild.members.cache.get(find[i].user);
        await Afk.findOneAndDelete({ guild: msg.guild.id, user: find[i].user }, (err, res) => {
          if (err) return message.channel.send(err);
        })
        msg.channel.send(`Welcome back ${msg.author}, I removed your AFK`).then(m => {
          m.delete({ timeout: 10000 });
        });
      }
      if (msg.mentions.has(msg.guild.members.cache.get(find[i].user).user) && !msg.mentions.everyone && !msg.mentions.here && msg.author.id !== find[i].user) {
        let user = msg.guild.members.cache.get(find[i].user);
        let embed = new MessageEmbed()
          .setColor('RED')
          .setAuthor(user.user.tag, user.user.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
          .setDescription(`${user.user} is AFK: ${find[i].message}`);

        msg.channel.send(embed).then(m => {
          setTimeout(() => m.delete(), 10000);
        }).catch(err => { console.log(err) });
      }
    }
  }
  //if(msg.content.includes())
  const guild = await Guild.findOne({ guild: msg.guild.id });
  if (!guild) {
    const server = new Guild({ guild: msg.guild.id, prefix: config.prefix });
    await server.save();
  }
  let prefix = guild.prefix ? guild.prefix : config.prefix;
  if (prefix == null) prefix = config.prefix;
  if (msg.mentions.has(client.user) && (!msg.mentions.everyone && !msg.mentions.here)) {
    let embed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
      .setDescription(`My prefix is \`${prefix}\`.`);
    msg.channel.send(embed);
  }
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
  if(msg.content.endsWith(prefix) && !cmd) return;
  
  if (!cmd) return;

  try {
    cmd.run(client, msg, args);
  } catch (e) {
    console.error(e);
    return msg.channel.send('An error occured while trying to execute the command!')
  }
}

async function updateXp(msg, result) {

  const points = parseInt(result.xp);
  const level = parseInt(result.level);

  const won = Math.floor(Math.random() * (Math.floor(15) - Math.ceil(5))) + Math.ceil(5);

  const newXp = parseInt(points + won, 10);

  const neededXp = 10 * (level * level) + 90 * level + 100;

  result.xp = parseInt(newXp, 10);

  if (newXp > neededXp) {

    result.level = parseInt(level + 1, 10);
    result.xp = 0;
    msg.channel.send(`Congratulations ${msg.author.toString()} 🎉! You have just advanced to level ${result.level}!`);
  }

  await result.save();
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
