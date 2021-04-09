const { MessageEmbed, Message, MessageCollector } = require('discord.js');
let Guild = require("./../../models/guild");
let config = require(`./../../config`)

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
    let shop = guild.shop;
    let items = [];
    if (shop && shop.length > 0) {
        for (let i = 0; i < shop.length; i++) {
            items.push(shop[i].item_name.toLowerCase());
        }
    }
    else {
        items = [];
    }
    let embed = new MessageEmbed()
        .setTitle('Item info')
        .setColor('BLUE')
        .setFooter(`Respond with \`Cancel\` to Cancel anytime`);
    const collector = new MessageCollector(message.channel, (msg) => msg.author.id === message.author.id, {
        time: 600000
    });
    const msg = await message.channel.send(`What will be the name of item?`, embed);
    let type = 'name';
    let name, description, cost, emoji;
    collector.on('collect', async (message2) => {
        if (message2.content.toLowerCase() === 'cancel') return collector.stop('cancelled');
        if (type === 'name') {
            name = message2.content;
            if (items.includes(message2.content.toLowerCase())) return message.channel.send(`There is already an item called \`${name}\``);
            type = 'description';
            embed.addField('**Name**', name, true)
            return msg.edit(`What will be the description of ${name}?`, embed);
        }
        else if (type === 'description') {
            description = message2.content;
            type = 'cost';
            embed.addField('**Description**', description, true)
            return msg.edit(`What will be the buy cost of ${name}?`, embed);
        }
        else if (type === 'cost') {
            if (isNaN(message2.content) || parseInt(message2.content) < 0) {
                return message.channel.send(`Invalid amount.`);
            }

            cost = parseInt(message2.content);

            type = 'emoji';
            embed.addField(`**Cost**`, `${CURRENCY} ${cost}`, true)


            return msg.edit(`What will be the item emoji?\nType null/none if you don't want any.`, embed);
        } else if (type === 'emoji') {

            emoji = message2.content;
            embed.addField(`**Item emoji**`, `${emoji}`, true)
            msg.edit(embed);

            collector.stop();
            if (emoji.toLowerCase() == "null") emoji = null;
            if (emoji.toLowerCase() == "none") emoji = null;
            shop.push(
                {
                    item_name: name,
                    item_price: cost,
                    item_emoji: emoji,
                    item_description: description
                }
            );
            await guild.save();

            collector.stop();

            return message.channel.send(`Created Item!`);

        }
    })

    collector.on('end', (_c, reason) => {
        if (['time', 'cancelled'].includes(reason)) return message.channel.send(new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`Cancelled the creation of item.`));
    })
}


module.exports.help = {
    name: 'create-item',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Create a shop item.",
    category: "Economy"
}