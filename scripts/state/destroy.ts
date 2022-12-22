#!/usr/bin/env node
import chalk from "chalk";
import ora from "ora";
import { ProjectStateParams } from "scripts/types";
import { execAsync, getServices } from "../../shared/typescript/utilities/functions";
import { ProjectStateUtility } from "./utility";

const utility = new ProjectStateUtility(false);

(async () => {

  const { region, stage } = await utility.getParams();

  let microservicesWereDestroyed: boolean = true;

  if(utility.isMicroservices()) {
    microservicesWereDestroyed = await destroyMicroservices({ region, stage });
    microservicesWereDestroyed = microservicesWereDestroyed === undefined;
  }

  if(microservicesWereDestroyed && utility.isInfrastructure()) {
    await destroyInfrastructure({ region, stage }); 
  }

  console.log();

})();

async function destroyInfrastructure(params: Pick<ProjectStateParams, "region" | "stage">) {

  const { region, stage } = params;

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

async function destroyMicroservices(params: Pick<ProjectStateParams, "region" | "stage">) {

  const { region, stage } = params;

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