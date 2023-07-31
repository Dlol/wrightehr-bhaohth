
function loadConfig(filename) {
    const yaml = require('js-yaml')
    const fs = require("fs")
    return yaml.load(fs.readFileSync(filename, "utf-8"))
}

function updateQuestions(config) {
    const fetch = require("node-fetch")
    const fs = require("fs")

    let base = `https://docs.google.com/spreadsheets/d/${config.sheetsId}/export?gid=`
    for (const key in config.sheets) {
        let url = base + config.sheets[key] + "&format=csv"
        console.log(`Fetching ${key}.csv! {${url}}`);
        fetch(url)
            .then(res => res.text())
            .then(body => {
                const file = fs.openSync(key+".csv", "w")
                fs.writeFileSync(file, body)
            })
    }
}

function questionInit(config) {
    const fs = require("fs")
    const {parse} = require('csv/sync');
    let worldQs = []
    let charQs = []
    let prompts = []
    let cats = {}
    const characterRecords = parse(fs.readFileSync(config.files.character, "utf-8"), {
        from: 2,
        relax_column_count: true
    })
    
    // const toLoad = ["character", "world", "prompt", "plot"]

    const worldRecords = parse(fs.readFileSync(config.files.world, "utf-8"), {
        from: 2,
        relax_column_count: true
    })

    const promptRecords = parse(fs.readFileSync(config.files.prompt, "utf-8"), {
        from: 2,
        relax_column_count: true
    })
    
    const categoryRecords = parse(fs.readFileSync(config.files.categories, "utf-8"), {
        from: 2,
        relax_column_count: true
    })
    
    // i know this may seem weird but trust me it'll make the advanced category search easier
    // inefficient in short -> efficient in long
    // ykyk
    // <3 - 3:33 am draven
    for (const item of characterRecords) {
        charQs.push([])
        for (const sub of item) {
            if (sub == "") { continue }
            charQs.at(-1).push(sub)
        }
    }

    for (const item of worldRecords) {
        worldQs.push([])
        for (const sub of item) {
            if (sub == "") { continue }
            worldQs.at(-1).push(sub)
        }
    }

    for (const item of promptRecords) {
        prompts.push([])
        for (const sub of item) {
            if (sub == "") { continue }
            prompts.at(-1).push(sub)
        }
    }

    let currentType = ""
    for (const item of categoryRecords) {
        // console.log(item);
        if (item[2] == "") {
            let type = item.shift()
            switch (type) {
                case "World Questions":
                    currentType = "world"
                    break;
                
                case "Character Questions":
                    currentType = "character"
                    break;
                
                case "Writing Prompts":
                    currentType = "prompt"
                    break;
            
                default:
                    // throw "fuck shit"
            }
            continue
        }
        let category = item.shift()
        if (category == "") {
            category = item.shift()
        }
        else { item.shift() }
        let desc = item.shift()
        if (cats[currentType]) {
            cats[currentType][category] = desc
        }
        else {
            cats[currentType] = {}
            cats[currentType][category] = desc
        }
    }
    return {worldQs, charQs, prompts, cats}
}

function arrayChoose(array) {
    const idx = Math.floor(Math.random() * array.length)
    // console.log(idx)
    return array[idx]
}

function thingPicker(questions, filters) {
    if (!filters) {
        return arrayChoose(questions)
    }
    let pos = []
    let neg = []
    for (const filter of filters) {
        if (filter.at(0) == "-") {neg.push(filter.slice(1))}
        else { pos.push(filter) }
    }
    let filteredQs = []
    outer: for (const item of questions) {
        for (const negFilter of neg) {
            if (item.includes(negFilter)) {
                continue outer
            }
        }
        if (pos.length < 1) {
            filteredQs.push(item)
        }
        let results = []
        for (const posFilter of pos) {
            results.push(item.includes(posFilter))
        }
        if (results.every((val) => val)) {
            filteredQs.push(item)
        }
    }
    return arrayChoose(filteredQs)
}

module.exports = {
    loadConfig,
    updateQuestions,
    questionInit,
    thingPicker
}