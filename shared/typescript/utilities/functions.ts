import { exec } from "child_process";
import { readdirSync } from "fs";
import { chance, config, stacks } from "./constants";
import { config as dotenvConfig } from "dotenv";
import { ValidationError } from "yup";
import { EntityType, ErrorResponse, ErrorTypes } from "../types/api";

export function configureEnviromentVariables() {
	dotenvConfig();
	return process.env;
}

export function generateServicePath(serviceName: string) {
	return `services/${serviceName}`;
}

export function createMappingTemplate({ field, type, source, request, response }: { field: string, type: string, source: string, request?: string, response?: string }) {
	return {
		type,
		field,
		dataSource: source,
		request: request || false,
		response: request || false,
	};
}

export function createLambdaDataSource(name: string) {
	return {
		type: "AWS_LAMBDA",
		name,
		config: {
			functionName: name,
		}
	};
}

type CreateStateMachineDataSourceParams = {
	name: string,
	sync: boolean,
	stateMachineArn: string
}

export function createStateMachineDataSource(params: CreateStateMachineDataSourceParams) {
	// SOME USEFUL RESOURCES:
	// https://aws.amazon.com/blogs/mobile/invoke-aws-services-directly-from-aws-appsync/
	// https://confix.medium.com/aws-appsync-start-sync-step-function-express-workflow-d01bab650061
	const { name, sync, stateMachineArn } = params;
	return {
		type: "HTTP",
		name,
		config: {
			endpoint: {
				"Fn::Sub": `https://${sync ? "sync-" : ""}states.\${self:custom.region}.amazonaws.com/`
			},
			authorizationConfig: {
				authorizationType: "AWS_IAM",
				awsIamConfig: {
					signingRegion: "${self:custom.region}",
					signingServiceName: "states"
				}
			},
			iamRoleStatements: [{
				Effect: "Allow",
				Action: [sync ? "states:StartSyncExecution" : "states:StartExecution"],
				Resource: [stateMachineArn]
			}]
		}
	}
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
};

export const delay = (ms: number) => {
	return new Promise(resolve => setTimeout(() => resolve(null), ms));
};

export const execAsync = (command: string, options: any) => new Promise((res) => {
	exec(command, options, error => res(error === null));
});

export const getServices = () => (
	readdirSync("services", { withFileTypes: true })
		.filter((item) => item.isDirectory())
		.map((item) => item.name)
);

export const isLiteralObject = (obj: any): obj is Object => {
	return (!!obj) && (obj.constructor === Object);
};

export const isLiteralArray = <T>(arr: T[]): arr is T[] => {
	return Array.isArray(arr);
};

export const handlerPath = (context: string) => {
	return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, "/")}`;
};

/** picks and returns random attributes from an object, attributes returned are less than the total number of attributes and at least one attribute is returned. */
export const pickRandomAttributesFromObject = <T extends Record<string, any>>(obj: T): Partial<T> => {

	const final: T = {} as T;

	const entries = Object.entries(obj);
	const maxAttributes = chance.integer({ min: 1, max: entries.length - 1 });

	for (let x = 0; x < maxAttributes; x++) {

		let attribute: (typeof entries)[number];

		do {
			attribute = entries[chance.integer({ min: 0, max: maxAttributes })];
		} while (attribute[0] in final); // while key in final

		final[attribute[0] as keyof T] = attribute[1];

	}

	return final;

}
