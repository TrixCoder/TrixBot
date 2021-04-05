const Discord = require('discord.js');
const Stock = require('../../models/stock.js');

module.exports.run = async (client, message, args) => {
    if(message.author.id !== message.guild.owner.id) return;
    else {
        let find = await Stock.findOne({ guild: message.guild.id });
        if (find == null) {
            return message.channel.send("No stock available to send. Please use `add` comamnd to add a stock.")
        }
        let user = message.mentions.users.first();
        if (!user) return message.channel.send("Please specify a `user`.");
        if (!args[1]) return message.channel.send("Please specify a `nitro type`.");
        if (!args[2]) return message.channel.send("Please specify a `nitro amount`.");
        if (!isNaN(args[1])) return message.channel.send("Please specify a valid `nitro type`.");
        let nitro_type = args[1];
        let nitro_link = [];
        if (nitro_type == "classicyear") {
            let arr = find.nitro_yearly_classic;
            for (let i = 0; i < args[2]; i++) {
                nitro_link.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < nitro_link.length; j++) {
                    if (arr[i] == nitro_link[j]) {
                        let lnk = nitro_link[j];
                        arr.pop(i);
                        await find.save();
                    }
                }
            }
            nitro_type = "Yearly nitro classic"
        }
        else if (nitro_type == "classic") {
            let arr = find.nitro_classic;
            for (let i = 0; i < args[2]; i++) {
                nitro_link.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < nitro_link.length; j++) {
                    if (arr[i] == nitro_link[j]) {
                        let lnk = nitro_link[j];
                        arr.pop(i);
                        await find.save();
                    }
                }
            }
            nitro_type = "Monthly nitro classic"
        }
        else if (nitro_type == "booster") {
            let arr = find.nitro_booster;
            for (let i = 0; i < args[2]; i++) {
                nitro_link.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < nitro_link.length; j++) {
                    if (arr[i] == nitro_link[j]) {
                        let lnk = nitro_link[j];
                        arr.pop(i);
                        await find.save();
                    }
                }
            }
            nitro_type = "Monthly nitro booster"
        }
        else if (nitro_type == "boostyear") {
            let arr = find.nitro_yearly_booster;
            for (let i = 0; i < args[2]; i++) {
                nitro_link.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < nitro_link.length; j++) {
                    if (arr[i] == nitro_link[j]) {
                        let lnk = nitro_link[j];
                        arr.pop(i);
                        await find.save();
                    }
                }
            }
            nitro_type = "Yearly nitro booster"
        }
        if(nitro_link.length < 1 || nitro_link[0] == undefined) return message.channel.send("There is no stock left.")
        for (let k = 0; k < nitro_link.length; k++) {
            user.send(nitro_link[k]);
        }
        let nitro_msg = new Discord.MessageEmbed()
            .setTitle(`Done!`)
            .setColor("BLUE")
            .setDescription(`Sent ${nitro_type} to ${user}.`);
        return message.channel.send(nitro_msg);
    }
}

module.exports.help = {
    name: 'nsend',
    aliases: [''],
    category: 'Nitro',
    usage: ['<@user> <nitro type> <amount of nitro links>'],
    description: 'Send someone x amount of nitro',
    example: ['@</Trixter>#0001 classic 1']
}