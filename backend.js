const toLoad = ["character", "world", "prompt", "plot"]

function loadConfig(filename) {
    const yaml = require('js-yaml')
    const fs = require("fs")
    return yaml.load(fs.readFileSync(filename, "utf-8"))
}

function updateQuestions(config, callback = () => {}) {
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
                fs.closeSync(file)
            })
    }
    console.log("questions updated");
    setTimeout(() => {
        callback()
    }, 1000);
}

function questionInit(config) {
    const fs = require("fs")
    const {parse} = require('csv/sync');
    let cats = {}

    let loaded = {}

    for (const item of toLoad) {
        const records = parse(fs.readFileSync(config.files[item], "utf-8"), {
            from: 2,
            relax_column_count: true
        })
        let obj = []
        for (const record of records) {
            obj.push([])
            for (const sub of record) {
                if (sub == "") {continue}
                obj.at(-1).push(sub)
            }
        }
        loaded[item] = obj
    }
    
    const categoryRecords = parse(fs.readFileSync(config.files.categories, "utf-8"), {
        from: 2,
        relax_column_count: true
    })

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

                case "Plot Questions":
                    currentType = "plot"
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
    console.log("questions init");
    // console.log(cats);
    return {...loaded, cats}
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
    thingPicker,
    toLoad
}