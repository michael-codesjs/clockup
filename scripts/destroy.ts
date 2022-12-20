#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { execAsync, getServices } from "../shared/typescript/utilities/functions";

const getRegion = async () => {

  const prompt = await inquirer.prompt({
    name: "region",
    type: "list",
    message: "What region was the project deployed to?",
    choices: [
      "eu-central-1"
    ]
  });

  return prompt.region;

}

const getStage = async () => {

  const prompt = await inquirer.prompt({
    name: "stage",
    type: "list",
    message: "What stage was the project deployed to?",
    choices: [
      "dev",
      "prod"
    ]
  });

  return prompt.stage;

}

enum Destroyables {
  ALL = "all(microservices + infrastructure)",
  INFRASTRUCTURE = "infrastrucutre",
  SERVICES = "services"
}

const getDestroyables = async () => {
  
  const prompt = await inquirer.prompt({
    name: "deployables",
    type: "list",
    message: "What do you want to deploy?",
    choices: Object.values(Destroyables)
  });

  return prompt.deployables;

}

const destroyInfrastructure = async (region: string, stage: string) => {

  const spinner = ora(`Destroying infrastructure from ${chalk.blue(region)} in ${chalk.blue(stage)}.`)
  spinner.start();
  const command = `cd infrastructure && terraform destroy -input=false -auto-approve --var "region=${region}" --var "stage=${stage}"`;
  const success = await execAsync(command, { stdio: "pipe" });
  if (success) return spinner.succeed(`Successfully destroyed infrastructure from ${chalk.blue(region)} in ${chalk.blue(stage)}.`) || true;
  else spinner.fail(`Failed to destroy infrastructure from ${chalk.blue(region)} in ${chalk.blue(stage)}.
  Run ${chalk.blue(command)} to get a proper error response.
  `);
  return false;

}

const destroyMicroservices = async (region: string, stage: string) => {

  const services = getServices();

  for (const index in services) {
    const service = services[Number(index)];
    const spinner = ora(`Destroying ${chalk.bold.yellow(service)} service from ${chalk.blue(region)} in ${chalk.blue(stage)} (${Number(index) + 1} of ${services.length}).`)
    spinner.start();
    const command = `cd services/${service} && npx sls remove --region=${region} --stage=${stage}`;
    const success = await execAsync(command, { stdio: "pipe" });
    if (!success) {
      spinner.fail(`Failed to destroy ${chalk.bold.green(service)} service from ${chalk.blue(region)} in ${chalk.blue(stage)}.`);
      return false;
    }
    spinner.succeed(`Successfully destoyed ${chalk.bold.green(service)} service from ${chalk.blue(region)} in ${chalk.blue(stage)}.`) || true;
  }

}

(async () => {

  console.clear();

  const region = await getRegion();
  const stage = await getStage();
  const destroyables = await getDestroyables();

  console.clear();

  let microservicesWereDestroyed: boolean = true;

  if(destroyables === Destroyables.ALL || destroyables === Destroyables.SERVICES) {
    microservicesWereDestroyed = await destroyMicroservices(region, stage);
  }

  if(microservicesWereDestroyed && (destroyables === Destroyables.ALL || destroyables === Destroyables.INFRASTRUCTURE)) {
    await destroyInfrastructure(region, stage); 
  }

  console.log();

})();