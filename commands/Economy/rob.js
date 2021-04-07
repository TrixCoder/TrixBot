let { MessageEmbed } = require('discord.js');
let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let ms = require('ms');
let config = require(`./../../config`)
let timeout = 86400000;
let verifiedReplies = ["uh"];
let minpay = 100;
let maxpay = 200;
let minfine = 100;
let maxfine = 200;

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
    let last_used = user.rob_lastUsed;

    if (last_used !== null && (timeout - (Date.now() - last_used)) > 0) {
        let time = ms(timeout - (Date.now() - last_used));

        let timeEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
            .setDescription(`🕐 You cannot attemp to rob anyone for ${time.replace("h", "hours")}`)
        return msg.channel.send(timeEmbed)
    } else {
        let user = msg.mentions.members.first()
        let author = msg.author;

        let victim = await Economy.findOne({ id: user.id });
        let robber = await Economy.findOne({ id: author.id });
        if (user.id == author.id) {
            return msg.reply(`You can't rob yourself lol`)
        }
        if (victim == null) return msg.reply(`${user.tag} don't have an inventory in this bot.`)
        if (victim.balance < 1) {
            return msg.reply(`You can't rob ${user} because there is no money left in ${user}'s account`)
        }
        if (robber.balance < 200) {
            return msg.reply(`You need atleast ${CURRENCY}200 in your wallet to rob someone`)
        }
        let random = Math.floor(Math.random() * 100) + 1;
        if (random < 50) {
            let lost = getRandomInt(minfine, maxfine);
            robber.balance -= lost;
            robber.rob_lastUsed = Date.now();
            await robber.save().catch(console.log);
            let embed = new MessageEmbed()
                .setDescription(`❎ You were caught by police while robbing ${user} and lost ${CURRENCY}${lost}`)
                .setColor("BLUE")
                .setAuthor(msg.author.tag, msg.author.avatarURL({ dyanmic: true, format: 'png', size: 4096 }))
            return msg.channel.send(embed)
        }
        robber.rob_lastUsed = Date.now();
        robber.balance += random;
        victim.balance -= random;
        await victim.save().catch(console.log);
        await robber.save().catch(console.log);
        let embed = new MessageEmbed()
            .setDescription(`✅ You robbed ${user} and got away with ${CURRENCY}${random}`)
            .setColor("RANDOM")
        return msg.channel.send(embed);
    }
}

module.exports.help = {
    name: 'rob',
    aliases: [''],
    usage: ['<@user>'],
    example: ['@</Trixter>#0001'],
    description: "Rob anyone",
    category: "Economy"
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}