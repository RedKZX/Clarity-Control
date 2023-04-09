const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoS = require('../../Schemas.js/economySchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('View your balance and info')
        .addSubcommand(command =>
            command
                .setName('view')
                .setDescription('View your balance and info')
        ),
 
    async execute(interaction) {
        const { options, guild, user } = interaction;
        let data = await ecoS.findOne({ Guild: guild.id, user: user.id });
 
        if (!data) return await interaction.reply({ content: "You don't have an account, create one using `/create account` to stop being broke!" });
        else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${user.tag}'s Account`, iconURL: user.avatarURL() })
                .setThumbnail('https://cdn.pixabay.com/photo/2022/10/11/23/49/bank-7515368_960_720.png')
                .setColor('Red')
                .addFields(
                    {
                        name: "Current Account",
                        value: [
                            `• 🏦 £${data.Bank}`,
                            `• 💷 £${data.Wallet}`,
                            `• 💰 £${data.Wallet + data.Bank}`,
                        ].join("\n"), inline: false
                    },
                    {
                        name: "Personal Area",
                        value: [
                            `• 🎰 **${data.Gambled}** times`,
                            `• 👷 **${data.Worked}** times (${data.HoursWokred} hrs)`,
                            `• 🙏 **${data.Begged}** times`,
                            `• 🧑‍💻 **${data.CommandsRan}** {/} ran`,
                            `• 🛠️ **${data.Moderated}** times (moderated)`
                        ].join("\n"), inline: false
                    }
                )
                .setFooter({ text: `${guild.name}'s Economy` })
                .setTimestamp();
 
            await interaction.reply({ embeds: [embed] });
        }
    }
}