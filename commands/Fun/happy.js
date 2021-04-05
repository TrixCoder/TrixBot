const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../../config.js')

module.exports.run = async (client, msg, args) => {
    let user = msg.guild.members.cache.get(args[0]) || msg.mentions.users.first() || msg.author;

    let res = await axios.get(`https://api.tenor.com/v1/search?q=anime happy&key=${config.TENOR_API}&contentfilter=medium`);

    const filter = res.data.results.filter(r => r.url.endsWith('.gif'));

    const gif = filter[Math.floor(Math.random() * filter.length)];

    let embed = new MessageEmbed()
        .setDescription(`${user.id === msg.author.id ? `**${msg.author.toString()} is happy**` : `**${msg.author.toString()} is happy because of ${user.toString()}**`}`)
        .setImage(gif.media[0].gif.url)
        .setTimestamp()
        .setColor("RANDOM")
    msg.channel.send(embed);
}


module.exports.help = {
    name: 'happy',
    aliases: [''],
    usage: ['', '[@user]'],
    example: ['', '@</Trixter>#0001'],
    description: 'Be bappy/Be happy because of someone',
    category: "Fun"
}