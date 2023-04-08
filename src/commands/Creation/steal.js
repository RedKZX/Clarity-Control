const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require(`axios`);
const { EmbedBuilder , PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription(`Rob that emoji you like!`)
    .addStringOption(option => option.setName(`emoji`).setDescription('The emoji you wanna rob.').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription(`Rename that shi`).setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({ content: "Red doesnt trust you enough to let you steal emojis.", ephemeral: true});

        let emoji = interaction.options.getString(`emoji`)?.trim();
        const name = interaction.options.getString('name');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
           const id = emoji.match(/\d{15,}/g)[0];

           const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "Why would you rob a default emoji?", ephemeral: true})
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "Why would you rob a default emoji?", ephemeral: true})
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Robbed ${emoji}, and rebranded to "**${name}**"`)

            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "We have too many emojis>", ephemeral: true})
        })
        
    }
}
//Yoink//