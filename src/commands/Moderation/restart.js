const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts Mini Red. Only @R͓̽e͓̽d͓̽#9999 can do this!'),
    async execute(interaction, client) {

        if (interaction.user.id === `756849096479866996`) {
            await interaction.reply({ content: `**Restarting**`, ephemeral: false})
            await client.user.setStatus("invisible")
            process.exit();
        } else {
            return interaction.reply({ content: `Only @R͓̽e͓̽d͓̽#9999 can do this.`, ephemeral: false})
        }
    }
}