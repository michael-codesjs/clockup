
// exports env variables in every service for local automated tests.
const { execSync } = require("child_process");
const { readdirSync } = require("fs");

const services = readdirSync("./services", { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

console.log("\n\n  -- Generating Enviroment Variables --\n");

for (let service of services) {
  execSync(`cd ./services/${service} && npx sls export-env`);
}
execSync("cd services/test && npx sls export-env --filename ../../.env");

console.log("\n  -- Generated Successfully --");
