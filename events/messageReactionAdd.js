let Discord = require("discord.js")
const config = require('./../config.js');
const { MessageEmbed, Message, MessageCollector } = require('discord.js');

module.exports = async (client, reaction, user) => {
  let { message } = reaction;
  if (reaction.message.partial) message = await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  let member = reaction.message.guild.members.cache.get(user.id);
  let channel = message.channel

  if (user.id === client.user.id) return;
  if (user.bot) return;

}