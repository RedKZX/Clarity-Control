onst { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user that you wanna warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason that you wanna warn this user")
        .setRequired(false)
    ),
 
  async execute(interaction, client) {
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription("You dont have permission to warn people on this server.")
      .setTitle("Error Detected!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1039497705753428018/1046445745731031040/pngegg.png"
      )
      .setTimestamp();
 
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    )
      return await interaction.reply({
        embeds: [embed1],
        ephemeral: true,
      });
 
    const { options, user } = interaction;
 
    const author = interaction.user;
    const target = options.getUser("user");
    const reason = options.getString("reason") || "No reason provided";
 
    const warn = await db.add(`warn_${target}_${interaction.guild.id}`, 1);
 
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`${author} has **Warned** ${target} || ${reason}`)
      .setTitle("Warned!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1039497705753428018/1045730663543885935/verified-blue-check-mark-symbol-logo-trademark-text-transparent-png-821650.png"
      )
      .setTimestamp();
 
    interaction.reply({ embeds: [embed] });
  },
};
 
