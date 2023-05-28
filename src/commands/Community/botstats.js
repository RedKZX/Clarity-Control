const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version } = require('discord.js')
const os = require('os');
const { MongoClient } = require('mongodb')
require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Bot stats, specs, info, etc.'),
    async execute(interaction, client) {
        const calculateCpuUsage = () => {
            const cpus = os.cpus();
            let totalIdle = 0;
            let totalTick = 0;
          
            for (let i = 0, len = cpus.length; i < len; i++) {
              const cpu = cpus[i];
          
              for (let type in cpu.times) {
                totalTick += cpu.times[type];
              }
          
              totalIdle += cpu.times.idle;
            }
          
            return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
          };
          const startUsage = calculateCpuUsage();
setTimeout(async () => {
  const endUsage = calculateCpuUsage();
  const idleDifference = endUsage.idle - startUsage.idle;
  const totalDifference = endUsage.total - startUsage.total;
  const percentageCpuUsage = 100 - Math.floor(100 * (idleDifference / totalDifference || 0));

        const clientDB = new MongoClient(process.env.MONGODBURL);
        const operatingSystem = os.platform();
        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));
        const uptimes = `${days}d ${hours}h ${minutes}m ${seconds}s`
        const totalme = Math.round(os.totalmem() / (1024 * 1024 || 0));
        const usedme = Math.round((os.totalmem() - os.freemem()) / (1024 * 1024 || 0));
        try {
            await clientDB.connect();
            const database = clientDB.db('test');
            const start = Date.now();
            await database.command({ ping: 1 });
            const end = Date.now();
            const ping = end - start;
        const embed = new EmbedBuilder()
        .setTitle('Bot Information')
        .setColor('Red')
        .addFields(
            { name: 'Version', value: '```1.0.0```', inline: true },
            { name: 'Library', value: '```Discord.js```', inline: true },
            { name: 'Node.js', value: `\`\`\`${process.version}\`\`\``, inline: true }
        )
        const btn = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('botspec')
            .setEmoji('🤖')
            .setLabel('Bot Specs')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('latency')
            .setEmoji('🏓')
            .setLabel('Bot Ping')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('botuptime')
            .setEmoji('🖥️')
            .setLabel('Bot Uptime')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('botstat')
            .setEmoji('📈')
            .setLabel('Bot Stat')
            .setStyle(ButtonStyle.Primary)
        )
        const msg = await interaction.reply({ 
            embeds: [embed],
            components: [btn]
         })
         const collector = await msg.createMessageComponentCollector();
         collector.on("collect", async (i) => {
            if (i.customId === 'botspec') {
                const embed = new EmbedBuilder()
                .setTitle('🤖・Bot Specs')
                .setColor('Red')
                .addFields(
                    { name: '💾・Memory Total', value: `\`\`\`${totalme}MB\`\`\``},
                    { name: '💾・Memory Used', value: `\`\`\`${usedme}MB\`\`\``},
                    { name: '🖥️・OS', value: `\`\`\`${os.type}\`\`\``},
                    { name: '🖥️・OS Version', value: `\`\`\`${os.release}\`\`\`` },
                    { name: '📁・Node.js', value: `\`\`\`${process.version}\`\`\`` },
                    { name: '🤖・Discord.js', value: `\`\`\`${version}\`\`\`` },
                    { name: '📈・Uptime', value: `\`\`\`${uptimes}\`\`\`` },                    
                    { name: '🗄️・CPU', value: `\`\`\`${os.cpus()[0].model}\`\`\`` },
                    { name: '🗄️・CPU Usage', value: `\`\`\`${percentageCpuUsage}%\`\`\`` },
                    { name: '🗄️・CPU Type (Arch)', value: `\`\`\`${os.arch}\`\`\``},
                    { name: '🖥️・Operating System', value: `\`\`\`${operatingSystem}\`\`\`` }
                )
                await i.update({ embeds: [embed], components: [btn] })
            }
            if (i.customId === 'latency') {
                const embed = new EmbedBuilder()
                .setTitle('**`🏓・Pong!`**')
                .addFields(
                    { name: '🤖・Client Latency', value: `${client.ws.ping} ms`, inline: true },
                    { name: '📦・Database Latency', value: `${ping} ms`, inline: true }
                )
                .setColor("Red")
                .setTimestamp()
                await i.update({ embeds: [embed], components: [btn] })
            }
            if (i.customId === 'botuptime') {
                const embed = new EmbedBuilder()
                .setTitle('🤖・Uptime')
                .addFields(
                    { name: "📈・Uptime", value: `\`\`\`${uptimes}\`\`\``}
                )
                await i.update({ embeds: [embed], components: [btn] })
            }
            if (i.customId === 'botstat') {
                let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);
                const embed = new EmbedBuilder()
                .setTitle('🤖・Bot Statistic')
                .addFields(
                    { name: '🏘️・Server Count', value: `\`\`\`${client.guilds.cache.size}\`\`\``, inline: true},
                    { name: '👥・User Count', value: `\`\`\`${servercount}\`\`\``, inline: true },
                    { name: '🤖・Total Commands', value: `\`\`\`${client.commands.size}\`\`\``, inline: true },
                    { name: '🏓・Latency', value: `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``, inline: false},
                    { name: '🖥️・Uptime', value: `\`\`\`${uptimes}\`\`\``, inline: false}
                    )
                await i.update({ embeds: [embed], components: [btn] })
            };
         })
        } catch (error) {
            console.log(error);
        }
    })
}
};
