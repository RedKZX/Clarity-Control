const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas.js/economySchema');
 
var timeout = [];
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble to win or lose money, for legal reasons this is fake money!')
        .addNumberOption(option => option.setName('amount').setDescription('The amount to gamble (default = 500)').setRequired(false)),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
        let data = await ecoS.findOne({ Guild: guild.id, user: user.id });
 
        if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "Come back soon for a shift!", ephemeral: true });
 
        const amount = options.getNumber('amount') || 500;
 
        if (!data) return await interaction.reply({ content: "You don't have an account, create one using `/create account`" });
        else {
            if (data.Wallet < amount) return await interaction.reply({ content: `You only have £${data.Wallet} in your wallet...`, ephemeral: true });
            if (data.Wallet < amount && data.Bank > amount) return await interaction.reply({ content: `You have **£${data.Wallet}** in your wallet but **${data.Bank}**... Withdraw some money to gamble` });
 
            const acca = [0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.1, 2.5, 1.8, 0.4, 0.8, 1, 5, 2.1, 1.6, 10, 2, 0.9, 1.1, 0, 0, 1, 2, 3, 0.1, 2.5, 1.8, 100]
 
            const jobPick = acca[Math.floor(Math.random() * acca.length)];
 
            if (jobPick === 1) return await interaction.reply({ content: "You didn't win or lose. At least you didnt loose" })
 
            const winorlose = jobPick * amount;
 
            const hours = Math.round((Math.random() * 15) + 8);
 
            let choice;
            let happened;
            let profit;
 
            if (jobPick < 1) {
                choice = "lost";
                happened = "Loss"
            }
            if (jobPick > 1) {
                choice = "won"
                happened = "Win";
                profit = winorlose - amount;
            }
 
            data.Wallet -= amount;
            data.Wallet += winorlose
            data.Gambled += 1;
            data.CommandsRan += 1;
            data.save();
 
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag} Gambled`, iconURL: user.avatarURL() })
                .setDescription(`You just gambled **£${amount}** and **${choice}**\n\n💷Gamble Amount: **£${amount}**\n🎰Accumulator: **${jobPick}**\n\n🎉Total ${happened}: **£${winorlose}**`)
                .setFooter({ text: `Come back in 1 minute and run /gamble` })
                .setColor('Red')
                .setTimestamp()
 
            await interaction.reply({ embeds: [embed] });
 
            timeout.push(interaction.user.id);
            setTimeout(() => {
                timeout.shift();
            }, 60000);
        }
    }
}