const { MessageEmbed } = require('discord.js');
let Guild = require(`./../../models/guild`)
let config = require(`./../../config`)

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You need Administrator permission to use this command')
    const list = message.guild.members.cache;
    return console.log(list);
    let qts = "";
    for(let i=0;i<list.length;i++){
        console.log(list[1])
        if(list[i].username.includes(`qtgang`)){
            console.log(list[i]);
        }
    }
    //    return message.channel.send(`qts list:\n`);
}

module.exports.help = {
    name: 'test',
    aliases: [''],
    usage: [''],
    example: [''],
    description: "Check qts in server",
    category: "Admin"
}