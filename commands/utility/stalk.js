const mongoose = require('mongoose');
const Activity = require('../../server/models/activity'); // Import Mongoose model

module.exports = {
    data: {
        name: 'activity',
        description: 'Check what a user is doing (playing, listening, etc hihihiiihihi.)',
        integration_type: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                type: 6, // USER type
                name: 'target',
                description: 'The user to check',
                required: true
            }
        ]
    },
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');

        let member;
        if (interaction.guild) {
            member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        }

        if (!member) {
            targetUser = await interaction.client.users.fetch(targetUser.id).catch(() => null);
            if (!targetUser) {
                return interaction.reply({ content: 'User not found.', ephemeral: true });
            }
        }

        const status = member?.presence?.status || 'offline';
        const activities = member?.presence?.activities || [];

        let activityMessage = '';
        let spotifyMessage = '';
        let spotifySongName = '';
        let spotifySongComposer = '';
        let spotifyAlbumCoverURL = '';
        let customStatusMessage = '';
        let activityType = null;

        activities.forEach(activity => {
            activityType = activity.type;

            if (activity.type === 2) activityMessage += `Listening to ${activity.name}`;

            if (activity.name === 'Spotify' && activity.type === 2) {
                spotifySongName = activity.details;
                spotifySongComposer = activity.state;
                spotifyAlbumCoverURL = activity.assets?.largeImageURL();
                spotifyMessage = `🎵 Listening to **${spotifySongName}** by **${spotifySongComposer}**\n📀 Album Cover: ${spotifyAlbumCoverURL}`;
            }

            if (activity.type === 4) {
                customStatusMessage = `💬 Custom status: ${activity.state || 'No text'}`;
            }
        });

        const finalMessage = [
            `**${targetUser.tag}'s Status:** **${status}**`,
            activityMessage || 'No activity detected.',
            spotifyMessage,
            customStatusMessage
        ].filter(Boolean).join('\n');

        await interaction.reply(finalMessage);

        try {
            const newActivity = new Activity({
                name: targetUser.tag,
                status: status,
                activityType: activityType,
                activityMessage: activityMessage,
                spotifySongName: spotifySongName,
                spotifySongComposer: spotifySongComposer,
                spotifyAlbumCoverURL: spotifyAlbumCoverURL,
                timestamps: new Date()
            });

            await newActivity.save();
            console.log(`[DB] Saved activity for ${targetUser.tag}`);
        } catch (error) {
            console.error("[DB Error] Failed to save activity:", error);
        }
    }
};
