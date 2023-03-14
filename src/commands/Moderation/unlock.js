const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('May as well let them cook.')
    .addChannelOption(option => option.setName('channel').setDescription('Let them cook!').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: "Red doesnt let you do this!", ephemeral: true})

        let channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true})

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark:  ${channel} has been **ALLOWED TO COOK**`)

        await interaction.reply({ embeds: [embed] })
    }
}