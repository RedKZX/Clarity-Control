const {SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit your moneys!')
    .addStringOption(option => option.setName('amount').setDescription('The amount of money you want to deposit').setRequired(true)),
    async execute (interaction) {

        const { options, user, guild } = interaction;

        const amount = options.getString('amount');
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: 'Please create an economy account first'});
        if (amount.startsWith('-')) return await interaction.reply({ content: 'You cannot deposit a negative amount of money, like cmon.'});

        if (amount.toLowerCase() === 'all') {
            if (Data.Wallet === 0) return await interaction.reply({ conetnt: 'You have no money to deposit brokey'});

            Data.Bank += Data.Wallet;
            Data.Wallet = 0;

            await Data.save();

            return await interaction.reply({ content: 'All your money has been deposited'});
        } else {
            const Converted = Number(amount);

            if (isNaN(Converted) === true) return await interaction.reply({ content: 'The amount can only be a number or \`all`!'});

            if (Data.Wallet < parseInt(Converted) || Converted === Infinity) return await interaction.reply({ content: 'You dont have aneough money in your wallet to deposit lol'});

            Data.Bank += parseInt(Converted);
            Data.Wallet -= parseInt(Converted);
            Data.Wallet = Math.abs(Data.Wallet);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Successfully Deposited')
            .setDescription(`Successfully $${parseInt(Converted)} deposited into your bank`)

            return await interaction.reply({ embeds: [embed]});
        }
    }
}
