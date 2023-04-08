const {SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/ecoSchema');

var timeout =[];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob someones moneys!')
    .addUserOption(option => option.setName('victim').setDescription('the user who you want to rob').setRequired(true)),
    async execute (interaction) {

        const { options, user, guild } = interaction;

        if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: 'Wait 1 minute to rob another poor person!'});

        const userStealing = options.getUser('victim');
        
        let Data = await ecoSchema.findOne({ Guild: guild.id, User: user.id});
        let DataUser = await ecoSchema.findOne({ Guild: guild.id, User: userStealing.id});

        if (!Data) return await interaction.reply({ content: 'Please create an economy account first by doing `/economy!`'});
        if (userStealing == interaction.user) return await interaction.reply({ content: 'Why would you even try and rob yourself?'});
        if (!DataUser) return await interaction.reply({ content: 'This user doesnt have an economy account created!'});
        if (DataUser.Wallet <=0) return await interaction.reply({ content: 'That user doesnt even have any money in theur wallet lol!'});

        let negative = Math.round((Math.random() * -150) - 10);
        let positive = Math.round((Math.random() *300) + 10);

        const posN = [negative, positive];

        const amount = Math.round(Math.random() * posN.length);
        const value = posN[amount];

        if (Data.Wallet <= 0) return await interaction.reply({ content:'You cannot rob this person because your wallet has $0 in it'});

        if (value > 0) {

            const positiveChoices = [
                "You stole",
                "Red saw you and helped you rob",
                "You robbed",
                "You took",
            ]

            const posName = Math.floor(Math.random() * positiveChoices.length);

            const begEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Robbery Success')
            .addFields({ name: 'Robbery Results:', value: `${positiveChoices[[posName]]} $${value}`})

            await interaction.reply({ embeds: [begEmbed] });

            Data.Wallet += value;
            await Data.save();

            DataUser.Wallet -= value;
            await DataUser.save()
        } else if (value < 0) {
            
            const negativeChoices = [
                "You got caught and lost",
                "Red saw you and stopped you from robbing this person and you lost",
                "You got shot and lost",
                "Youre just a shit robber, you lost",
            ]
            
            const wal = Data.Wallet;
            if (isNaN(value)) return await interaction.reply({ content: 'This user was not robbed but you were not caught'});

            const negName = Math.floor(Math.random() * negativeChoices.length);

            let nonSymbol;
            if (value - wal < 0) {

                const stringV = `${value}`;

                nonSymbol = await stringV.slice(1);

                const los = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Robbery Failure')
                .addFields({ name: 'Robbery Results', value: `${negativeChoices[[negName]]} $${nonSymbol}`})

                Data.Bank += value;
                await Data.save();

                DataUser.Wallet -= value;
                await DataUser.save();

                return await interaction.reply({ embeds: [los] });
            }

            const begLostEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Robbery Failure')
            .addFields({ name: 'You robbed and', value: `${positiveChoices[[posName]]} $${value}`})

            await interaction.reply({ embeds: [begLostEmbed] });

            Data.Wallet += value;
            await Data.save();

            DataUser.Wallet -= value;
            await DataUser.save()

        } 

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 30000)
        

       
    }
}