const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remember")
    .setDescription("Make me remember someone.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want me to remember")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The thing you want me to remember about this person")
        .setRequired(true)
    ),
 
  async execute(interaction) {
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "You dont have permission to make me remember thing about someone on this server."
      )
      .setTitle("Error Detected!")
      .setTimestamp();
 
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({ embeds: [embed1], ephemeral: true });
 
    const author = interaction.user;
    const user = interaction.options.getUser("user");
    const description = interaction.options.getString("description");
 
    await db.set(`Remember_${user}_${interaction.guild.id}`, description);
 
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`Remembered "${description}" for ${user}.`)
      .setTitle("Remembered!")
      .setTimestamp();
 
    await interaction.reply({ embeds: [embed] });
  },
};
 
