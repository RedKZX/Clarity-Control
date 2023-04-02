const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addsticker')
    .setDescription('Add a sticker to the server!')
    .addAttachmentOption(option => option.setName('sticker').setDescription('Upload the sticker png/jpeg').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name the sticker will adopt!').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))return await interaction.reply({ content: `You dont have permissions to do this. L bozo`});

        const upload = interaction.options.getAttachment('sticker');
        const name = interaction.options.getString('name');

        if (name.length <= 2) return await interaction.reply({ content: `Your name has to be greater than 2 characters!`});
        if (upload.contentType === 'image/gif') return await interaction.reply({ content: `You cannot upload gif files at this time!`});

        await interaction.reply('Loading your sticker...');

        const sticker = await interaction.guild.stickers.create({ file: `${upload.attachment}`, name: `${name}` }).catch(err => {
            setTimeout(() => {
                return interaction.editReply({ content: `${err.rawError.message}`});
            }, 2000);
        });

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`Your sticker \`${name}\` has been added to the server!`)

        setTimeout(() => {
            if (!sticker) return;

            interaction.editReply({ content: '', embeds: [embed] });
        }, 3000);

    }
}
