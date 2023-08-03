const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("Displays the credits for the bot!"),
    async execute(interaction, context) {
        let creditsFields = []
        for (const type in context.config.credits) {
            creditsFields.push({name: type, value: context.config.credits[type].join(", ")})
        }
        // console.log(creditsFields)
        let creditsEmbed = new EmbedBuilder()
            .setTitle("Credits")
            .setDescription("Who made the bot!")
            .addFields(
                creditsFields
            )
            .setTimestamp()
            .setURL("https://docs.google.com/spreadsheets/d/" + context.config.sheetsId + "/edit#gid=" + context.config.sheets.categories)
        
        await interaction.reply({embeds: [creditsEmbed]})
    }
}