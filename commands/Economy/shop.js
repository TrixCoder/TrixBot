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
    let shop = guild.shop;
    let reply = "**Shop items:**\n\n";
    for (let i = 0; i < shop.length; i++) {
        reply += `**__ID:__ ${i+1}** — **__Name:__** ${shop[i].item_emoji ? `${shop[i].item_emoji} `: ``}**${shop[i].item_name}** — **__Price:__ ${shop[i].item_price}${CURRENCY}**\n${shop[i].item_description}\n\n`;
        if (shop[i] == null || !shop[i]) {
            reply = `No items in shop`;
        }
    }
    if (shop.length == 0 || !shop) {
        reply = `No items in shop`;
    }
    return msg.channel.send(new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true, size: 4096, format: 'png' }))
        .setDescription(reply)
        .setThumbnail(`https://media.discordapp.net/attachments/822817558490120192/829723534069858364/Untitled_22.png`)
        .setTimestamp());
}

module.exports.help = {
    name: 'shop',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Check shop",
    category: "Economy"
}