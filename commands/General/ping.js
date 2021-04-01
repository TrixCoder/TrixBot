let { MessageEmbed } = require('discord.js')
module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle("Ping!")
        .setDescription(`Pinging...`)
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .setColor("#00ff27")
        .setTimestamp()
    const m = await message.channel.send(embed)
    embed.setTitle("Pong!")
    embed.setDescription(`Bot ping: ${m.createdTimestamp - message.createdTimestamp}ms\nDiscord API Latency: ${Math.round(client.ws.ping)}ms`)
    if (m.createdTimestamp - message.createdTimestamp > 800) {
        embed.setColor("#F4150A")
    }
    else if (m.createdTimestamp - message.createdTimestamp > 120) {
        embed.setColor("#FFFF00")
    }
    else {
        embed.setColor("#00ff27")
    }
    return m.edit(embed);
}

module.exports.help = {
    name: 'ping',
    aliases: ['p']
}
