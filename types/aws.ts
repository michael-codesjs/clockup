
import type { AWS as DefaultAWS } from "@serverless/typescript";
import { ChangeTypeOfKeys } from "./utility";

export namespace AWS {

  type RequiredAWS = Required<DefaultAWS>;

  type FnFunctions  = {
    "Fn::Gett": Array<string>
  };

  export type iamRoleStatement = {
    Effect: "Allow" | "Deny",
    Resource: FnFunctions | Array<FnFunctions> | Array<string> | string,
    Action: Array<string>
  }

  export type AwsFunctionsWithIamRoleStatements = {
    [k: string]: RequiredAWS["functions"][string | number] & {
      iamRoleStatements?: Array<iamRoleStatement>
    }
  };

  export type Compose = {
    services: {
      [k:string]: {
        path: string,
        dependsOn?: Array<string>,
      }
    }
  }

  export type Service = ChangeTypeOfKeys<DefaultAWS,"functions", AwsFunctionsWithIamRoleStatements>;


}