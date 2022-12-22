#!/usr/bin/env node
import chalk from "chalk";
import { exec } from "child_process";
import { copyFile, unlink } from "fs";
import ora from "ora";

console.clear();
console.log("\n" + chalk.black(" Generating Types, Queries and Mutations From The GraphQL Schema.") + "\n");

const execAsync = (command: string, options: any) => new Promise((res) => {
	exec(command, options, error => res(error === null));
});

const copySchema = () => new Promise((res) => {
	copyFile("shared/graphql/schema.graphql", "config/schema.graphql", (err) => res(err === null));
});

const deleteCopiedSchema = () => new Promise((res) => {
	unlink("config/schema.graphql", (err) => res(err === null));
});

/** generates codgen types. */
const generateCodegenTypes = async () => {

	const spinner = ora("Generating GraphQl-Codegen types from the GraphQL schema.").start();
	const success = await execAsync("npx graphql-codegen --config config/codegen.yml", { stdio: "pipe" });
	if (success) spinner.succeed("Successfully generated GraphQL codegen types.");
	else spinner.fail("Failed to generate GraphQL codegen types.");

};

const generateAmplifyTypesAndQueriesAndMutations = async () => {

	const spinner = ora("Generating Amplify types, queries and mutations from the GraphQL schema.")
	spinner.start();

	await copySchema(); // copy scheme to ./config/schema.graphql because Amplify codegen requires the config file and schema to be in the same folder.
	
	const success = await execAsync("cd config && amplify codegen", { });
	
	await deleteCopiedSchema(); // delete copied ./config/schema.graphql cause who wants two schemas to confuse people?
	
	if (success) spinner.succeed("Successfully generated Amplify types, queries and mutations.");
	else spinner.fail("Failed to generate Amplify types, queries and mutations.");

};

(async () => {
	await generateCodegenTypes();
	await generateAmplifyTypesAndQueriesAndMutations();
	console.log("\n");
})();