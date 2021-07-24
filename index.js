const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.js');

const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/trixbot`,{ useNewUrlParser: true, useUnifiedTopology: true }).then(mon => {
  console.log(`Connected to the database!`);
}).catch((err) => {
        console.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
require('discord-buttons')(client);

fs.readdirSync('./commands').forEach(dir => {
	const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
	for( const file of commands) {
		const command = require(`./commands/${dir}/${file}`);
		client.commands.set(command.help.name, command)
	}
})

fs.readdir(`${process.cwd()}/events/`, (err, files) => {
    files.forEach(file => {
      const eventName = file.split(".")[0];
      console.log(`Loading Event: ${eventName}`);
      const event = require(`${process.cwd()}/events/${file}`);
      client.on(eventName, (...args) => event(client, ...args));
            client.events.set(eventName, event);

      });
  });
  
client.login(token)

