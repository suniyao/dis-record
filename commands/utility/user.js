const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};


// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('server')
// 		.setDescription('Provides information about the server.'),
// 	async execute(interaction) {
// 		// interaction.guild is the object representing the Guild in which the command was run
// 		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
// 	},
// };
