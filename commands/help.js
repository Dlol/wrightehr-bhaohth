const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helps you with the bot!"),
    async execute(interaction, context) {
        let out = "## Available Commands\n"
        out += "- `categories`: Displays available categories to filter by\n"
        out += "- `credits`: Displays credits for the bot! (it's more than one person!)\n"
        out += "- `help`: You're on it, buddy!\n"
        out += "- `questions`: Gives you a question of whatever type you specify with the filters provided\n"
        out += "\nAdvanced filter help: you can have multiple! separate them with spaces. If you want to filter out a category, prepend it with `-`\n"
        out += "For example, `/question Character abilities -background` would select a random question from the abilities section that doesn't also have the background tag!"
        out += "\n\n*Lost? Try `/question Worldbuilding starter`!*"
        await interaction.reply(out)
    }
}