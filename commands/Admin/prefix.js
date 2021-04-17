const { MessageEmbed } = require('discord.js');
let Guild = require(`./../../models/guild`)
let config = require(`./../../config`)

module.exports.run = async (client, message, args) => {
    const guild = await Guild.findOne({ id: message.guild.id });
    if (!guild) {
        const server = new Guild({ guild: message.guild.id, prefix: config.prefix });
        await server.save();
    }
    let nguild = await Guild.findOne({ guild: message.guild.id });
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
    if (!args[0]) return message.channel.send(`Current Prefix: **${nguild.prefix || config.prefix}**\nTo set new prefix use: \`${nguild.prefix || config.prefix}prefix <new prefix>\``)
    let px = args.slice(0).join(" ");
    if (px.length > 5) return message.channel.send(`Max prefix length is 5 characters`);
    await Guild.findOneAndUpdate({ guild: message.guild.id }, { prefix: px }, { useFindAndModify: false })
    return message.channel.send(`Server's new prefix is now: ${px}`);

}

module.exports.help = {
    name: 'prefix',
    aliases: [''],
    usage: ['<new prefix>'],
    example: ['t!'],
    description: "Set a custom prefix for your server",
    category: "Admin"
}