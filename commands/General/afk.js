let Afk = require('./../../models/afk.js')

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
    let afkmsg = args[0] ? args[0] : 'AFK';
    let newAfk = new Afk({
      guild: message.guild.id,
      user: message.author.id,
      message: afkmsg
    });
    await newAfk.save();
    message.delete({ timeout: 1 });
    message.channel.send(`${message.author} I set your AFK: ${afkmsg}`).then(m => {
      m.delete({ timeout: 10000 });
    });
    return;
  }
}

module.exports.help = {
  name: 'afk',
  aliases: ['']
}
