const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas.js/economySchema');
 
var timeout = [];
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg to get money'),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
        let data = await ecoS.findOne({ Guild: guild.id, user: user.id });
 
        if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: "Come back soon to beg (1 min)", ephemeral: true });
 
        if (!data) return await interaction.reply({ content: "You don't have an account, create one using `/create account`" });
        else {
            const randAmount = Math.round((Math.random() * 750) + 10);
 
            data.CommandsRan += 1;
            data.Begged += 1;
            data.Wallet += randAmount;
            data.save()
 
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag} Begged🙏`, iconURL: user.avatarURL() })
                .setDescription(`You just begged and were **successful**:\n\n• Begged Amount: **£${randAmount}**\n• Timed begged: **${data.Begged}**`)
                .setFooter({ text: `Come back in 1 minute and run /beg` })
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