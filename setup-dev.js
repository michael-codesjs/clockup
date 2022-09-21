
// exports env variables in every service for local automated tests.
const { execSync } = require("child_process");
const { path } = require("path");

const services = [
  "root",
  "authentication",
  "api",
  "user",
  "test"
]

console.log("\n\n  -- Generating Enviroment Variables --\n");

for (let service of services) {
  execSync(`cd services/${service} && sls export-env`);
}
execSync("cd services/test && sls export-env --filename ../../.env");

console.log("\n  -- Generated Successfully --");
