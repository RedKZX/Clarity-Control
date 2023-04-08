const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ecoSchema = require("../../Schemas.js/ecoSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your economy balance!"),
    async execute (interaction) {
 
        const {user, guild} = interaction;
 
        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});
 
        if (!Data) return await interaction.reply({ content: `You must have an economy account created to use this command!`, ephemeral: true });
 
        const wallet = Math.round(Data.Wallet);
        const bank = Math.round(Data.Bank);
        const total = Math.round(Data.Wallet + Data.Bank);
 
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Account Balance")
        .addFields({ name: "Balance", value: `**Bank:** $${bank}\n**Wallet:** $${wallet}\n**Total:** $${total}`})
 
        await interaction.reply({ embeds: [embed] });
    }
}