const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Check what a user is doing (playing, listening, etc.)')
    .addUserOption(option => 
      option.setName('target')
        .setDescription('The user to check')
        .setRequired(true)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');

    if (!interaction.guild) {
      return interaction.reply({ content: 'This command only works in servers.', ephemeral: true });
    }

    // Fetch member safely
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    }

    // Get presence status safely
    const status = member.presence ? member.presence.status : 'offline';

    // Get user's activity (e.g., Playing, Streaming, Listening, etc.)
    const activities = member.presence?.activities || [];
    let activityMessage = '';
    let spotifyMessage = '';
    let customStatusMessage = '';

    activities.forEach(activity => {
      if (activity.type === 0) activityMessage += `🎮 Playing **${activity.name}**\n`;
      if (activity.type === 1) activityMessage += `📺 Streaming **${activity.name}**\n`;
      if (activity.type === 2) activityMessage += `🎶 Listening to **${activity.name}**\n`;
      if (activity.type === 3) activityMessage += `📖 Watching **${activity.name}**\n`;
      if (activity.type === 5) activityMessage += `💻 Competing in **${activity.name}**\n`;

      // Detect Spotify
      if (activity.name === 'Spotify' && activity.type === 2) {
        spotifyMessage = `🎵 Listening to **${activity.details}** by **${activity.state}**\n⏳ Album: **${activity.assets?.largeText}**`;
      }

      // Detect Custom Status
      if (activity.type === 4) {
        customStatusMessage = `💬 Custom status: **${activity.state || 'No text'}**`;
      }
    });

    // Final message construction
    const finalMessage = [
      `**${targetUser.tag}'s Status:** **${status}**`,
      activityMessage || 'No activity detected.',
      spotifyMessage,
      customStatusMessage
    ].filter(Boolean).join('\n');

    await interaction.reply(finalMessage);
  },
};
