const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ApplicationCommandOptionType, Client } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
      .setName("eval")
      .setDescription("Evaluates code"),
      
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
 
    async execute(interaction, client) {
        const owners = [
            "756849096479866996"
        ]
 
        if (!owners.includes(interaction.user.id)) return interaction.reply(":warning: **ERROR:** You do not have permision to run this command, if you think this is a mistake please contact: `R͓̽e͓̽d͓̽#9999`.");
 
        try {
            const output = eval(interaction.options.getString("code"));
 
            const outputE = new EmbedBuilder()
                .setColor(`Red`)
                .setTitle(`Output`)
                .setDescription(` \`\`\`js\n${output}\`\`\``)
                .setTimestamp()
                .setFooter({ text: `Eval Done By: ${interaction.user.username}` })
 
 
            return interaction.reply({
                embeds: [outputE]
            })
        } catch (err) {
 
            const error = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Error`)
                .setDescription(`\`\`\`${err.stack}\`\`\``)
                .setTimestamp()
                .setFooter({ text: `Eval Failed By: ${interaction.user.username}` })
 
            return interaction.reply({
                embeds: [error]
            })
        }
    }
}