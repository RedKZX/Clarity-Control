const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Go ahead, try it.'),
    async execute(interaction, client) {
        await interaction.reply({ content: 'Pong!' });
    }
}

//ping pong ping pong ping pong//