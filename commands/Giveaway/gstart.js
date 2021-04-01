const { MessageEmbed } = require('discord.js');
let ms = require('ms');

module.exports.run = async (client, message, args) => {
    message.delete();
    const messageArray = message.content.split(" ");
    if (!message.member.hasPermission(["ADMINISTRATOR"]) || !message.member.roles.cache.some(role => role.name === 'Giveaways')) return message.channel.send("You don't have either `Giveaways` role or `ADMINISTRATOR` perms to use this command! ")
    var item = "";
    var time;
    var winnerCount;
    for (var i = 2; i < args.length; i++) {
        item += (args[i] + " ");
    }
    time = args[0];
    if (!time) {
        return message.channel.send(`Missing giveaway duration`);
    }
    if (!item) {
        return message.channel.send(`Missing item name.`);
    }
    let t = ms(ms(time), {long: true});
    if(!t.endsWith('seconds')) return;
    var embed = new MessageEmbed();
    embed.setColor("BLUE");
    embed.setTitle(item);
    embed.setDescription(`Duration : ${ms(ms(time), {long: true})}`);
    embed.setFooter("React to this message with 🎉 to participate !");
    var embedSent = await message.channel.send(embed);
    embedSent.react("🎉");

    setTimeout(async () => {
        try {
            const peopleReactedBot = await embedSent.reactions.cache.get("🎉").users.fetch();
            var peopleReacted = peopleReactedBot.array().filter(u => u.id !== client.user.id);
        } catch (e) {
            return message.channel.send(`An unknown error happened during the draw of the giveaway **${item}** : ` + "`" + e + "`")
        }
        var winner;

        if (peopleReacted.length <= 0) {
            return message.channel.send(`Not enough participants to execute the draw of the giveaway **${item}** :(`);
        } else {
            var index = Math.floor(Math.random() * peopleReacted.length);
            winner = peopleReacted[index];
        }
        if (!winner) {
            message.channel.send(`An unknown error happened during the draw of the giveaway **${item}**`);
        } else {
            message.channel.send(` Congratulations 🎉! **${winner.toString()}** has won the giveaway **${item}**!`);
        }
    }, ms(time));
}

module.exports.help = {
    name: 'giveawaystart',
    aliases: ['gstart']
}