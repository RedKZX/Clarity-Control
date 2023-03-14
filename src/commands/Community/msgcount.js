const { 
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message-count')
        .setDescription('See how lonely people are in the real world.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The gremlin to be exposed')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({ content: 'Red doesnt let you do this', ephemeral: true });
        }

        try {
            let messageCount = 0;
            let lastMessageId = null;

            while (true) {
                let options = { limit: 100 };

                if (lastMessageId) {
                    options.before = lastMessageId;
                }

                const messages = await channel.messages.fetch(options);
                const messagesByUser = messages.filter(m => m.author.id === user.id);

                if (messagesByUser.size === 0) {
                    break;
                }

                messageCount += messagesByUser.size;

                if (messagesByUser.size < 100) {
                    break;
                }

                lastMessageId = messagesByUser.last().id;
            }

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Message Count`)
                .setDescription(`**User**: ${member}\n**Messages**: ${messageCount}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Henry broke something.', ephemeral: true });
        }
    },
};