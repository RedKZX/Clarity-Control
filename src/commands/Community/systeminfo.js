const {SlashCommandBuilder} = require('@discordjs/builders')
const {EmbedBuilder} = require('discord.js')
const { performance } = require('perf_hooks');
const os = require('os');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('systeminfo')
    .setDescription('prints detailed information about the system'),
    async execute(interaction) {
        const usage2 = process.memoryUsage();
        const usage = process.cpuUsage();
        const usagePercent = usage.system / usage.user * 100;
        const usagePercent2 = usage2.system / usage2.user * 100;
        const memoryUsed = (os.totalmem - os.freemem)/1000000000
        const memoryTotal = os.totalmem()/1000000000
        const embed = new EmbedBuilder()
        .setTitle('System Usage')
        .setColor("Red")
        .setDescription('Details of hardware being used on the bot')
        .addFields({name: `Memory:`, value: `${(memoryUsed/memoryTotal * 100).toFixed(1)}%`})
        .addFields({name: 'OS:', value: `${os.type}`})
        .addFields({name: `OS Version:`, value: `${os.release}`})
        .addFields({name: 'CPU: ', value: `${usagePercent.toFixed(1)}%`})
        .addFields({name: 'CPU Type (Arch): ', value: `${os.arch}`})
 
        .setTimestamp()
        await interaction.reply({embeds: [embed]})
    }
}