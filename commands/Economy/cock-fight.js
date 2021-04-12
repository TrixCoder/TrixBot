let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let config = require(`./../../config`)
const { MessageEmbed } = require('discord.js');

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
    let acc = await Economy.findOne({ id: msg.author.id, guild: msg.guild.id });
    if (!acc) {
        acc = new Economy({ id: msg.author.id, balance: 500, guild: msg.guild.id });
        await acc.save();
    }
    acc = await Economy.findOne({ id: msg.author.id, guild: msg.guild.id });
    let CURRENCY = guild.currency;
    if (isNaN(args[0])) return msg.channel.send(new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
        .setDescription(`❎ Invalid \`<bet>\` arguments given.`)
        .addField('USAGE:', `\`cock-fight <bet>\``)
        .setColor('RED'));
    let bet = Math.round(parseInt(args[0]))
    if (bet >= 100) {
        if (acc.balance < parseInt(args[0])) return msg.channel.send(new MessageEmbed().setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 })).setDescription(`❎ You don't have enought money for this bet.\nYou currently have ${CURRENCY}${acc.money}`).setColor('RED'));

        if (!acc.inv.find(obj => obj.item_name === "Chicken")) return msg.channel.send(new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(`❎ You need to buy a chicken from the store first using the command \`buy Chicken\`.`)
            .setColor('RED'));
        let shop = guild.shop;
        let result = null;
        for (let i = 0; i < shop.length; i++) {
            if (shop[i].item_name == `Chicken`) {
                result = true;
            }
        }
        if (!result) return msg.channel.send(new MessageEmbed()
            .setAuthor(message.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(`❎ There is no chicken in the store.`)
            .setColor('RED'));
        let random = [true, false, true, false, true, false, false, false, false, true, true, false, false]
        random = random[Math.floor(Math.random() * random.length)]

        if (random == false) {
            let arr = acc.inv;
            for (let i = 0; i < shop.length; i++) {
                if (shop[i].item_name == `Chicken` && shop[i].quantity > 1) {
                    shop[i].quantity -= 1;
                    await acc.save();
                }
                else {
                    arr.inv.splice(result.inv.findIndex(obj => obj.item_name === `Chicken`), 1)
                    await acc.save();
                }
            }
            acc.balance = acc.balance - bet;
            await acc.save();
            return msg.channel.send(new MessageEmbed()
                .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`Your chicken died ☠`)
                .setColor('RED'))
        } else {
            acc.balance = acc.balance + bet;
            await acc.save();
            return msg.channel.send(new MessageEmbed()
                .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`Your lil chicken won the fight, and made you ${CURRENCY}${bet} richer! 🐔`)
                .setColor('GREEN'))
        }
    } else return msg.channel.send(new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
        .setDescription(`❎ You must choose at least \`100\` for your bet.`)
        .setColor('RED'));
}


module.exports.help = {
    name: 'cock-fight',
    aliases: ['cf'],
    usage: ['<bet amount>'],
    example: ['200'],
    description: "Play cock-fight",
    category: "Economy"
}