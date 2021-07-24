let { MessageEmbed } = require('discord.js')
let Guild = require(`./../../models/guild`)
let config = require(`./../../config`)
let { MessageButton } = require('discord-buttons')

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

        if (command == "Invalid command") {
            let as = [];
            client.commands.forEach(c => {
                as.push(c.help)
            });
            for (let j = 0; j < as.length; j++) {
                if (isNaN(args[0]) && as[j].aliases.includes(args[0].toLowerCase())) {
                    let alias = "";
                    let usage = "";
                    let example = "";

                    for (let i = 0; i < as[j].aliases.length; i++) {
                        if (i == as[j].aliases.length - 1) {
                            alias += `\`${as[j].aliases[i]}\``;
                        }
                        else {
                            alias += `\`${as[j].aliases[i]}\`, `;
                        }
                    }
                    for (let i = 0; i < as[j].usage.length; i++) {
                        if (i == as[j].usage.length - 1) {
                            usage += `<a:next:823926486989275156> \`${prefix}${as[j].name} ${as[j].usage[i]}\`\n`;
                        }
                        else {
                            usage += `<a:next:823926486989275156> \`${prefix}${as[j].name} ${as[j].usage[i]}\`\n`;
                        }
                    }
                    for (let i = 0; i < as[j].example.length; i++) {
                        if (i == as[j].example.length - 1) {
                            example += `<a:next:823926486989275156> \`${prefix}${as[j].name} ${as[j].example[i]}\`\n`;
                        }
                        else {
                            example += `<a:next:823926486989275156> \`${prefix}${as[j].name} ${as[j].example[i]}\`\n`;
                        }
                    }
                    helpDesc = `Name: \`${as[j].name}\`\nCategory: \`${as[j].category}\`\nDescription: \`${as[j].description}\`\n${alias && !alias.endsWith('``') ? `Alias: ${alias}\n` : ``}Usage: \n${usage}\nExample: \n${example}\n\n`;
                    let embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
                        .setDescription(helpDesc)
                    return message.channel.send(embed)
                }
                else {
                    helpDesc = command
                }
            }
        }
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
            helpDesc = `Name: \`${c.help.name}\`\nCategory: \`${c.help.category}\`\nDescription: \`${c.help.description}\`\n${alias && !alias.endsWith('``') ? `Alias: ${alias}\n` : ``}Usage: \n${usage}\nExample: \n${example}\n\n`;
        }
        let embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
            .setDescription(helpDesc)
        return message.channel.send(embed)
    }

    // page code
    let pageCategories = [];
    let page = 0;
    client.commands.forEach(c => {
        let found = pageCategories.find(category => category === c.help.category);
        if (!found) {
            pageCategories.push(c.help.category);
        }
    })
    let pageContent = await loadContent(client, prefix, pageCategories[page]);

    let firstbutton = new MessageButton()
        .setStyle("green")
        .setID("1")
        .setLabel("<")

    let secondbutton = new MessageButton().setStyle("blurple").setID("2").setLabel(">")

    var buttonarray = [firstbutton, secondbutton]
    let embed = new MessageEmbed()
        .setTitle(`${pageCategories[page]} commands - Help`)
        .setColor("RANDOM")
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, format: 'png', size: 4096 }))
        .setDescription(pageContent)

    let mybuttonsmsg = await message.channel.send({ embed: embed, buttons: buttonarray })

    const collector = mybuttonsmsg.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 60e3 });

    collector.on("collect", async (b) => {
        b.reply.defer();
        if (b.id == "3") {
            page = 0;
            embed.setTitle(`${pageCategories[page]} commands - Help`)
            embed.setDescription(pageContent)
            mybuttonsmsg.edit({ embed: embed, buttons: buttonarray })
        }
        else if (b.id == "1") {
            if (page !== 0) {
                --page;
                pageContent = await loadContent(client, prefix, pageCategories[page]);
                embed.setTitle(`${pageCategories[page]} commands - Help`)
                embed.setDescription(pageContent)
                mybuttonsmsg.edit({ embed: embed, buttons: buttonarray })
            } else {
                page = pageCategories.length - 1;
                embed.setTitle(`${pageCategories[page]} commands - Help`)
                embed.setDescription(pageContent)
                mybuttonsmsg.edit({ embed: embed, buttons: buttonarray })
            }
        }
        else if (b.id == "2") {
            if (page < pageCategories.length - 1) {
                page++;
                pageContent = await loadContent(client, prefix, pageCategories[page]);
                embed.setTitle(`${pageCategories[page]} commands - Help`)
                embed.setDescription(pageContent)
                mybuttonsmsg.edit({ embed: embed, buttons: buttonarray })
            } else {
                page = 0;
                embed.setTitle(`${pageCategories[page]} commands - Help`)
                embed.setDescription(pageContent)
                mybuttonsmsg.edit({ embed: embed, buttons: buttonarray })
            }
        }
    })

}

module.exports.help = {
    name: 'help',
    aliases: [''],
    usage: ['[command]'],
    example: ['', 'ping'],
    description: 'Get details of commands/a particular command',
    category: "General"
}


async function loadContent(client, prefix, field) {
    let cn = 0;
    let pagec = "";
    client.commands.forEach(c => {
        if (c.help.category === field) {
            cn += 1;
            pagec += `${cn}) ${prefix}${c.help.name} - ${c.help.description}\n\n`;
        }
    });
    return pagec;
}