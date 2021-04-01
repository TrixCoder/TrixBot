const Discord = require('discord.js');
const Stock = require('../../models/stock.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    else {
        let find = await Stock.findOne({ guild: message.guild.id });
        if (find == null) {
            let newStock = new Stock({
                guild: message.guild.id,
                nitro_classic: [],
                nitro_booster: [],
                nitro_yearly_classic: [],
                nitro_yearly_booster: []
            });
            await newStock.save();
        }
        if (!args[0]) return message.channel.send("Please specify a `nitro type`.");
        if (!args[1]) return message.channel.send("Please specify a `nitro link`.");
        if (!isNaN(args[0])) return message.channel.send("Please specify a valid `nitro type`.");
        let nitro_type = args[0];
        if (nitro_type == "classicyear") {
            let arr = find.nitro_yearly_classic;
            let isExisting = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == args[1]) return message.channel.send("The link already exists in stock");
                else isExisting = true;
            }
            if(arr.length < 1) isExisting = true;
            if (isExisting == false) return;
            arr.push(args[1]);
            find.save();
            nitro_type = "Yearly nitro classic"
        }
        else if (nitro_type == "classic") {
            let arr = find.nitro_classic;
            let isExisting = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == args[1]) return message.channel.send("The link already exists in stock");
                else isExisting = true;
            }
            if(arr.length < 1) isExisting = true;
            if (isExisting == false) return;
            console.log(1);
            arr.push(args[1]);
            find.save();
            nitro_type = "Monthly nitro classic"
        }
        else if (nitro_type == "booster") {
            let arr = find.nitro_booster;
            let isExisting = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == args[1]) return message.channel.send("The link already exists in stock");
                else isExisting = true;
            }
            if(arr.length < 1) isExisting = true;
            if (isExisting == false) return;
            arr.push(args[1]);
            find.save();
            nitro_type = "Monthly nitro booster"
        }
        else if (nitro_type == "boostyear") {
            let arr = find.nitro_yearly_booster;
            let isExisting = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == args[1]) return message.channel.send("The link already exists in stock");
                else isExisting = true;
            }
            if(arr.length < 1) isExisting = true;
            if (isExisting == false) return;
            arr.push(args[1]);
            find.save();
            nitro_type = "Yearly nitro booster"
        }
        let nitro_msg = new Discord.MessageEmbed()
            .setTitle(`Done!`)
            .setColor("BLUE")
            .setDescription(`Added ${nitro_type} in stock.`);
        return message.channel.send(nitro_msg);
    }
}

module.exports.help = {
    name: 'add',
    aliases: ['a']
}