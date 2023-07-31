const { log } = require("console")
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require("discord.js")
const io = require("@pm2/io")

const backend = require("./backend.js")

require('dotenv').config()

let config = backend.loadConfig("config.yaml")

let questionData = {}
const reloadMetric = io.counter({name: "Reloads", id: "app/util/reloads"})


// function updateSheets() {
//     let sheetId = process
// }

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

client.once(Events.ClientReady, c => {
    log(`Ready, logged in as ${c.user.tag}`)
    // log("updating questions")
    // log(config)
    // backend.updateQuestions(config)
    questionData = backend.questionInit(config)
    // log(questionData.cats)
    // log("if ur cool then you will print this out")
    // log(worldQs)
})

client.addListener(Events.MessageCreate, async (message) => {
    if (message.author.bot) {
        return
    }
    let content = message.content
    if (content.slice(0, 1) != ">") { return }
    content = content.slice(1)
    const command = content.split(" ")[0]
    const params = content.split(" ")
    params.shift()
    // log(content)
    switch (command) {
        case "help":
            let out = "## Available commands\n"
            for (let data of config.help) {
                out += `- ${data.name} (${data.alts.join(", ")}): \`${data.usage}\`
    ${data.desc}\n`
            }
            out += "*Lost? Try `>wbc starter`!*"
            await message.reply(out)
            break;
        
        case "credits":
            let creditsFields = []
            for (const type in config.credits) {
                creditsFields.push({name: type, value: config.credits[type].join(", ")})
            }
            log(creditsFields)
            let creditsEmbed = new EmbedBuilder()
                .setTitle("Credits")
                .setDescription("Who made the bot!")
                .addFields(
                    creditsFields
                )
                .setTimestamp()
                .setURL("https://docs.google.com/spreadsheets/d/" + config.sheetsId + "/edit#gid=" + config.sheets.categories)
            
            await message.reply({embeds: [creditsEmbed]})
            break;

        case "cats":
        case "categories":
            const {cats} = questionData
            if (params[0]) {
                let source = cats.world
                switch (params[0]) {
                    case "character":
                        source = cats.character
                        break;
                    
                    case "prompts":
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
                await message.reply(wbText)
                break;
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
            
            await message.channel.send({embeds: [embed]})
            break;

        case "download":
        case "update":
            // if (!config.reloadAllowed.includes(message.author.id)) { return; }
            await message.channel.send("starting...")
            config = backend.loadConfig("config.yaml")
            backend.updateQuestions(config, async () => {
                questionData = backend.questionInit(config)
                await message.channel.send("done!")
            })
            reloadMetric.inc()
            break;
        
        case "worldbuilding":
        case "wbc":
            const worldSelected = backend.thingPicker(questionData.world, params)
            await message.reply(pickDisplay(worldSelected))
            break;
        
        case "character":
        case "cbc":
            const charSelected = backend.thingPicker(questionData.character, params)
            await message.reply(pickDisplay(charSelected))
            break;

        case "prompt":
            const promptSelected = backend.thingPicker(questionData.prompts, params)
            await message.reply(pickDisplay(promptSelected))
            break;
        
        case "pbc":
        case "plot":
        case "sbc":
            const plotSelected = backend.thingPicker(questionData.plot, params)
            await message.reply(pickDisplay(plotSelected))
            break;
    
        default:
            break;
    }
})

function pickDisplay(thing) {
    if (!thing) { return "Nothing matches your filters!" }
    return `${thing.slice(0, 1)} \`[${thing.slice(1).join(", ")}]\``
}

client.login(process.env["DISCORD_TOKEN"])