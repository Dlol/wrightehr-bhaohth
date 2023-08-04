const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

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
        
        const ghButton = new ButtonBuilder()
            .setLabel("Github")
            .setURL("https://github.com/Dlol/wrightehr-bhaohth")
            .setStyle(ButtonStyle.Link)
        
        const sheetButton = new ButtonBuilder()
            .setLabel("Sheets")
            .setURL(`https://docs.google.com/spreadsheets/d/${context.config.sheetsId}/edit#gid=${context.config.sheets.categories}`)
            .setStyle(ButtonStyle.Link)

        const obsidianButton = new ButtonBuilder()
            .setLabel("Obsidian Plugin")
            .setURL("https://github.com/Dlol/writing-helper")
            .setStyle(ButtonStyle.Link)

        const inviteButton = new ButtonBuilder()
            .setLabel("Invite me!")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=914374342341697556&permissions=380708588608&scope=bot")
            .setStyle(ButtonStyle.Link)
        
        const row = new ActionRowBuilder()
                .addComponents(inviteButton, ghButton, sheetButton, obsidianButton);
        
        await interaction.reply({embeds: [creditsEmbed], components: [row]})
    }
}