let Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
    let tm = message.guild.memberCount;
    let uc = message.guild.members.cache.filter(member => !member.user.bot).size;
    let bc = message.guild.members.cache.filter(member => member.user.bot).size;
    let tmo = message.guild.members.cache.filter(member => member.presence.status == "online").size;
    let tho = message.guild.members.cache.filter(member => !member.user.bot && member.presence.status == "online").size;
    let tbo = message.guild.members.cache.filter(member => member.user.bot && member.presence.status == "online").size;
    let tmb = message.guild.members.cache.filter(member => member.presence.status == "dnd").size;
    let thb = message.guild.members.cache.filter(member => !member.user.bot && member.presence.status == "dnd").size;
    let tbb = message.guild.members.cache.filter(member => member.user.bot && member.presence.status == "dnd").size;
    let tmi = message.guild.members.cache.filter(member => member.presence.status == "idle").size;
    let thi = message.guild.members.cache.filter(member => !member.user.bot && member.presence.status == "idle").size;
    let tbi = message.guild.members.cache.filter(member => member.user.bot && member.presence.status == "idle").size;
    let tmof = message.guild.members.cache.filter(member => member.presence.status == "offline").size;
    let thof = message.guild.members.cache.filter(member => !member.user.bot && member.presence.status == "offline").size;
    let tbof = message.guild.members.cache.filter(member => member.user.bot && member.presence.status == "offline").size;
    let embed = new Discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
        .setColor("#00ff27")
        .setTimestamp()
    if (tm > 1000) {
        embed.setColor("#F4150A")
    }
    if (tm > 1000000) {
        embed.setColor("#FFFF00")
    }
    if (args[0] == "detailed") {
        embed.setTitle("Detailed Membercount")
        embed.addField(`Members`, ` ${tm} (${tmo} online + ${tmi} idle + ${tmb} busy + ${tmof} offline)`)
        embed.addField(`Humans`, ` ${uc} (${tho} online + ${thi} idle + ${thb} busy + ${thof} offline)`)
        embed.addField(`Bots`, `${bc} (${tbo} online + ${tbi} idle + ${tbb} busy + ${tbof} offline)`)
    }
    else {
        embed.setTitle("Membercount")
        embed.addField(`Members`, ` ${tm}`)
        embed.addField(`Humans`, ` ${uc}`)
        embed.addField(`Bots`, `${bc}`)
    }
    message.channel.send(embed)
}

module.exports.help = {
    name: 'membercount',
    aliases: ['mc'],
    usage: ['', 'detailed'],
    example: [''],
    description: 'Get server membercount',
    category: "General"
}
