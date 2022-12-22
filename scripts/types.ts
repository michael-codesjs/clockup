export enum Deployables {
  ALL = "infrastructure & microservices",
  INFRASTRUCTURE = "infrastrucutre(only)",
  MICROSERVICES = "microservices(only)"
}

export enum AWS_Regions {
  EU_CENTRAL_1 = "eu-central-1"
}

export enum Stages {
  DEV = "dev",
  TEST = "test",
  PROD = "prod"
}

export type ProjectStateParams = {
  deployables: Deployables,
  region: AWS_Regions,
  stage: Stages,
};