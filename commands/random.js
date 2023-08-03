const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Gives you a random number between 1 and the max value (inclusive)")
        .addIntegerOption(option => 
            option.setName("maxval")
                .setDescription("Max value of the roll (default 6)")
                .setRequired(false)),
        async execute(interaction, _) {
            let max = 6
            const inpMax = interaction.options.getInteger("maxval")
            if (inpMax) {
                max = inpMax
            }
            await interaction.reply(`Your result is: ${Math.floor(Math.random() * max + 1)} (max: ${max})`)
        }
}