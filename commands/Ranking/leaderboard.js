const { MessageEmbed } = require('discord.js');
const Level = require('../../models/level.js');

module.exports.run = async (client, msg, args) => {
    const rankIndex = (await Level.find({})).sort((a, b) => (b.xp + (10 * (b.level * b.level) + 90 * b.level + 100)) - (a.xp + (10 * (a.level * a.level) + 90 * a.level + 100)));
    let lbtxt = "";
    for (let i = 0; i < rankIndex.length && i < 10; i++) {
        let member = msg.guild.members.cache.get(rankIndex[i].id).user;
        if (i == rankIndex.length - 1) {
            lbtxt += `${i+1}) ${member.username} - Level: ${rankIndex[i].level} - XP: ${rankIndex[i].xp}`
        } else {
            lbtxt += `${i+1}) ${member.username} - Level: ${rankIndex[i].level} - XP: ${rankIndex[i].xp}\n\n`
        }
    }
    return msg.channel.send(new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Rank Leaderboard:`)
        .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true, size: 4096, format: 'png' }))
        .setDescription(lbtxt)
        .setTimestamp());
}

module.exports.help = {
    name: 'leaderboard',
    aliases: ['lb'],
    category: 'Ranking',
    usage: [''],
    description: 'Check leaderboard',
    example: ['']
}
