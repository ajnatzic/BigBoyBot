// const fs = require('node:fs');
// const path = require('node:path');
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
// import TOKEN from './config.json' assert { type: "json" };
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;

// const data = new SlashCommandBuilder()
// 	.setName('echo')
// 	.setDescription('Replies with your input!')
// 	.addStringOption(option =>
// 		option.setName('input')
// 			.setDescription('The input to echo back'));
;
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'say',
        description: 'Replies with whatever the user specifies after \"say\".',

    },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}



const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
//     const commandsPath = path.join(foldersPath, folder);
//     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
//     for (const file of commandFiles) {
//         const filePath = path.join(commandsPath, file);
//         const command = require(filePath);
//         // Set a new item in the Collection with the key as the command name and the value as the exported module
//         if ('data' in command && 'execute' in command) {
//             client.commands.set(command.data.name, command);
//         } else {
//             console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//         }
//     }
// }

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    //   if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    // if (!command) {
    //     console.error(`No command matching ${interaction.commandName} was found.`);
    //     return;
    // }

    // try {
    //     await command.execute(interaction);
    // } catch (error) {
    //     console.error(error);
    //     if (interaction.replied || interaction.deferred) {
    //         await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    //     } else {
    //         await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    //     }
    // }

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'say') {
        // const input = interaction.
        await interaction.reply('Pong!');
        // interaction.reply('Please enter more input.').then(() => {
        //     const collectorFilter = m => interaction.user.id === m.author.id;
        
        //     interaction.channel.awaitMessages({ filter: collectorFilter, time: 60_000, max: 1, errors: ['time'] })
        //         .then(messages => {
        //             interaction.followUp(`You've entered: ${messages.first().content}`);
        //         })
        //         .catch(() => {
        //             interaction.followUp('You did not enter any input!');
        //         });
        // });
        // const sayMessage = args.join(' ');
        //         // Then we delete the command message.
        //         message.delete().catch(() => { });
        //         // And we get the bot to say something:
        //         interaction.send(sayMessage);
    }
});

client.login(TOKEN);