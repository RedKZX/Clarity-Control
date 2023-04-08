const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const pvpSchema = require('../../Schemas.js/pvpSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pvp-lfg')
    .setDescription('Pvp LFG feature')
    .addStringOption(option => option.setName('activity').setDescription('The activity you are doing').setRequired(true))
    .addIntegerOption(option => option.setName('players').setDescription('Amount of players you are looking for!').setMinValue(1).setMaxValue(5).setRequired(true)),
    async execute(interaction) {

        const { options } = interaction;
        const activity = options.getString('activity');

 
        let players = interaction.options.getInteger('players');

 
 
         const pvplfgdata = await pvpSchema.findOne({ Guild: interaction.guild.id });
 
            if(!pvplfgdata) {
                return await interaction.reply({ content: `This **feature** has not been **set up** in this server yet!`, ephemeral: true})
            } else {
 
                const pvpembed = new EmbedBuilder()
                .setColor('Red')
                .setTimestamp()
                .setTitle('> Trying to find you friends')
                .setDescription(`${interaction.user.username} is looking for \`${players}\` for ${activity}`  )
 
                const pvprole = pvplfgdata.Role;
                const memberslist = await interaction.guild.roles.cache.get(pvprole).members.filter(member => member.presence?.status !== 'Offline').map(m => m.user).join('\n> ');
                await interaction.reply({ content: `> ${memberslist}`, embeds: [pvpembed]});
 
            } 
    }
}                      