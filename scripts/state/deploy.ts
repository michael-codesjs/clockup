#!/usr/bin/env node
import chalk from "chalk";
import ora from "ora";
import { ProjectStateParams } from "../types";
import { execAsync, getServices } from "../../shared/typescript/utilities/functions";
import { ProjectStateUtility } from "./utility";

const utility = new ProjectStateUtility();

(async () => {

  const {
    region,
    stage,
  } = await utility.getParams();

  let infrastructureWasDeployed: boolean = true;

  if (utility.isInfrastructure()) infrastructureWasDeployed = await deployInfrastructure({ region, stage });

  if (infrastructureWasDeployed && utility.isMicroservices()) {
    await deployMicroservices({ region, stage });
    console.log(`\n ${chalk.black("What to do next you ask? Run ")} ${chalk.bold.blueBright("yarn setup")} ${chalk.black(" to generate some enviroment variables so that you can test stuff.")}`)
  }

})();

async function deployInfrastructure(params: Pick<ProjectStateParams, "region" | "stage">) {

  const { region, stage } = params;

  const spinner = ora(`Deploying infrastructure to ${chalk.black(region)} in ${chalk.black(stage)}.`)
  spinner.start();

  const command = `cd infrastructure && terraform init && terraform apply -input=false -auto-approve --var "region=${region}" --var "stage=${stage}"`;

  const success = await execAsync(command, { stdio: "pipe" });

  if (success) return spinner.succeed(`Successfully deployed infrastructure to ${chalk.black(region)} in ${chalk.black(stage)}.`) || true;
  else spinner.fail(`Failed to deploy infrastructure to ${chalk.black(region)} in ${chalk.black(stage)}.
  Run ${chalk.blue(command)} to get a proper error response.
  `);

  return false;

}

async function deployMicroservices(params: Pick<ProjectStateParams, "region" | "stage">) {

  const { region, stage } = params;

  const services = getServices();


  for (const index in services) {

    const service = services[Number(index)];

    const spinner = ora(`Deploying ${chalk.bold.yellow(service)} service to ${chalk.black(region)} in ${chalk.black(stage)} (${Number(index) + 1} of ${services.length}).`)
    spinner.start();

    const command = `cd services/${service} && npx sls deploy --region=${region} --stage=${stage}`;

    const success = await execAsync(command, { stdio: "pipe" });

    if (success) spinner.succeed(`Deployed ${chalk.bold.green(service)} service to ${chalk.black(region)} in ${chalk.black(stage)}.`) || true;
    else spinner.fail(`Failed to deploy ${chalk.bold.green(service)} service to ${chalk.black(region)} in ${chalk.black(stage)}.`);

  }

}
