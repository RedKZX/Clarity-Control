const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret')
        .setDescription('This command will either make or break your day'),
    async execute(interaction) {
        const penisSize = Math.floor(Math.random() * 10) + 1;
        let penismain = '8';
        for (let i = 0; i < penisSize; i++) {
            penismain += '=';
        }

        
        const penisEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`${interaction.user.username}'s Penis Size 😶`)
            .setDescription(`Your penis size is  ${penismain}D`);

        await interaction.reply({ embeds: [penisEmbed] });
    },
};
//Have fun with this one
