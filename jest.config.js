
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