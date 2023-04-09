const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas.js/economySchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give money to a user')
        .addSubcommand(command =>
            command
                .setName('money')
                .setDescription('Give money to a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('User to give money too!')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setDescription('Amount to give')
                        .setRequired(true)
                )
        ),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
 
        if (user.id !== "756849096479866996") return await interaction.reply({ content: "Your not allowed to do this! Lol" });
 
        const giveTo = options.getUser('user');
        const amount = options.getNumber('amount');
 
        let data = await ecoS.findOne({ Guild: guild.id, User: giveTo.id });
        if (!data) return await interaction.reply({ content: "This user doesn't have an economy account setup" });
        else {
            data.Bank += amount;
            data.save()
 
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${giveTo.tag}'s finances`, iconURL: user.avatarURL() })
            .setDescription(`${giveTo} was just given money by ${user}\n\n• Amount: **£${amount}**`)
            .setFooter({ text: `${guild.name}'s Economy` })
            .setColor('Red')
            .setTimestamp()
 
            await interaction.reply({ embeds: [embed] });
        }
    }
}