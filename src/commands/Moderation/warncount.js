const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Check how many warnings a user has on this server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user that you wanna check the warns of")
        .setRequired(true)
    ),
 
  async execute(interaction, client) {
    const embed1 = new EmbedBuilder()
      .setColor("Red")
      .setDescription("You dont have permission to check warns on this server.")
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
 
    const target = options.getUser("user");
 
    const warn = await db.get(`warn_${target}_${interaction.guild.id}`);
 
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`${target} has ${warn} warn(s)`)
      .setTitle("Warns Checked!")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1039497705753428018/1045730663543885935/verified-blue-check-mark-symbol-logo-trademark-text-transparent-png-821650.png"
      )
      .setTimestamp();
 
    interaction.reply({ embeds: [embed] });
  },
};
 
