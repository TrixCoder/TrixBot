let Economy = require("./../../models/economy");
let Guild = require("./../../models/guild");
let config = require(`./../../config`)
const { MessageEmbed, MessageCollector } = require('discord.js');
var coloures = ['black', 'red'];
var suits = ['S', 'H', 'D', 'C'];
var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

module.exports.run = async (client, msg, args) => {
    let guild = await Guild.findOne({ guild: msg.guild.id });
    if (!guild) {
        guild = new Guild({ guild: message.guild.id, currency: config.currency, prefix: config.prefix });
        await guild.save();
    }
    else {
        if (!guild.currency || guild.currency == null) {
            await Guild.findOneAndUpdate({ guild: msg.guild.id }, { currency: config.currency }, { useFindAndModify: false });
        }
    }
    guild = await Guild.findOne({ guild: msg.guild.id });
    let user = await Economy.findOne({ id: msg.author.id, guild: msg.guild.id });
    if (!user) {
        user = new Economy({ id: msg.author.id, balance: 500, guild: msg.guild.id });
        await user.save();
    }
    user = await Economy.findOne({ id: msg.author.id, guild: msg.guild.id });
    let CURRENCY = guild.currency;
    let gd = client.guilds.cache.get("810536143833268257");
    let usage = `\`${guild.prefix}blackjack <bet amount>\``;

    let bal = user.balance;
    const acc = await msg.author.id;
    if (args[0] == "half") {
        args[0] = bal / 2;
    }
    if (args[0] == "all") {
        args[0] = bal;
    }
    if (!args[0]) {
        let embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(`❎ Too few arguments given.`)
            .setColor("RED")
            .addField('Usage:', usage)
        return msg.channel.send(embed)
    }
    if (isNaN(args[0])) {
        let embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(`❎ Invalid \`<bet>\` argument given.`)
            .setColor("RED")
            .addField('Usage:', usage)
        return msg.channel.send(embed)
    }
    if (parseInt(args[0]) < 100) {
        let embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription('❎ You must choose at least 100 for your bet.')
            .setColor("RED")
        return msg.channel.send(embed)
    }
    let bet = parseInt(args[0]);
    if (bal < bet) {
        let embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(`❎ You don't have enough money for this bet.
You currently have ${CURRENCY}${bal} in cash.`)
            .setColor("RED")
        return msg.channel.send(embed)
    }

    const collector = new MessageCollector(msg.channel, (m) => m.author.id === msg.author.id, {
        time: 600000
    });
    let yourHand = [];
    let yh_pts = 0;
    let yh_ten = false;
    let dealerHand = [];
    let dh_pts = 0;
    let dh_ten = false;

    let gc_yh_n = genRan().no;
    let gc_yh_s = genRan().suit;
    let gc_yh = `:${gc_yh_n + gc_yh_s}:`;
    if (gc_yh_n == "K") gc_yh_n = 10;
    if (gc_yh_n == "Q") gc_yh_n = 10;
    if (gc_yh_n == "J") gc_yh_n = 10;
    if (gc_yh_n == "10") yh_ten = true;
    let n_yhpts = gc_yh_n;
    if (yh_ten == true) {
        if (gc_yh_n == "A") n_yhpts = 11;
    }
    if (yh_ten == false) {
        if (gc_yh_n == "A") n_yhpts = 1;
    }

    yh_pts += parseInt(n_yhpts);

    let gc_dh_n = genRan().no;
    let gc_dh_s = genRan().suit;
    let gc_dh = `:${gc_dh_n + gc_dh_s}:`;
    if (gc_dh_n == "K") gc_dh_n = 5;
    if (gc_dh_n == "Q") gc_dh_n = 5;
    if (gc_dh_n == "J") gc_dh_n = 10;
    if (gc_dh_n == "10") dh_ten = true;
    let n_dhpts = gc_dh_n;
    if (dh_ten == true) {
        if (gc_dh_n == "A") n_dhpts = 11;
    }
    if (dh_ten == false) {
        if (gc_dh_n == "A") n_dhpts = 1;
    }

    dh_pts += parseInt(n_dhpts);

    dh_pts += parseInt(gc_dh_n);
    gc_yh = gd.emojis.cache.find(emoji => emoji.name === `${gc_yh_n + gc_yh_s}`)
    gc_dh = gd.emojis.cache.find(emoji => emoji.name === `${gc_dh_n + gc_dh_s}`)
    yourHand.push(gc_yh);
    dealerHand.push(gc_dh);

    let embed = new MessageEmbed()
        .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
        .setDescription("Type `hit` to draw another card, `double down` to double down, or `stand` to pass.")
        .addField(`Your Hand`, `${gc_yh}\nValue: ${yh_pts}`, true)
        .addField("Dealer Hand", `${gc_dh}\nValue: ${dh_pts}`, true)
        .setColor("BLUE")

    let em = await msg.channel.send(embed);

    collector.on('collect', async (message2) => {
        let final_yh = "";
        for (let i = 0; i < yourHand.length; i++) {
            final_yh += `${yourHand[i]} `
        }
        let final_dh = "";
        for (let i = 0; i < dealerHand.length; i++) {
            final_dh += `${dealerHand[i]} `
        }
        if (message2.content.toLowerCase() === 'hit') {
            message2.delete();
            let gc_yh_n = genRan().no;
            let gc_yh_s = genRan().suit;
            let gc_yh = `:${gc_yh_n + gc_yh_s}:`;
            if (gc_yh_n == "K") gc_yh_n = 10;
            if (gc_yh_n == "Q") gc_yh_n = 10;
            if (gc_yh_n == "J") gc_yh_n = 10;
            if (gc_yh_n == "10") yh_ten = true;
            let n_yhpts = gc_yh_n;
            if (yh_ten == true) {
                if (gc_yh_n == "A") n_yhpts = 11;
            }
            if (yh_ten == false) {
                if (gc_yh_n == "A") n_yhpts = 1;
            }

            yh_pts += parseInt(n_yhpts);

            let gc_dh_n = genRan().no;
            let gc_dh_s = genRan().suit;
            let gc_dh = `:${gc_dh_n + gc_dh_s}:`;
            if (gc_dh_n == "K") gc_dh_n = 5;
            if (gc_dh_n == "Q") gc_dh_n = 5;
            if (gc_dh_n == "J") gc_dh_n = 10;
            if (gc_dh_n == "10") dh_ten = true;
            let n_dhpts = gc_dh_n;
            if (dh_ten == true) {
                if (gc_dh_n == "A") n_dhpts = 11;
            }
            if (dh_ten == false) {
                if (gc_dh_n == "A") n_dhpts = 1;
            }

            dh_pts += parseInt(n_dhpts);

            gc_yh = gd.emojis.cache.find(emoji => emoji.name === `${gc_yh_n + gc_yh_s}`)
            gc_dh = gd.emojis.cache.find(emoji => emoji.name === `${gc_dh_n + gc_dh_s}`)
            yourHand.push(gc_yh);
            dealerHand.push(gc_dh);

            let updated_yh = "";
            for (let i = 0; i < yourHand.length; i++) {
                updated_yh += `${yourHand[i]} `
            }
            let updated_dh = "";
            for (let i = 0; i < dealerHand.length; i++) {
                updated_dh += `${dealerHand[i]} `
            }

            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Type `hit` to draw another card, `double down` to double down, or `stand` to pass.")
                .addField(`Your Hand`, `${updated_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${dealerHand[0]} ?\nValue: ?`, true)
                .setColor("BLUE")

            em.edit(newEmbed);
        }
        if (message2.content.toLowerCase() === 'double down') {
            message2.delete();
            let gc_yh_n = genRan().no;
            let gc_yh_s = genRan().suit;
            let gc_yh = `:${gc_yh_n + gc_yh_s}:`;
            if (gc_yh_n == "K") gc_yh_n = 10;
            if (gc_yh_n == "Q") gc_yh_n = 10;
            if (gc_yh_n == "J") gc_yh_n = 10;
            if (gc_yh_n == "10") yh_ten = true;
            let n_yhpts = gc_yh_n;
            if (yh_ten == true) {
                if (gc_yh_n == "A") n_yhpts = 11;
            }
            if (yh_ten == false) {
                if (gc_yh_n == "A") n_yhpts = 1;
            }

            yh_pts += parseInt(n_yhpts);

            let gc_dh_n = genRan().no;
            let gc_dh_s = genRan().suit;
            let gc_dh = `:${gc_dh_n + gc_dh_s}:`;
            if (gc_dh_n == "K") gc_dh_n = 5;
            if (gc_dh_n == "Q") gc_dh_n = 5;
            if (gc_dh_n == "J") gc_dh_n = 10;
            if (gc_dh_n == "10") dh_ten = true;
            let n_dhpts = gc_dh_n;
            if (dh_ten == true) {
                if (gc_dh_n == "A") n_dhpts = 11;
            }
            if (dh_ten == false) {
                if (gc_dh_n == "A") n_dhpts = 1;
            }

            dh_pts += parseInt(n_dhpts);

            gc_yh = gd.emojis.cache.find(emoji => emoji.name === `${gc_yh_n + gc_yh_s}`)
            gc_dh = gd.emojis.cache.find(emoji => emoji.name === `${gc_dh_n + gc_dh_s}`)
            yourHand.push(gc_yh);
            dealerHand.push(gc_dh);

            if (yh_pts == 21 && dh_pts < yh_pts) {
                collector.stop();
                let newEmbed = new MessageEmbed()
                    .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                    .setDescription("You won double the amount of your bet amount!")
                    .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                    .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                    .setColor("GREEN")
                user.balance += parseInt(args[0]) * 2;
                await user.save();
                return em.edit(newEmbed);
            }
            if (dh_pts > yh_pts) {
                collector.stop();
                let newEmbed = new MessageEmbed()
                    .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                    .setDescription("You lost double the amount of your bet amount!")
                    .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                    .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                    .setColor("GREEN")
                user.balance -= parseInt(args[0]) * 2;
                await user.save();
                return em.edit(newEmbed);
            }
            let updated_yh = "";
            for (let i = 0; i < yourHand.length; i++) {
                updated_yh += `${yourHand[i]} `
            }
            let updated_dh = "";
            for (let i = 0; i < dealerHand.length; i++) {
                updated_dh += `${dealerHand[i]} `
            }

            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Type `hit` to draw another card, `double down` to double down, or `stand` to pass.")
                .addField(`Your Hand`, `${updated_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${dealerHand[0]} ?\nValue: ?`, true)
                .setColor("BLUE")

            em.edit(newEmbed);
        }
        if (message2.content.toLowerCase() === 'stand') {
            message2.delete();
            if (dh_pts == yh_pts) {
                collector.stop();
                let newEmbed = new MessageEmbed()
                    .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                    .setDescription("Tie match because you both had same value!")
                    .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                    .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                    .setColor("BLUE")

                return em.edit(newEmbed);
            }
            let gc_dh_n = genRan().no;
            let gc_dh_s = genRan().suit;
            let gc_dh = `:${gc_dh_n + gc_dh_s}:`;
            if (gc_dh_n == "K") gc_dh_n = 5;
            if (gc_dh_n == "Q") gc_dh_n = 5;
            if (gc_dh_n == "J") gc_dh_n = 10;
            if (gc_dh_n == "10") dh_ten = true;
            let n_dhpts = gc_dh_n;
            if (dh_ten == true) {
                if (gc_dh_n == "A") n_dhpts = 11;
            }
            if (dh_ten == false) {
                if (gc_dh_n == "A") n_dhpts = 1;
            }

            dh_pts += parseInt(n_dhpts);

            gc_dh = gd.emojis.cache.find(emoji => emoji.name === `${gc_dh_n + gc_dh_s}`)
            dealerHand.push(gc_dh);

            let updated_yh = "";
            for (let i = 0; i < yourHand.length; i++) {
                updated_yh += `${yourHand[i]} `
            }
            let updated_dh = "";
            for (let i = 0; i < dealerHand.length; i++) {
                updated_dh += `${dealerHand[i]} `
            }

            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Type `hit` to draw another card, `double down` to double down, or `stand` to pass.")
                .addField(`Your Hand`, `${updated_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${dealerHand[0]} ?\nValue: ?`, true)
                .setColor("BLUE")

            em.edit(newEmbed);
        }
        if (yh_pts == 21) {
            collector.stop();
            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("You won 2.5x of your bet amount!")
                .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                .setColor("GREEN")
            user.balance += parseInt(args[0]) * 2.5;
            await user.save();
            return em.edit(newEmbed);
        }
        if (yh_pts > 21 && dh_pts > 21) {
            collector.stop();
            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Both you and dealer lost the gamble!")
                .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                .setColor("RED")
            return em.edit(newEmbed);
        }
        if (yh_pts > 21) {
            collector.stop();
            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Player bust! You lost.")
                .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                .setColor("RED")
            user.balance -= parseInt(args[0]);
            await user.save();
            return em.edit(newEmbed);
        }
        if (dh_pts > 21) {
            collector.stop();
            let newEmbed = new MessageEmbed()
                .setAuthor(`${msg.author.username}`, msg.author.displayAvatarURL())
                .setDescription("Dealer bust you won.")
                .addField(`Your Hand`, `${final_yh}\nValue: ${yh_pts}`, true)
                .addField("Dealer Hand", `${final_dh}\nValue: ${dh_pts}`, true)
                .setColor("GREEN")
            user.balance += parseInt(args[0]) * 2;
            await user.save();
            return em.edit(newEmbed);
        }
    });

}

function genRan() {
    let ranN = cards[Math.floor((Math.random() * cards.length))];
    let ranS = suits[Math.floor((Math.random() * suits.length))];
    let ranC = coloures[Math.floor((Math.random() * coloures.length))];

    return { no: `${ranN}`, suit: `${ranS}`, color: `${ranC}` };
}

module.exports.help = {
    name: 'blackjack',
    aliases: ['bj'],
    usage: ['<bet amount>'],
    example: ['200'],
    description: "Play blackjack",
    category: "Economy"
}