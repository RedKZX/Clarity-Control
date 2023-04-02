const {SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw your moneys!')
    .addStringOption(option => option.setName('amount').setDescription('The amount of money you want to withdraw').setRequired(true)),
    async execute (interaction) {

        const { options, user, guild } = interaction;

        const amount = options.getString('amount');
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: 'Please create an economy account first'});
        if (amount.startsWith('-')) return await interaction.reply({ content: 'You cannot withdraw a negative amount of money, like cmon.'});

        if (amount.toLowerCase() === 'all') {
            if (Data.Bank === 0) return await interaction.reply({ conetnt: 'You have no money to withdraw brokey'});

            Data.Wallet += Data.Bank;
            Data.Bank = 0;

            await Data.save();

            return await interaction.reply({ content: 'All your money has been withdrawed into your wallet'});
        } else {
            const Converted = Number(amount);

            if (isNaN(Converted) === true) return await interaction.reply({ content: 'The amount can only be a number or \`all`!'});

            if (Data.Bank < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: 'You dont have aneough money in your bank to withdraw lol'});

            Data.Wallet += parseInt(Converted);
            Data.Bank -= parseInt(Converted);
            Data.Bank = Math.abs(Data.Bank);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Successfully Withdrawed')
            .setDescription(`Successfully $${parseInt(Converted)} withdrawed into your wallet!`)

            return await interaction.reply({ embeds: [embed]});
        }
    }
}
