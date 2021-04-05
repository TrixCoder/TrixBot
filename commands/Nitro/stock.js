const Discord = require('discord.js');
const Stock = require('../../models/stock.js');

module.exports.run = async (client, message, args) => {
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
    let nc = find.nitro_classic.length ? find.nitro_classic.length : "0";
    let nb = find.nitro_booster.length ? find.nitro_booster.length : "0";
    let nyc = find.nitro_yearly_classic.length ? find.nitro_yearly_classic.length : "0";
    let nyb = find.nitro_yearly_booster.length ? find.nitro_yearly_booster.length : "0";
    let nitro_msg = new Discord.MessageEmbed()
        .setTitle(`Nitro Stock`)
        .setColor("BLUE")
        .setDescription(`<a:ClassicNitro:827069954867462155> Nitro classic: \`${nc}\`\n<a:BoostNitro:827070026917085234> Nitro booster: \`${nb}\`\n<a:ClassicNitro:827069954867462155> Nitro yearly classic: \`${nyc}\`\n<a:BoostNitro:827070026917085234> Nitro yearly booster: \`${nyb}\``);
    return message.channel.send(nitro_msg);
}

module.exports.help = {
    name: 'nstock',
    aliases: [''],
    category: 'Nitro',
    usage: [''],
    description: 'Check how much nitro the server owner have in stock',
    example: ['']
}