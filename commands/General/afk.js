let Afk = require('./../../models/afk.js')
const { MessageEmbed } = require('discord.js');
let ms = require('ms');

module.exports.run = async (client, message, args) => {
  let find = await Afk.findOne({ guild: message.guild.id, user: message.author.id });
  if (find) {
    await Afk.findOneAndDelete({ guild: message.guild.id, user: message.author.id }, (err, res) => {
      if (err) return message.channel.send(err);
    })
    message.delete({ timeout: 1000 });
    message.channel.send(`Welcome back ${message.author}, I removed your AFK`).then(m => {
      m.delete({ timeout: 10000 });
    });
    return;
  }
  else {
    let content;
    let m = "";
    if (args[0] && args[0].toLowerCase() == "normal") {
      content = args.slice(1);
      for (let i = 0; i < content.length; i++) {
        if (i == content.length - 1) {
          m += `${content[i]}`;
        } else {
          m += `${content[i]} `;
        }
      }
      let afkmsg = args[1] ? m : 'AFK';
      let newAfk = new Afk({
        guild: message.guild.id,
        user: message.author.id,
        type: "normal",
        message: afkmsg
      });
      await newAfk.save();
      message.delete({ timeout: 1000 });

      let embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setDescription(`${message.author} I set your AFK: ${afkmsg}`)

      message.channel.send(embed).then(mg => {
        mg.delete({ timeout: 10000 });
      });
      return;
    } else if (args[0] && isNaN(args[0]) && args[0].toLowerCase().match(/[1-60][s,m,h,d]/g)) {
      const giveawayDuration = ms(args[0]);
      if (giveawayDuration < ms("15s") || giveawayDuration > ms("5d")) return message.channel.send({
        embed: {
          title: 'The afk duration must be greater than 30s and less than 5days'
        }
      });
      content = args.slice(1);
      for (let i = 0; i < content.length; i++) {
        if (i == content.length - 1) {
          m += `${content[i]}`;
        } else {
          m += `${content[i]} `;
        }
      }
      let afkmsg = args[1] ? m : 'AFK';
      let newAfk = new Afk({
        guild: message.guild.id,
        user: message.author.id,
        type: "timer",
        timer: giveawayDuration + Date.now(),
        message: afkmsg
      });
      await newAfk.save();
      message.delete({ timeout: 1000 });

      let embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setDescription(`${message.author} I set your AFK: ${afkmsg} and will remove it in ${ms(giveawayDuration + Date.now())}.`)

      message.channel.send(embed).then(mg => {
        mg.delete({ timeout: 10000 });
      });
      return;
    }
    content = args.slice(0);
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
      type: "auto",
      message: afkmsg
    });
    await newAfk.save();
    message.delete({ timeout: 1000 });

    let embed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
      .setDescription(`${message.author} I set your AFK: ${afkmsg}`)

    message.channel.send(embed).then(mg => {
      mg.delete({ timeout: 10000 });
    });
    return;
  }
}

module.exports.help = {
  name: 'afk',
  aliases: [''],
  usage: ['', '[AFK Message]', 'normal [AFK Message]'],
  example: ['', 'Playing GTA V', 'normal Playing GTA V'],
  description: "Set/Reset afk/autoafk",
  category: "General"
}
