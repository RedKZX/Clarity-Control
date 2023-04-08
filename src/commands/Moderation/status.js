const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Set the bots status (cool kids only)')
    .addStringOption(option => option.setName('status').setDescription('The status you want as the bots presence').setMaxLength(128).setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('The type of status you want the bot to have').addChoices( { name: 'Watching', value: `${4}` }, { name: 'Playing', value: `${1}` }, { name: 'Listening', value: `${3}` }, { name: 'Competing', value: `${6}` }, { name: 'Streaming', value: `${2}` }).setRequired(true)),
    async execute (interaction, client) {

        const { options } = interaction;
        const status = options.getString('status');
        const type = options.getString('type');
        const coolkids = [
            "756849096479866996",
    "776602239384158228",
    "314540324561092609",
    "349499224905482240"
        ]

        if (!coolkids.includes(interaction.user.id)) return await interaction.reply({ content: `This command is only for cool kids`, ephemeral: false});
        else {

            client.user.setActivity({
                name: status,
                type: type-1,
                url: `https://www.twitch.tv/coheesion`
            })

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The bot now has the status \`${status}\`, with the type ${type-1}`)

            await interaction.reply({ embeds: [embed], ephemeral: true });

        }
    }
}
