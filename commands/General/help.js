let { MessageEmbed } = require('discord.js')
let Guild = require(`./../../models/guild`)
let config = require(`./../../config`)

module.exports.run = async (client, message, args) => {
    const guild = await Guild.findOne({ guild: message.guild.id });
    if (!guild) {
        const server = new Guild({ guild: message.guild.id, prefix: config.prefix });
        await server.save();
    }
    let prefix = guild.prefix || config.prefix;
    if (prefix == null) prefix = config.prefix;

    if (args[0]) {
        let command = client.commands.get(args[0]) ? client.commands.get(args[0]) : 'Invalid command';
        let helpDesc;

        if (command == "Invalid command") helpDesc = command;
        else {
            let c = command;
            let alias = "";
            let usage = "";
            let example = "";

            for (let i = 0; i < c.help.aliases.length; i++) {
                if (i == c.help.aliases.length - 1) {
                    alias += `\`${c.help.aliases[i]}\``;
                }
                else {
                    alias += `\`${c.help.aliases[i]}\`, `;
                }
            }
            for (let i = 0; i < c.help.usage.length; i++) {
                if (i == c.help.usage.length - 1) {
                    usage += `<a:next:823926486989275156> \`${prefix}${c.help.name} ${c.help.usage[i]}\`\n`;
                }
                else {
                    usage += `<a:next:823926486989275156> \`${prefix}${c.help.name} ${c.help.usage[i]}\`\n`;
                }
            }
            for (let i = 0; i < c.help.example.length; i++) {
                if (i == c.help.example.length - 1) {
                    example += `<a:next:823926486989275156> \`${prefix}${c.help.name} ${c.help.example[i]}\`\n`;
                }
                else {
                    example += `<a:next:823926486989275156> \`${prefix}${c.help.name} ${c.help.example[i]}\`\n`;
                }
            }
            helpDesc = `Name: \`${c.help.name}\`\nCategory: \`${c.help.category}\`\nDescription: \`${c.help.description}\`\n${alias && !alias == '``' && !alias == '' ? `Alias: ${alias}\n` : ``}Usage: \n${usage}\nExample: \n${example}\n\n`;
        }
        let embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
            .setDescription(helpDesc)
        return message.channel.send(embed)
    }
    let page = 0;
    let pageContent = "";
    let pageCategory = "";
    if (page == 0) {
        pageCategory = "General"
    }
    let cn = 0;
    client.commands.forEach(c => {
        if (c.help.category == pageCategory) {
            cn += 1;
            pageContent += `${cn}) ${prefix}${c.help.name} - ${c.help.description}\n\n`;
        }
    });
    let embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setTitle(`${pageCategory} commands - Help`)
        .setDescription(pageContent)
    let pg = await message.channel.send(embed)
    await pg.react('⏮️');
    await pg.react('⏭️');
    const collector = pg.createReactionCollector(
        (reaction, user) => ['⏭️', '⏮️'].includes(reaction.emoji.name) && user.id === message.author.id,
        { time: 60000 }
    )

    collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name == '⏭️') {
            await reaction.users.remove(user.id);
            page += 1;
            if (page < 0) {
                page = 5;
            }
            if (page > 5) {
                page = 0;
            }
            pageContent = "";
            if (page == 0) {
                pageCategory = "General"
            }
            if (page == 1) {
                pageCategory = "Fun"
            }
            if (page == 2) {
                pageCategory = "Economy"
            }
            if (page == 3) {
                pageCategory = "Giveaway"
            }
            if (page == 4) {
                pageCategory = "Admin"
            }
            if (page == 5) {
                pageCategory = "Nitro"
            }
            let cn = 0;
            client.commands.forEach(c => {
                if (c.help.category == pageCategory) {
                    cn += 1;
                    pageContent += `${cn}) ${prefix}${c.help.name} - ${c.help.description}\n\n`;
                }
            });
            let embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${pageCategory} commands - Help`)
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
                .setDescription(pageContent)
            await pg.edit(embed);
        }
        if (reaction.emoji.name == '⏮️') {
            await reaction.users.remove(user.id);
            page -= 1;
            if (page < 0) {
                page = 5;
            }
            if (page > 5) {
                page = 0;
            }
            pageContent = "";
            if (page == 0) {
                pageCategory = "General"
            }
            if (page == 1) {
                pageCategory = "Fun"
            }
            if (page == 2) {
                pageCategory = "Economy"
            }
            if (page == 3) {
                pageCategory = "Giveaway"
            }
            if (page == 4) {
                pageCategory = "Admin"
            }
            if (page == 5) {
                pageCategory = "Nitro"
            }
            let cn = 0;
            client.commands.forEach(c => {
                if (c.help.category == pageCategory) {
                    cn += 1;
                    pageContent += `${cn}) ${prefix}${c.help.name} - ${c.help.description}\n\n`;
                }
            });
            let embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${pageCategory} commands - Help`)
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
                .setDescription(pageContent)
            await pg.edit(embed);
        }
    })
    collector.on('end', async (reaction, user) => {
        pg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    });
}

module.exports.help = {
    name: 'help',
    aliases: [''],
    usage: ['[command]'],
    example: ['', 'ping'],
    description: 'Get details of commands/a particular command',
    category: "General"
}