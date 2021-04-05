const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('./../../config.js')

module.exports.run = async (client, msg, args) => {
    let user = msg.guild.members.cache.get(args[0]) || msg.mentions.users.first() || msg.author;

    if (!user) return msg.channel.send(`Please provide a valid user to bite`);

    let res = await axios.get(`https://api.tenor.com/v1/search?q=anime bite&key=${config.TENOR_API}&contentfilter=medium`);

    const filter = res.data.results.filter(r => r.url.endsWith('.gif'));

    const gif = filter[Math.floor(Math.random() * filter.length)];

    let embed = new MessageEmbed()
        .setDescription(`${user.id === msg.author.id ? `**${msg.author.toString()} wants to bite someone**` : `**${msg.author.toString()} is biting ${user.toString()}**`}`)
        .setImage(gif.media[0].gif.url)
        .setTimestamp()
        .setColor("RANDOM")
    msg.channel.send(embed);
}


module.exports.help = {
    name: 'bite',
    aliases: [''],
    usage: ['', '[@user]'],
    example: ['', '@</Trixter>#0001'],
    description: 'Bite someone/Ask for bite',
    category: "Fun"
}