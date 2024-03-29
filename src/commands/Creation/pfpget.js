const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Steal someones avatar.')
    .addUserOption((option) => 
    option.setName('user')
    .setDescription('User of the avatar you want to steal!')
    .setRequired(true)
    ),

    async execute(interaction) {
        const { channel, client, options, member } = interaction;
        let user = interaction.options.getUser('user') || interaction.member;
        let userAvatar = user.displayAvatarURL({ size: 512});

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`${user.tag}'s Avatar`)
        .setImage(`${userAvatar}`)
        .setTimestamp();

        const button = new ButtonBuilder()
        .setLabel('Avatar Link')
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.avatarURL({size: 512})}`);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
