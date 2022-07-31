
import { config } from "./constants";

export function importCloudFormationParam(args:{ name: config.serviceName | string, stack:string, stage:string, output:string }) {
  const { name, stage, stack, output } = args;
  return "${cf:" + `${name}-${stack}-${stage}.${output}`+"}";
}

export function importResourceArn(args: { service:string, region:string, resourceType: string, resourceName: string }) {
  const { service, region, resourceType, resourceName } = args;
  return "arn:aws:"+service+":${aws:"+region+"}:${aws:accountId}:"+resourceType+"/${self:service}-"+resourceName+"-${sls:stage}";
}

export function generateServiceName(name:string) {
  return config.serviceName+"-"+name;
}

export function generateLogicalResourcelName(name:string) {
  return "${self:service}-"+name+"-${self:custom.stage}"
}

export { config as configureEnviromentVariables } from "dotenv";