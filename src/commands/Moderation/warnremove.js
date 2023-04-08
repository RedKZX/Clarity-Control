const { SlashCommandBuilder, messageLink } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear-warns")
    .setDescription("Clear an amount of warns from a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user that you wanna remove the warns from")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription(
          "The amount of warns that you wanna remove from this person"
        )
        .setRequired(true)
    ),
 
  async execute(interaction, client) {
    const { options, user } = interaction;
 
    const author = interaction.user;
    const target = options.getUser("user");
    const amount = options.getNumber("amount");
    const checkwarn = await db.get(`warn_${target}_${interaction.guild.id}`);
 
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `${target} only has ${checkwarn} warn(s) \nYou cant remove more warns than this user already has`
      )
      .setTitle("Error Detected!")
      .setTimestamp();
 
    const embed2 = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`You can't remove 0 warns from a user`)
      .setTitle("Error Detected!")
      .setTimestamp();
 
    if (amount == 0)
      return await interaction.reply({ embeds: [embed2], ephemeral: true });
 
    if (amount > checkwarn)
      return await interaction.reply({ embeds: [embed1], ephemeral: true });
 
    await db.sub(`warn_${target}_${interaction.guild.id}`, amount);
 
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`${author} has removed ${amount} warn(s) from ${target}`)
      .setTitle("Warns Removed!")
      .setTimestamp();
 
    interaction.reply({ embeds: [embed] });
  },
};
 
