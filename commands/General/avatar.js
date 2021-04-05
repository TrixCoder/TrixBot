const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    let user;
    if (!args[0]) {
        user = message.guild.members.cache.get(message.author.id).user;
    } else {
        if (!isNaN(args[0])) {
            user = message.guild.members.cache.get(args[0]).user;
        }
        else {
            user = message.guild.members.cache.get(message.mentions.users.first().id).user || message.guild.members.cache.find(r => r.user.username.toLowerCase().startsWith(args.join(' ').toLowerCase()));
        }
    }
    let embed = new MessageEmbed()
        .setTitle(`**${user.tag}'s avatar**`)
        .setDescription(`**Link as** \n [png](${user.avatarURL({ format: 'png', size: 4096 })}) - [jpg](${user.avatarURL({ format: 'jpg', size: 4096 })}) - [webp](${user.avatarURL({ format: 'webp', size: 4096 })})`)
        .setImage(user.avatarURL({ format: 'png', dynamic: true, size: 4096 }))
        .setColor('RANDOM')

    return message.channel.send(embed);
}

module.exports.help = {
    name: 'avatar',
    aliases: ['av'],
    usage: ['[@user]', '[userID]'],
    example: ['', '@99801 ₐ₁#0004', '514391225445384210'],
    description: `Check your's/other people's avatar`,
    category: 'General'
}