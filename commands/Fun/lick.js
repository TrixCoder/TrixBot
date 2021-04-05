const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../../config.js')

module.exports.run = async (client, msg, args) => {
    let user = msg.guild.members.cache.get(args[0]) || msg.mentions.users.first();

    if (!user || (user.id === msg.author.id)) return msg.channel.send('Invalid argument mention a user!');

    let res = await axios.get(`https://api.tenor.com/v1/search?q=anime lick&key=${config.TENOR_API}&contentfilter=medium`);

    const filter = res.data.results.filter(r => r.url.endsWith('.gif'));

    const gif = filter[Math.floor(Math.random() * filter.length)];

    let embed = new MessageEmbed()
        .setDescription(`**${msg.author.toString()} is licking ${user.toString()}**`)
        .setImage(gif.media[0].gif.url)
        .setTimestamp()
        .setColor("RANDOM")
    msg.channel.send(embed);
}


module.exports.help = {
    name: 'lick',
    aliases: [''],
    usage: ['[@user]'],
    example: ['@</Trixter>#0001'],
    description: 'Lick someone',
    category: "Fun"
}