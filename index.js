const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Partials } = require(`discord.js`);
const fs = require('fs');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages, 
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember
	  ]	  
});
client.commands = new Collection();
const mongoose = require('mongoose'); 
const { token, mongoConnectionURL, databaseName } = require('./config.json');

require('dotenv').config();

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login(token);
})();

mongoose.connect(mongoConnectionURL, {
	// useNewUrlParser: true,
	// useUnifiedTopology: true,
	dbName: databaseName,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(`MongoDB Connection Error: ${err}`));