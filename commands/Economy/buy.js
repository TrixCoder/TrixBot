const { MessageEmbed, Message, MessageCollector, UserManager } = require('discord.js');
let Guild = require("../../models/guild");
let config = require(`../../config`)
let Economy = require("../../models/economy");

module.exports.run = async (client, message, args) => {
    let guild = await Guild.findOne({ guild: message.guild.id });
    if (!guild) {
        guild = new Guild({ guild: message.guild.id, currency: config.currency, prefix: config.prefix });
        await guild.save();
    }
    else {
        if (!guild.currency || guild.currency == null) {
            await Guild.findOneAndUpdate({ guild: message.guild.id }, { currency: config.currency }, { useFindAndModify: false });
        }
    }
    guild = await Guild.findOne({ guild: message.guild.id });
    let CURRENCY = guild.currency;
    let embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 4096, format: 'png' }))
        .setTitle('Success!')
        .setColor('GREEN')

    if (!args[0]) {
        embed.setTitle('Missing arguments!')
        embed.setColor('RED')
        embed.setDescription(`Please specify the item name or item id to buy it.\n__**Usage:**__ ${usage}`)
        return message.channel.send(embed)
    }
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
    let user = await Economy.findOne({ id: message.author.id, guild: message.guild.id });
    if (!user) {
        user = new Economy({ id: message.author.id, balance: 500, guild: message.guild.id });
        await user.save();
    }
    user = await Economy.findOne({ id: message.author.id, guild: message.guild.id });
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
        embed.setDescription(`Invalid item name/item name.`)
        return message.channel.send(embed)
    }
    if (!isNaN(args[0])) {
        if (shop.length > args[0]) {
            embed.setTitle('Failed!')
            embed.setColor('RED')
            embed.setDescription(`Invalid item id/itemName.`)
            return message.channel.send(embed)
        }
        let invExist = false;
        let itemPrice = 0;
        if (user.inv && user.inv.length > 0) {
            for (let i = 0; i < user.inv.length; i++) {
                if (user.inv[i].item_name == shop[args[0] - 1].item_name) {
                    invExist = true;
                    if (args[1] && !isNaN(args[1])) {
                        itemPrice = parseInt(shop[args[0] - 1].item_price) * parseInt(args[1]);
                    }
                    if (!args[1]) {
                        itemPrice = parseInt(shop[args[0] - 1].item_price);
                    }
                    if (user.balance >= itemPrice) {
                        if (args[1] && !isNaN(args[1])) {
                            let qnt = parseInt(user.inv[i].quantity);
                            qnt += parseInt(args[1]);
                            user.inv[i].quantity = qnt;
                            //await user.save();
                        }
                        else {
                            let qnt = parseInt(user.inv[i].quantity) + 1;
                            user.inv[i].quantity = qnt;
                            //await user.save();
                        }
                    }
                    else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${user.inv[i].item_name}` : user.inv[i].item_name}`)
                }
            }
        }
        if (invExist == false) {
            let item = shop[args[0] - 1];
            if (args[1] && !isNaN(args[1])) {
                itemPrice = parseInt(shop[args[0] - 1].item_price) * parseInt(args[1]);
                if (user.balance > itemPrice) {
                    user.inv.push({ item_name: item.item_name, item_price: item.item_price, item_emoji: item.item_emoji, item_description: item.item_description, quantity: parseInt(args[1]) });
                    //await user.save();
                }
                else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${item.item_name}` : item.item_name}`)
            }
            else {
                itemPrice = parseInt(shop[args[0] - 1].item_price);
                if (user.balance > itemPrice) {
                    user.inv.push({ item_name: item.item_name, item_price: item.item_price, item_emoji: item.item_emoji, item_description: item.item_description, quantity: 1 });
                    //await user.save();
                }
                else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${item.item_name}` : item.item_name}`)
            }
        }
        user.balance -= itemPrice;
        await user.save();
    } else {
        for (let i = 0; i < shop.length; i++) {
            if (shop[i].item_name == args[0]) {
                let invExist = false;
                let itemPrice = 0;
                if (user.inv && user.inv.length > 0) {
                    for (let j = 0; j < user.inv.length; j++) {
                        if (user.inv[j].item_name == shop[i].item_name) {
                            invExist = true;
                            if (args[1] && !isNaN(args[1])) {
                                itemPrice = parseInt(shop[i].item_price) * parseInt(args[1]);
                            }
                            if (!args[1]) {
                                itemPrice = parseInt(shop[i].item_price);
                            }
                            if (user.balance >= itemPrice) {
                                if (args[1] && !isNaN(args[1])) {
                                    user.inv[j].quantity += parseInt(args[1]);
                                    //await user.save();
                                }
                                else {
                                    user.inv[j].quantity += 1;
                                    //await user.save();
                                }
                            }
                            else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${user.inv[j].item_name}` : user.inv[i].item_name}`)
                        }
                    }
                }
                if (invExist == false) {
                    let item = shop[i];
                    if (args[1] && !isNaN(args[1])) {
                        itemPrice = parseInt(shop[args[0] - 1].item_price) * parseInt(args[1]);
                        if (user.balance > itemPrice) {
                            user.inv.push({ item_name: item.item_name, item_price: item.item_price, item_emoji: item.item_emoji, item_description: item.item_description, quantity: parseInt(args[1]) });
                            //await user.save();
                        }
                        else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${item.item_name}` : item.item_name}`)
                    }
                    else {
                        itemPrice = parseInt(shop[args[0] - 1].item_price);
                        if (user.balance > itemPrice) {
                            user.inv.push({ item_name: item.item_name, item_price: item.item_price, item_emoji: item.item_emoji, item_description: item.item_description, quantity: 1 });
                            //await user.save();
                        }
                        else return message.channel.send(`You can't afford ${args[1] ? `${args[1]}x ${item.item_name}` : item.item_name}`)
                    }
                }
                user.balance -= itemPrice;
                await user.save();
            }
        }
    }
    await Economy.findOneAndUpdate({ id: message.author.id, guild: message.guild.id }, { inv: user.inv }, { useFindAndModify: false });
    embed.setDescription(`Successfully bought the item.`)
    return message.channel.send(embed)
}


module.exports.help = {
    name: 'buy',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Buy a shop item.",
    category: "Economy"
}