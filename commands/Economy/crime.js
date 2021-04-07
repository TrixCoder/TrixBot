let { MessageEmbed } = require('discord.js');
let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let ms = require('ms');
let config = require(`./../../config`)
let crimes = ["robbed a bank and won {amount}", "stole a bread loaf and won {amount}", "found money on the ground and won {amount}", "hacked discord and won {amount}", "stole a carpet and won {amount}", "stole your friend's chair and won {amount}"];
let timeout = 43200000;
let failReplies = ["were caught by police and were fined {amount}"];
let fail_rate = 1;
let minpay = 50;
let maxpay = 100;
let maxfine = 50;
let minfine = 100;
let fine_type = "100%";

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
    let message = msg;
    let user = await Economy.findOne({ id: msg.author.id });
    if (!user) {
        user = new Economy({ id: msg.author.id, balance: 500 });
        await user.save();
    }
    let last_used = user.crime_lastUsed;
    if (last_used !== null && (timeout - (Date.now() - last_used)) > 0) {
        let time = ms(timeout - (Date.now() - last_used));
        let timeEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
            .setDescription(`🕐 You cannot commit a crime for ${time.replace("h", "hours")}`)
        return msg.channel.send(timeEmbed)
    } else {

        let chance = Math.floor(Math.random() * 100) <= fail_rate;

        let verifiedReplies = crimes;

        let randomReplies = verifiedReplies[Math.floor(Math.random() * verifiedReplies.length)]; //ig this random will do
        let randomAmount = getRandomInt(minpay, maxpay);

        let money = getRandomInt(minpay, maxpay);
        let odds = Math.floor(Math.random() * 3)

        let worker = await Economy.findOne({ id: msg.author.id });
        if (chance) {

            let fine = getRandomInt(minfine, maxfine);

            if (fine_type.endsWith('%')) fine = parseInt(worker.balance / 100 * fine);

            worker.balance -= fine;
            worker.crime_lastUsed = Date.now();

            const failed = failReplies;

            const randomFail = failed[Math.floor(Math.random() * failed.length)].replace(/{amount}/gi, CURRENCY + fine)
                .replace(/{user}/gi, msg.author.tag);

            await worker.save().catch(console.log);
            let embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, size: 4096 }))
                .setColor('RED')
                .setDescription(`❎ ${message.author} ${randomFail}`)
                .setFooter(`Reply #${failed.indexOf(randomFail)}`);
            return message.channel.send(embed)
        }

        worker.balance += money;
        worker.crime_lastUsed = Date.now();

        await worker.save().catch(console.log);

        let embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, msg.author.displayAvatarURL())
            .setColor("GREEN")
            .setDescription(`✅ ${message.author} ${randomReplies.replace(/{amount}/gi, CURRENCY + randomAmount)
                .replace(/{user}/gi, msg.author.tag)}`);
        message.channel.send(embed)
    }
}

module.exports.help = {
    name: 'crime',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Commit crime to earn money",
    category: "Economy"
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
