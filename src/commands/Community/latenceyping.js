const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    ownerOnly: true, // Owner only setting remember this henry
    data: new SlashCommandBuilder()
        .setName('reds-ping')
        .setDescription('For red')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setDescription(`:ping_pong: | Pong! Latency: **${client.ws.ping} ms**`)
            .setColor("0x2f3136")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] })
    }
}