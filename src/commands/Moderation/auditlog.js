onst { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const logSchema = require('../../Schemas.js/log');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('logging-system')
    .setDescription('Set up the mod logging system')
    .addSubcommand(command => command.setName('setup').setDescription('Set up the mod logging system').addChannelOption(option => option.setName('channel').setDescription('The channel you want to send the logs to').setRequired(true).addChannelTypes(ChannelType.GuildText)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the logging system')),
    async execute (interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Red doesnt let you do this!', ephemeral: true});
 
        const { options } = interaction;
        const sub = options.getSubcommand();
 
        const Data = await logSchema.findOne({ Guild: interaction.guild.id});
 
        switch (sub) {
            case 'setup':
 
            const channel = options.getChannel('channel');
 
            if (Data) return await interaction.reply({ content: 'The logging system is already enabled here!', ephemeral: true});
            else {
                await logSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                })
 
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The logging system has been enabled in ${channel}`)
 
                await interaction.reply({ embeds: [embed] });
            }
        }
 
        switch (sub) {
            case 'disable':
 
            if (!Data) return await interaction.reply({ content: 'There is no logging system set up here!', ephemeral: true});
            else {
                await logSchema.deleteMany({ Guild: interaction.guild.id});
 
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The logging system has been disabled`)
 
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}
