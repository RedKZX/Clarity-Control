const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Get Mini Red out of there!")
    .addStringOption(option =>
      option.setName("guildid")
          .setDescription("guildid")
          .setRequired(true)
    ),
                   
                    async execute(interaction, client) {

                      if(interaction.member.id !== '756849096479866996') return interaction.reply({ content: 'Only Red can do this!', ephemeral: false})

                      interaction.reply({content:'Mini Red is free!', ephemeral: false})

                      const guildid = interaction.options.getString("guildid");

                      const guild = client.guilds.cache.get(guildid)

                      guild.leave().catch(() => {
                    return false;
                    });

                    }
}