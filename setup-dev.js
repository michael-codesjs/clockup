
// exports env variables in every service for local automated tests.
const { execSync } = require("child_process");
const { path } = require("path");

console.log("\n\n  -- Generating Enviroment Variables --\n");

try {

  execSync("cd services/root && sls export-env");
  execSync("cd services/authentication && sls export-env");
  execSync("cd services/api && sls export-env");
  execSync("cd services/user && sls export-env");
  execSync("cd services/test && sls export-env");
  execSync("cd services/test && sls export-env --filename ../../.env");

} catch(error) {

  console.log("\n  -- Something went wrong --");
  
}

console.log("\n  -- Generated Successfully --");
