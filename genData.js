const backend = require("./backend.js")

let config = backend.loadConfig("config.yaml");
backend.updateQuestions(config);
console.log("Questions downloaded!");