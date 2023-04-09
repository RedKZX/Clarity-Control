const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas.js/economySchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete an economy account')
        .addSubcommand(command =>
            command
                .setName('account')
                .setDescription('Delete your economy account')
        ),
 
    async execute(interaction) {
        const { options, user, guild } = interaction;
 
        const sub = options.getSubcommand();
        let data = await ecoS.findOne({ Guild: guild.id, User: user.id });
 
        switch (sub) {
            case "account":
                if (!data) return await interaction.reply({ content: "You don't have an economy account to delete, idiot.", ephemeral: true });
                else {
                    await ecoS.deleteMany();
 
                    const deleted = new EmbedBuilder()
                    .setDescription('Your economy account has been deleted, back to being broke.')
                    .setColor('Red')
 
                    await interaction.reply({ embeds: [deleted] });
                }
                break;
        }
    }
}