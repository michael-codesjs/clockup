#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { execAsync, getServices } from "../shared/typescript/utilities/functions";

enum Deployables {
  ALL = "infrastructure & microservices",
  INFRASTRUCTURE = "infrastrucutre",
  SERVICES = "services"
}

const getDeployables = async () => {

  const prompt = await inquirer.prompt({
    name: "deployables",
    type: "list",
    message: "What do you wish to deploy?",
    choices: Object.values(Deployables)
  });

  return prompt.deployables;

}

const getRegion = async (deployables: Deployables) => {

  const prompt = await inquirer.prompt({
    name: "region",
    type: "list",
    message: `What region do you want to deploy the ${chalk.cyanBright(deployables)} to?`,
    choices: [
      "eu-central-1"
    ]
  });

  return prompt.region;

}

const getStage = async (deployables: Deployables) => {

  const prompt = await inquirer.prompt({
    name: "stage",
    type: "list",
    message: `What stage do you want to deploy the ${chalk.cyanBright(deployables)} to?`,
    choices: [
      "dev",
      "prod"
    ]
  });

  return prompt.stage;

}

const deployInfrastructure = async (region: string, stage: string) => {

  const spinner = ora(`Deploying infrastructure to ${chalk.blue(region)} in ${chalk.blue(stage)}.`)
  spinner.start();

  const command = `cd infrastructure && terraform apply -input=false -auto-approve --var "region=${region}" --var "stage=${stage}"`;
  const success = await execAsync(command, { stdio: "pipe" });
  
  if (success) return spinner.succeed(`Successfully deployed infrastructure to ${chalk.blue(region)} in ${chalk.blue(stage)}.`) || true;
  else spinner.fail(`Failed to deploy infrastructure to ${chalk.blue(region)} in ${chalk.blue(stage)}.
  Run ${chalk.blue(command)} to get a proper error response.
  `);

  return false;

}

const deployMicroservices = async (region: string, stage: string) => {

  const services = getServices();

  for (const index in services) {

    const service = services[Number(index)];
    
    const spinner = ora(`Deploying ${chalk.bold.yellow(service)} service to ${chalk.blue(region)} in ${chalk.blue(stage)} (${Number(index) + 1} of ${services.length}).`)
    spinner.start();

    const command = `cd services/${service} && npx sls deploy --region=${region} --stage=${stage}`;
    const success = await execAsync(command, { stdio: "pipe" });
    
    if (success) spinner.succeed(`Successfully deployed ${chalk.bold.green(service)} service to ${chalk.blue(region)} in ${chalk.blue(stage)}.`) || true;
    else spinner.fail(`Failed to deploy ${chalk.bold.green(service)} service to ${chalk.blue(region)} in ${chalk.blue(stage)}.`);
  
  }

}

(async () => {

  console.clear();

  const deployables = await getDeployables();
  const region = await getRegion(deployables);
  const stage = await getStage(deployables);

  console.clear();

  let infrastructureWasDeployed: boolean = true;

  if (deployables === Deployables.ALL || deployables === Deployables.INFRASTRUCTURE) {
    infrastructureWasDeployed = await deployInfrastructure(region, stage);
  }

  if (infrastructureWasDeployed && (deployables === Deployables.ALL || deployables === Deployables.SERVICES)) {
    await deployMicroservices(region, stage);
    console.log(`\n ${chalk.black("What to do next you ask? Run ")} ${chalk.bold.blueBright("yarn setup")} ${chalk.black(" to generate some enviroment variables so that you can test stuff.")}`)
  }

  console.log();

})();