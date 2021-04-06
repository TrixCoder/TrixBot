const { MessageEmbed } = require('discord.js');
const Economy = require("./../../models/economy");
const Guild = require("./../../models/guild");
const ms = require('ms');
let config = require(`./../../config`)

module.exports.run = async (client, msg, args) => {
    let guild = await Guild.findOne({ guild: msg.guild.id });
    if (!guild) {
        guild = new Guild({ guild: msg.guild.id, currency: config.currency, prefix: config.prefix });
        await guild.save();
    }
    else {
        if (!guild.currency || guild.currency == null) {
            await Guild.findOneAndUpdate({ guild: msg.guild.id }, { currency: config.currency }, { useFindAndModify: false });
        }
    }
    guild = await Guild.findOne({ guild: msg.guild.id });
    let CURRENCY = guild.currency;
    if (!args[0]) return msg.reply(`Missing \`<@user>\` argument! Please use \`${guild.prefix}give <@user> <amount>\`.`)
    let member;
    if (args[0] && isNaN(args[0])) member = msg.mentions.users.first();
    else {
        if (!args[0]) member = msg.author;
        else {
            member = msg.guild.members.cache.get(args[0]).user;
        }
    }
    let author = await Economy.findOne({ id: msg.author.id });
    if (!author) {
        author = new Economy({ id: msg.author.id, balance: 500 });
        await author.save();
    }
    let user = await Economy.findOne({ id: member.id });
    if (!user) {
        user = new Economy({ id: member.id, balance: 500 });
        await user.save();
    }
    if (author.balance < parseInt(args[1])) return msg.reply(`You don't have ${CURRENCY}${parseInt(args[1])} to give.`);
    user.balance += parseInt(args[1]);
    author.balance -= parseInt(args[1]);
    await author.save();
    await user.save();
    return msg.channel.send(new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
        .setDescription(`Gave ${CURRENCY}${parseInt(args[1])} to ${member}`));
}

module.exports.help = {
    name: 'give',
    aliases: [''],
    usage: ['<@user> amount'],
    example: ['@</Trixter>#0001 '],
    description: "Claim daily reward",
    category: "Economy"
}