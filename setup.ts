const { exec } = require("child_process");
const { readdirSync } = require("fs");
const ora = require("ora");
const chalk = require("chalk");

console.clear();

const services = readdirSync("./services", { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

const execAsync = (command: string, options: any) => new Promise((res) => {
  exec(command, options, error => {
    res(error === null);
  })
});

const generateEnvFile = async (index: number) => {
  const service = services[index];
  const spinner = ora(`Generating enviroment variables for the ${chalk.bold.blue(service)} service (${index + 1} of ${services.length}).`).start();
  const success = await execAsync(`cd ./services/${service} && npx sls export-env`, { stdio: "pipe" });
  if (success) spinner.succeed(`Successfully generated enviroment variables for the ${chalk.bold.green(service)} service.`)
  else spinner.fail(`Failed to generate enviroment variables for the ${chalk.bold.red(service)} service`);
  return index === services.length - 1 ? null : await generateEnvFile(index + 1);
}

(async () => {
  await generateEnvFile(0);
  const spinner = ora(`Generating final enviroment variables.`).start();
  const success = await execAsync(`cd services/test && npx sls export-env --filename ../../.env`, { stdio: "pipe" });
  if (success) {
    spinner.succeed(`Successfully generated final enviroment variables.`);
    console.log("\n   " + chalk.bgGreen.bold.black(" TEST AWAY! ") + "\n");
  } else {
    spinner.fail("Failed to generate final enviroment variables");
  }
})();

