let { MessageEmbed } = require('discord.js');
let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
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
    let user = await Economy.findOne({ guild: msg.guild.id, id: msg.author.id });
    let shop = user.inv;
    let reply = "**Inventory items:**\n\n";
    for (let i = 0; i < shop.length; i++) {
        reply += `**__ID:__ ${i + 1}** — **__Name:__** ${shop[i].item_emoji ? `${shop[i].item_emoji} ` : ``}**${shop[i].item_name}** — **__Quantity:__ ${shop[i].quantity}**\n${shop[i].item_description}\n\n`;
        if (shop[i] == null || !shop[i]) {
            reply = `No items in inventory`;
        }
    }
    if (shop.length == 0 || !shop) {
        reply = `No items in inventory`;
    }
    return msg.channel.send(new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true, size: 4096, format: 'png' }))
        .setDescription(reply)
        .setTimestamp());
}

module.exports.help = {
    name: 'inventory',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Check your inventory",
    category: "Economy"
}