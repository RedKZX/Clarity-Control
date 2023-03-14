const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Opens up an application in which you can send us some feedback.'),
    async execute(interaction) {

        const modal = new ModalBuilder()
        .setTitle('Feedback Application Form for Mini Red')
        .setCustomId('feedback')

        const name = new TextInputBuilder()
        .setCustomId('name')
        .setRequired(true)
        .setLabel('Discord Username')
        .setStyle(TextInputStyle.Short);

        const feedback = new TextInputBuilder()
        .setCustomId('feedback')
        .setRequired(true)
        .setLabel('Provide us with your feedback on Mini Red')
        .setStyle(TextInputStyle.Paragraph);

        const problems = new TextInputBuilder()
        .setCustomId('problems')
        .setRequired(false)
        .setLabel('Problems when using the Mini Red')
        .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(name)
        const secondActionRow = new ActionRowBuilder().addComponents(feedback)
        const thirdActionRow = new ActionRowBuilder().addComponents(problems)

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)
        interaction.showModal(modal)


    }
}