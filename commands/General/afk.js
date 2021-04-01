let Afk = require('./../../models/afk.js')
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
  let find = await Afk.findOne({ guild: message.guild.id, user: message.author.id });
  if (find) {
    await Afk.findOneAndDelete({ guild: message.guild.id, user: message.author.id }, (err, res) => {
      if (err) return message.channel.send(err);
    })
    message.delete({ timeout: 1 });
    message.channel.send(`Welcome back ${message.author}, I removed your AFK`).then(m => {
      m.delete({ timeout: 10000 });
    });
    return;
  }
  else {
    let content = args.slice(0);
    let m = "";
    for (let i = 0; i < content.length; i++) {
      if (i == content.length - 1) {
        m += `${content[i]}`;
      } else {
        m += `${content[i]} `;
      }
    }
    let afkmsg = args[0] ? m : 'AFK';
    let newAfk = new Afk({
      guild: message.guild.id,
      user: message.author.id,
      message: afkmsg
    });
    await newAfk.save();
    message.delete({ timeout: 1 });

    let embed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
      .setDescription(`${message.author} I set your AFK: ${afkmsg}`)

    message.channel.send(embed).then(m => {
      m.delete({ timeout: 10000 });
    });
    return;
  }
}

module.exports.help = {
  name: 'afk',
  aliases: ['']
}
