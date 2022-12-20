import { exec } from "node:child_process";
import { readdirSync } from "node:fs";
import ora from "ora";
import chalk from "chalk";
import { getServices, execAsync } from "../shared/typescript/utilities/functions";

console.clear();

const services = getServices();

const generateEnvFiles = async (index: number = 0) => {

	const service = services[index];
	
	const spinner = ora(`Generating enviroment variables for the ${chalk.bold.blue(service)} service (${index + 1} of ${services.length}).`);
	spinner.start();
	
	const success = await execAsync(`cd services/${service} && npx sls export-env`, { stdio: "pipe" });
	
	if (success) spinner.succeed(`Successfully generated enviroment variables for the ${chalk.bold.green(service)} service.`);
	else spinner.fail(`Failed to generate enviroment variables for the ${chalk.bold.red(service)} service`);
	
	return index === services.length - 1 ? null : await generateEnvFiles(index + 1);

};

(async () => {

	// await generateEnvFiles();
	
	const spinner = ora("Generating final enviroment variables.")
	spinner.start();

	const success = await execAsync("cd services/test && npx sls export-env --filename ../../.env", { stdio: "pipe" });
	
	if (success) {
		spinner.succeed("Successfully generated final enviroment variables.");
		console.log("\n   " + chalk.bgGreen.bold.black(" TEST AWAY! ") + "\n");
	} else {
		spinner.fail("Failed to generate final enviroment variables");
	}

})();