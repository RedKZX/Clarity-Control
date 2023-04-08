const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('For when they need to shut up')
    .addChannelOption(option => option.setName('channel').setDescription('The channel that needs to be silenced').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: "Red doesnt let you do this!", ephemeral: true})

        let channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false})

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark:  ${channel} has been **silenced**`)

        await interaction.reply({ embeds: [embed] })
    }
}