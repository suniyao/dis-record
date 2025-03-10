module.exports = {
    data: {
        name: 'punch',
        description: 'punch me',
        "integration_type": [0,1],
        "contexts": [0,1,2]
    },
    async execute(interaction) {
        await interaction.reply('punch back')
    }
}