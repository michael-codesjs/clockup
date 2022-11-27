
import { config, stacks } from "./constants";
import { config as dotenvConfig } from "dotenv";
import { ValidationError } from "yup";
import { EntityType, ErrorResponse, ErrorTypes } from "@local-types/api";

export function configureEnviromentVariables() {
	dotenvConfig();
	return process.env;
}

export function generateServicePath(serviceName: string) {
	return `services/${serviceName}`;
}

export function createMappingTemplate({ field, type, source }: { field: string, type: string, source: string }) {
	return {
		type,
		field,
		dataSource: source,
		request: false,
		response: false,
	};
}

export function createDataSource(name: string) {
	return {
		type: "AWS_LAMBDA",
		name,
		config: {
			functionName: name,
		}
	};
}


export function importCloudFormationParam(args: { name: config.serviceName | string, stack: stacks, stage: string, output: string }) {
	const { name, stage, stack, output } = args;
	return "${cf:" + `${name}-${stack}-${stage}.${output}` + "}";
}

export function importLocalCloudFormationParam(args: { stack: stacks, stage?: string, output: string }) {
	const { stack, output } = args;
	let { stage } = args;
	stage = stage || "${self:custom.stage}";
	const name = config.serviceName;
	return importCloudFormationParam({ name, stack, stage, output });
}

export function importResourceArn(args: { service: string, region: string, resourceType: string, resourceName: string }) {
	const { service, region, resourceType, resourceName } = args;
	return "arn:aws:" + service + ":${aws:" + region + "}:${aws:accountId}:" + resourceType + "/${self:service}-" + resourceName + "-${sls:stage}";
}

export function generateServiceName(name: string) {
	return config.serviceName + "-" + name;
}

export function generateLogicalResourcelName(name: string) {
	return "${self:service}-" + name + "-${self:custom.stage}";
}

export function constructKey(descriptor: string, value: string) {
	return `${descriptor.toUpperCase()}#${value}`;
}

export const capitalizeFirstLetter = (str: string) => {
	return str[0].toUpperCase() + str.slice(1);
};

export const getErrorResponse = (error: ValidationError | Error, type: ErrorTypes, code = 0,): ErrorResponse => {
	return {
		__typename: "ErrorResponse",
		type,
		message: error.message,
		code
	};
};

export const getEntityTypes = () => Object.values(EntityType);

export const getRandomEntityType = () => {
	const entityTypes = getEntityTypes();
	return entityTypes[Math.round(Math.random() * (entityTypes.length - 1))];
};

export const getRandomCreatableEntityType = () => {
	const entityTypes = getEntityTypes().filter(entityType => entityType !== EntityType.User);
	return entityTypes[Math.round(Math.random() * (entityTypes.length - 1))];
}

export const delay = (ms: number) => {
	return new Promise(resolve => setTimeout(() => resolve(null), ms));
}