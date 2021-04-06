const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('./../../config.js')

module.exports.run = async (client, msg, args) => {
    if (!args[0]) return msg.channel.send(`Please provide a valid gif name to search`);

    let res = await axios.get(`https://api.tenor.com/v1/search?q=anime ${args[0]}&key=${config.TENOR_API}&contentfilter=medium`);

    const filter = res.data.results.filter(r => r.url.endsWith('.gif'));

    const gif = filter[Math.floor(Math.random() * filter.length)];

    let embed = new MessageEmbed()
        .setDescription(`**Searched ${args[0]}**`)
        .setImage(gif.media[0].gif.url)
        .setTimestamp()
        .setFooter(`Requested by: ${msg.author.tag}`, msg.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setColor("RANDOM")
    msg.channel.send(embed);
}


module.exports.help = {
    name: 'gif',
    aliases: [''],
    usage: ['<search filter>'],
    example: ['<search filter>'],
    description: 'Search any gif',
    category: "Fun"
}