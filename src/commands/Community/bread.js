const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bread')
    .setDescription('BREAD'),
    async execute(interaction, client) {
        await interaction.reply({ content: '.' });
    }
}
