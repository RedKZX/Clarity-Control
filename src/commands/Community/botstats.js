const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`botstats`)
    .setDescription('Gives some Mini Red stats!'),
    async execute (interaction, client) {

        const name = "Mini Red";
        const icon = `${client.user.displayAvatarURL()}`;
        let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        let ping = `${Date.now() - interaction.createdTimestamp}ms`;

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Mini Reds home`)
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/clarityd2'),

            new ButtonBuilder()
            .setLabel('Want Mini Red?')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=1058200369555046461&permissions=8&scope=bot`)
        )

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({ name: name, iconURL: icon })
        .setThumbnail(`${icon}`)
        .setFooter({ text: "Made by Henry."})
        .setTimestamp()
        .addFields({ name: 'Server Numbers', value: `${client.guilds.cache.size}`, inline: true})
        .addFields({ name: 'Server Members', value: `${servercount}`, inline: true})
        .addFields({ name: 'Latency', value: `${ping}`, inline: true})
        .addFields({ name: 'uptime', value: `\`\`\`${uptime}\`\`\``})

        await interaction.reply({ embeds: [embed], components: [row] });
    }
}