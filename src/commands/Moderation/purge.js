const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Purge messages from this channel (Reds favourite)')
    .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to be purged').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "Red doesnt let you do this blame him", ephemeral: true});

        let number = interaction.options.getInteger('amount');

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark: Deleted **${number}** messages.`)

        await interaction.channel.bulkDelete(number)

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('purge')
            .setEmoji('🗑️')
            .setStyle(ButtonStyle.Primary),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = message.createMessageComponentCollector();

        collector.on("collect", async i => {
            if (i.customId === 'purge') {
                if (!i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

                interaction.deleteReply();
            }
        })


    }

}
//Dont break the button//