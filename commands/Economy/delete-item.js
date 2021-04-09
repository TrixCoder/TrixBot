const { MessageEmbed } = require('discord.js');
let Guild = require("./../../models/guild");

module.exports.run = async (client, message, args) => {
    let usage = '``delete-item itemName/itemID``.'
    let embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 4096, format: 'png' }))
        .setTitle('Success!')
        .setColor('GREEN')

    if (!args[0]) {
        embed.setTitle('Missing arguments!')
        embed.setColor('RED')
        embed.setDescription(`Please specify the item name or item id to delete it.\n__**Usage:**__ ${usage}`)
        return message.channel.send(embed)
    }
    let guild = await Guild.findOne({ guild: message.guild.id });
    if (!guild) {
        embed.setTitle('Failed!')
        embed.setColor('RED')
        embed.setDescription(`No items found in this guild. Please add an item and try again.`)
        return message.channel.send(embed)
    }
    else {
        if (!guild.currency || guild.currency == null) {
            embed.setTitle('Failed!')
            embed.setColor('RED')
            embed.setDescription(`No items found in this guild. Please add an item and try again.`)
            return message.channel.send(embed)
        }
    }
    guild = await Guild.findOne({ guild: message.guild.id });
    let shop = guild.shop;
    let items = [];
    if (shop && shop.length > 0) {
        for (let i = 0; i < shop.length; i++) {
            items.push(shop[i].item_name);
        }
    }
    else {
        embed.setTitle('Failed!')
        embed.setColor('RED')
        embed.setDescription(`No items found in this guild. Please add an item and try again.`)
        return message.channel.send(embed)
    }
    if (isNaN(args[0]) && !items.includes(args[0])) {
        embed.setTitle('Failed!')
        embed.setColor('RED')
        embed.setDescription(`Invalid item name/item doesn't exists.`)
        return message.channel.send(embed)
    }
    if (!isNaN(args[0])) {
        if (shop.length > args[0]) {
            embed.setTitle('Failed!')
            embed.setColor('RED')
            embed.setDescription(`Invalid item id/item with this id doesn't exists.`)
            return message.channel.send(embed)
        }
        shop.pop(shop[args[0] - 1]);
        await guild.save();
    } else {
        for (let i = 0; i < shop.length; i++) {
            if (shop[i].item_name == args[0]) {
                shop.pop(shop[i]);
                await guild.save();
            }
        }
    }
    embed.setDescription(`Deleted the item.`)
    return message.channel.send(embed)
}


module.exports.help = {
    name: 'delete-item',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Delete a shop item.",
    category: "Economy"
}