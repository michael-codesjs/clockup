import inquirer from "inquirer";
import chalk from "chalk";
import { AWS_Regions, Deployables, ProjectStateParams, Stages } from "../types";

export class ProjectStateUtility {

  deployables: Deployables;
  region: AWS_Regions;
  stage: Stages;

  isDeploy: boolean;
  action: "deploy" | "destroy";
  verb: "deploying" | "destroying";
  tense: "to" | "from";

  constructor(isDeploy: boolean = true) {
    this.isDeploy = isDeploy;
    this.action = isDeploy ? "deploy" : "destroy";
    this.verb = isDeploy ? "deploying" : "destroying";
    this.tense = isDeploy ? "to" : "from";
  }

  isAll() {
    return this.deployables === Deployables.ALL
  }

  isInfrastructure() {
    return this.isAll() || this.deployables === Deployables.INFRASTRUCTURE;
  }

  isMicroservices() {
    return this.isAll() || this.deployables === Deployables.MICROSERVICES;
  }

  async getParams(): Promise<ProjectStateParams> {

    console.clear();

    const deployables = await this.getDeployables();
    const region = await this.getRegion(deployables);
    const stage = await this.getStage(deployables);

    const params: ProjectStateParams = {
      deployables,
      region,
      stage
    };

    console.clear();

    const sure = await this.areYouSure(params);

    return sure ? params : await this.getParams();

  }

  async areYouSure(params: ProjectStateParams): Promise<boolean> {

    const prompt = await inquirer.prompt({
      name: "sure",
      type: "list",
      message: `Are sure you want to ${this.action} the ${chalk.bold.black(params.deployables)} ${this.tense} ${chalk.bold.black(params.region)} in ${chalk.bold.black(params.stage)}?`,
      choices: [
        "yes",
        "no(select other options)",
        "no(exit)"
      ]
    });

    if (prompt.sure === "no(exit)") process.exit(0);

    console.clear();

    return prompt.sure === "yes";

  }

  async getDeployables(): Promise<Deployables> {

    const prompt = await inquirer.prompt({
      name: "deployables",
      type: "list",
      message: `What do you wish to ${this.action}?`,
      choices: Object.values(Deployables)
    });

    return this.deployables = prompt.deployables;

  }

  async getRegion(deployables: Deployables): Promise<AWS_Regions> {

    const prompt = await inquirer.prompt({
      name: "region",
      type: "list",
      message: `What region do you want to ${this.action} the ${chalk.black(deployables)} ${this.tense}?`,
      choices: Object.values(AWS_Regions)
    });

    return this.region = prompt.region;

  }

  async getStage(deployables: Deployables): Promise<Stages> {

    const prompt = await inquirer.prompt({
      name: "stage",
      type: "list",
      message: `What stage do you want to ${this.action} the ${chalk.black(deployables)} ${this.tense}?`,
      choices: Object.values(Stages)
    });

    return this.region = prompt.stage;

  }

}