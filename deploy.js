

const { execSync } = require("child_process");

// add services here in the order they are supposed to be deploy.
const SERVICES = [
  "root",
  "authentication",
  "api",
  "user",
  "../" // the testing service in the root directory
];

const DEPLOYED_SERVICES = [];

console.log("  -- DEPLOYING SERVICES --  ");

for(let i = 0; i < SERVICES.length; i++) {
  const service = SERVICES[i];
  
  try {

    execSync(`cd services/${service} && sls deploy`);
    execSync("sls export-env");

    DEPLOYED_SERVICES.unshift(service);

  } catch(error) {
    console.log(error);
  }

}

console.log("  -- SERVICES DEPLOYED --  ");