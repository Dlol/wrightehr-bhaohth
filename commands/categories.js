const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("categories")
        .setDescription("displays the categories")
        .addStringOption(option => 
            option.setName("category")
                .setDescription("The question category to filter")
                .setRequired(false)
                .addChoices(
                    { name: 'Character', value: 'character' },
                    { name: 'Plot', value: 'plot' },
                    { name: 'Prompt', value: 'prompt' },
                    { name: 'Worldbuilding', value: 'worldbuilding'}
                )
        ),
    async execute(interaction, context) {
        const {questionData} = context
        const {cats} = questionData
        const selection = interaction.options.getString('category')
        if (selection) {
            let source = cats.world
            switch (selection) {
                case "character":
                    source = cats.character
                    break;
                
                case "prompt":
                    source = cats.prompt
                    break;
                
                case "plot":
                    source = cats.plot
                    break;

                default:
                    break;
            }
            let wbText = ""
            for (let key in source) {
                wbText += `- **${key}**: ${source[key]}\n`
            }
            await interaction.reply(wbText)
            return
        }
        let wbText = ""
        for (let key in cats.world) {
            wbText += `- ${key}\n`
        }
        let charText = ""
        for (let key in cats.character) {
            charText += `- ${key}\n`
        }
        let promptText = ""
        for (let key in cats.prompt) {
            promptText += `- ${key}\n`
        }
        let plotText = ""
        for (let key in cats.plot) {
            plotText += `- ${key}\n`
        }
        // log(wbText)
        // log(charText)
        // log(promptText)
        let embed = new EmbedBuilder()
            .setTitle("Writer Bot Categories")
            .setDescription("Current categories that can be filtered by")
            .addFields(
                {name: "Worldbuilding", value: wbText},
                {name: "Character", value: charText},
                {name: "Prompts", value: promptText},
                {name: "Plot", value: plotText}
            )
            .setFooter({ text: "Use >categories [type] to get more details!"})
            .setTimestamp()
        
        await interaction.reply({embeds: [embed]})
    }
}