const { SlashCommandBuilder } = require("discord.js");
const backend = require("../backend.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Asks you a question of the specified type")
        .addStringOption(option => 
            option.setName("type")
                .setDescription("The type of question to give you")
                .setRequired(true)
                .addChoices(
                    {name: "Worldbuilding", value: "world"},
                    {name: "Character", value:"character"},
                    {name: "Plot", value: "plot"},
                    {name: "Prompts", value: "prompt"},
                    { name:"TTRPG", value: "ttrpg" }
                ))
        .addStringOption(option =>
            option.setName("filter")
                .setDescription("Filters you want to apply to questions (check help)")
                .setRequired(false)),
    async execute(interaction, context) {
        const {questionData} = context
        const selection = questionData[interaction.options.getString("type")]
        let filters = interaction.options.getString('filter')
        if (filters == undefined) { filters = [] }
        else { filters = filters.split(" ") }
        const selected = backend.thingPicker(selection, filters)
        if (!selected) {
            await interaction.reply("Nothing matches your filters!");
        }
        await interaction.reply(`${selected.slice(0,1)} \`[${selected.slice(1).join(", ")}]\``)
    }
}