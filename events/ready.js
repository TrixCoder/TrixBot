const Discord = require('discord.js');

module.exports = async (client) => {
  console.log([
    `Logged in as ${client.user.tag}`,
    `Loaded ${client.commands.size} commands!`,
    `Loaded ${client.events.size} events!`
  ].join('\n'));
  client.user.setActivity("in Trixter Community"); 
}
