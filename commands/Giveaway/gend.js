const { MessageEmbed } = require('discord.js');
let ms = require('ms');
let GiveawaySchema = require(`./../../models/giveaway`)
const { classToPlain } = require("class-transformer");
const { stripIndentTransformer } = require("common-tags");
const moment = require("moment");

async function fetchReactedUsers(reaction, after) {
    const opts = { limit: 100, after };
    const reactions = await reaction.users.fetch(opts);
    if (!reactions.size) return [];

    const last = reactions.last().id;
    const next = await fetchReactedUsers(reaction, last);
    return reactions.array().concat(next);
}

async function emd(channel, author, title, description, color, fields, footer, thumbnail, image, files, url) {
    let embed = new MessageEmbed()

    if (author) {
        if (typeof author !== "object") throw new Error(`Title must be a object.`);
        embed.setAuthor(author.name, author.av)
    }

    if (title) {
        if (typeof title !== "string") throw new Error(`title must be a string.`);
        embed.setTitle(title);
    }

    if (description) {
        if (typeof description !== "string") throw new Error(`Description must be a string.`)
        embed.setDescription(description);
    }
    embed.setColor(color ? color : "#05f5fc")


    if (fields) {
        if (Array.isArray(fields)) {
            fields.forEach(r => {
                embed.addField(r.name, r.value, (r.inline) ? r.inline : false);
            });
        }

    }
    if (footer) {
        if (typeof footer !== "object") throw new Error(`Footer must be a object`)
        embed.setFooter(footer.name, footer.av)
            .setTimestamp();
    }
    if (thumbnail) {
        if (typeof thumbnail !== "string") throw new Error(`Thumbnail is not a string.`);
        embed.setThumbnail(thumbnail);
    }
    if (image) {
        if (typeof image !== "string") throw new Error(`Image must be a string url.`);
        embed.setImage(image);

    }

    if (files) {
        if (Array.isArray(files)) {
            embed.attachFiles(files);
        }
    }

    return channel.send(embed);
}

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.some(r => r.name === "Giveaways")) return message.channel.send('You need manage server permission or Giveaways role to use this command')

    if (!args[0] || !message.channel.messages.fetch(args[0])) {
        return message.channel.send(`${fail} Invalid Message Id Given. Either not provided or doesn't exist in the channel.`);
    }
    let msg = await message.channel.messages.fetch(args[0]);

    let result = await GiveawaySchema.findOne({ id: message.guild.id, channel: message.channel.id, msgId: msg.id, enabled: true });

    if (!result) return message.channel.send(`${fail} No Giveaway running with that message id.`);

    let embed = new MessageEmbed(result.embed)


    const reaction = msg.reactions.cache.get("🎉");


    let users = await fetchReactedUsers(reaction);

    const list = await users.filter(u => u.bot !== true);

    if (!list.length) {

        embed.description = `Winner: No one.`;
        embed.footer.text = `Giveaway Finished`;

        result.enabled = false;

        await result.save().catch(e => console.log(e));
        //await GiveawaySchema.deleteOne({id: result.id, enabled: true, channel: result.channel, msgId: result.msgId})
        return msg.edit(embed);
    }

    let winners = [];
    for (let i = 0; i < result.winnerCount; i++) {
        const x = draw(list);

        if (!winners.includes(x)) winners.push(x);
    }

    embed.description = `Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
    embed.footer.text = `Giveaway Finished`;


    await msg.edit(embed);
    result.enabled = false

    await result.save().catch(e => console.log(e))
    if (winners.length) msg.channel.send(`Congratulations, ${winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${result.prize}**!`);

}

module.exports.help = {
    name: 'gend',
    aliases: ['giveawayend'],
    category: 'Giveaway',
    usage: ['<message id>'],
    description: 'End a particular giveaway',
    example: ['828479749436866601']
}