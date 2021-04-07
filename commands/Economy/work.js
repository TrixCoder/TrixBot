let { MessageEmbed } = require('discord.js');
let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let ms = require('ms');
let config = require(`./../../config`)
let timeout = 72500000;
let verifiedReplies = ["Great you worked hard", "Wow you earned alot"];
let minpay = 1;
let maxpay = 30;

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
    let user = await Economy.findOne({ id: msg.author.id });
    if (!user) {
        user = new Economy({ id: msg.author.id, balance: 500 });
        await user.save();
    }
    user = await Economy.findOne({ id: msg.author.id });
    let last_used = user.work_lastUsed;
    if (last_used !== null && timeout - (Date.now() - last_used) > 0) {
        let time = ms(timeout - (Date.now() - last_used));
        let timeEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
            .setDescription(`🕐 You cannot work for ${time.replace("h", "hours")}`)
        return msg.channel.send(timeEmbed)
    } else {
        //WORK_MIN_PAY, WORK_MAX_PAY

        let randomReplies = verifiedReplies[Math.floor(Math.random() * verifiedReplies.length)]; //ig this random will do
        let randomAmount = getRandomInt(minpay, maxpay);
        randomReplies = randomReplies.replace(/{amount}/gi, randomAmount)
            .replace(/{user}/gi, msg.author.tag)
        let replies = verifiedReplies;
        let newBal = user.balance + randomAmount;
        await Economy.findOneAndUpdate({ id: msg.author.id }, { balance: newBal }, { useFindAndModify: false });
        await Economy.findOneAndUpdate({ id: msg.author.id }, { work_lastUsed: Date.now() }, { useFindAndModify: false });
        let uh = await Economy.findOne({ id: msg.author.id });
        return msg.channel.send(new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096, format: 'png' }))
            .setDescription(`${randomReplies} ${CURRENCY}${randomAmount}`)
            .setFooter(`Reply #${replies.indexOf(randomReplies) + 1}`));
    }
}

module.exports.help = {
    name: 'work',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Work hard and get income",
    category: "Economy"
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}