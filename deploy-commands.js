const {REST, Routes} = require("discord.js")
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

const commands = []

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        // log(command.data.name)
        commands.push(command.data.toJSON())
    } else {
        console.warn(`the command at ${filePath} is missing data/execute!`)
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`refreshing ${commands.length} app commands`)

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT),
            { body: commands }
        )

        console.log(`Reloaded ${data.length} commands`)
    } catch (error) {
        console.error(error)
    }
})()