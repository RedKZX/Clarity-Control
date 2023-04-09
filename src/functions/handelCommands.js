const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const ascii = require("ascii-table");
const table = new ascii().setHeading("Commands", "Status");

const clientId = '1058200369555046461'; 
const guildId = '894043142205104178'; 

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                table.addRow(file, "Loaded");
                continue;
                
            }
        }

        return console.log(table.toString(), `\n Loaded Commands`);

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log("\/\/\/\/\/");

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log("\/\/\/\/\/");
            } catch (error) {
                console.error(error);
            }
        })();
    };
};

