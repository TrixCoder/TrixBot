let { MessageEmbed } = require('discord.js');
let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let config = require(`./../../config`)

module.exports.run = async (client, msg, args) => {
    let guild = await Guild.findOne({ guild: msg.guild.id });
    if (!guild) {
        guild = new Guild({ guild: message.guild.id, currency: config.currency, prefix: config.prefix });
        await guild.save();
    }
    else {
        if (!guild.currency || guild.currency == null) {
            await Guild.findOneAndUpdate({ guild: msg.guild.id }, { currency: config.currency }, { useFindAndModify: false });
        }
    }
    guild = await Guild.findOne({ guild: msg.guild.id });
    let CURRENCY = guild.currency;
    let member;
    if (args[0] && isNaN(args[0])) member = msg.mentions.users.first();
    else {
        if (!args[0]) member = msg.author;
        else {
            member = msg.guild.members.cache.get(args[0]).user;
        }
    }
    let user = await Economy.findOne({ id: member.id, guild: msg.guild.id });
    if (!user) {
        user = new Economy({ id: member.id, balance: 500, guild: msg.guild.id });
        await user.save();
    }

    return msg.channel.send(new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(member.tag, member.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
        .setDescription(`Balance: ${CURRENCY}${user.balance}`)
        .setTimestamp());
}

module.exports.help = {
    name: 'balance',
    aliases: ['bal'],
    usage: ['[user]'],
    example: ['', '@</Trixter>#0001'],
    description: "Check balance",
    category: "Economy"
}