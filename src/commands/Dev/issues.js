const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('issues')
    .setDescription('Submit an issue thread.'),
    async execute(interaction, client) {
        await interaction.reply({ content: 'Create an issues thread on GitHub using this link: https://github.com/RedKZX/Clarity-Control/issues' });
    }
}
