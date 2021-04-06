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
    let user = await Economy.findOne({ id: msg.author.id }) || new Economy({ id: msg.author.id });

    let timeout = 43200000;
    let amount = 500;

    var date_format = new Date();
    let m = date_format.getMonth()
    let d = date_format.getDate() - 1
    let y = date_format.getFullYear()
    
    let daily = user.daily_lastUsed;

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
        let time = ms(timeout - (Date.now() - daily));
        return msg.channel.send(new MessageEmbed()
            .setColor('RED')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
            .setDescription(`You've already collected your daily reward\n\nCollect it again in ${time.replace("h", "hours")}`));
    } else {
        user.balance += amount;
        user.daily_lastUsed = Date.now();
        await user.save();

        return msg.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
            .setDescription(`You've collected your daily reward of ${CURRENCY}${amount}.`));
    }
}

module.exports.help = {
    name: 'daily',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Claim daily reward",
    category: "Economy"
}