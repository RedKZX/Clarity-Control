const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { getMatrixDataTypeDependencies } = require('mathjs');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('give-currency')
    .setDescription('Give a user specified amount of currency.')
    .addUserOption(option => option.setName('user').setDescription('Specified user will be given specified amount of currency.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount of currency you want to give specified user.').setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {

            if (err) throw err;
    
            if (!data) return await interaction.reply({ content: `${user} needs to have **created** a past account in order to add to their currency.`, ephemeral: true})

            const give = amount;

            const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

            Data.Wallet += give;
            Data.save();

            interaction.reply({ content: `Gave **${user.username}** $**${amount}**.`, ephemeral: true})
        })
    }}