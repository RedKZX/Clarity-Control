const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const pvpSchema = require('../../Schemas.js/pvpSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('pvp-role')
    .setDescription('Configure your PvP lfg role.')
    .addSubcommand(command => command.setName('set').setDescription('Specified role will be pinged when doing /pvp-lfg').addRoleOption(option => option.setName('pvp-lfg-role').setDescription('Specified role will be your pvp lfg role').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Disables the Pvp LFG system.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== '756849096479866996') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
            case 'set':
 
            const pvplfgdata = await pvpSchema.findOne({ Guild: interaction.guild.id });
            const pvprole = await interaction.options.getRole('pvp-lfg-role');
 
            if (!pvplfgdata) {
 
                pvpSchema.create({
                    Guild: interaction.guild.id,
                    Role: pvprole.id
                })
 
                const pvpenable = new EmbedBuilder()
                .setColor('Red')
                .setFooter({ text: `Pvp LFG Set`})
                .setAuthor({ name: `Reds PvP LFG system`})
                .setTimestamp()
                .setTitle('> Pvp Role set')
                .addFields({ name: `• PvP Role`, value: `> Your role (${pvprole}) has been **set** as your \n> Pvp LFG role. They will \n> be pinged when a user needs friends!`})
 
                await interaction.reply({ embeds: [pvpenable]})
 
            } else {
                await interaction.reply({ content: `The **Pvp LFG** system is already **enabled**. \n> Do **/pvp-role remove** to undo.`, ephemeral: false})
            }
 
            break;
            case 'remove':
 
            const pvplfgdata1 = await pvpSchema.findOne({ Guild: interaction.guild.id });
 
            if (!pvplfgdata1) {
                return await interaction.reply({ content: `The **PvP LFG** system is already **disabled**, can't disable **nothing**... DUH!`, ephemeral: false});
 
            } else {
 
                await pvpSchema.deleteOne({ Guild: interaction.guild.id });
                await interaction.reply({ content: `Your **PvP LFG** system has been **disabled**!`, ephemeral: false});
 
            }
        }
    }
}