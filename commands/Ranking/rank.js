const { MessageAttachment, Message } = require('discord.js');
const Level = require('../../models/level.js');
const canvacord = require("canvacord");

module.exports.run = async (client, msg, args) => {
    let usr = msg.mentions.users.first() || msg.author;
    let member = msg.guild.members.cache.get(usr.id);

    const result = await Level.findOne({ id: member.id }) || await new Level({ id: member.id }).save().catch(console.error);
    const level = result.level;
    const rankIndex = (await Level.find({})).sort((a, b) => b.level*b.xp - a.level*a.xp).findIndex(res => res.id === member.id) + 1;

    const tempXp = Math.pow(level * 4, 2);

    const currentXp = result.xp;

    const neededXp = 10 * (level * level) + 90 * level + 100;
    let message = msg;
    const channel = message.channel;

    let user = await Level.findOne({ id: member.id });
    if (!user) user = new Level({ id: member.id, custom_bg: undefined });
    user = await Level.findOne({ id: member.id });
    let bg = user.custom_bg;
    member = member.user;
    const rank = new canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ format: "png" }))
        .setCurrentXP(currentXp)
        .setRequiredXP(neededXp)
        .setLevel(level)
        .setRank(rankIndex)
        .setBackground('IMAGE', bg)
        .setStatus(member.presence.status)
        .setProgressBar("#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }), "COLOR")
        .setProgressBarTrack("WHITE", "COLOR")
        .setUsername(member.username)
        .setDiscriminator(member.discriminator);

    rank.build()
        .then(data => {
            const attachment = new MessageAttachment(data, "RankCard.png");
            message.channel.send(attachment);
        });
}

module.exports.help = {
    name: 'rank',
    aliases: [''],
    category: 'Ranking',
    usage: ['', '[@user]'],
    description: 'Check rank',
    example: ['', '@</Trixter>#0001']
}
