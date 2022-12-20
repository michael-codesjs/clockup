// will move to the config folder as soon as I figure out the "No tests found, exiting with code 1" error when trying to run specific tests.
const { pathsToModuleNameMapper } = require("ts-jest");
const tsConfig = require("./tsconfig.paths.json");

module.exports = {
  preset: "ts-jest",
  verbose: true,
  maxConcurrency: 10,
  testTimeout: 2000000,
  testRegex: ".test.ts$",
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: "<rootDir>/" })
};