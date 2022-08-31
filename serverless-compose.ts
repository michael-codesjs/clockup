import { stacks } from "./utilities/constants";
import { AWS } from "./types/aws";
import { generateServicePath } from "./utilities/functions";

const serverlessCompose: AWS.Compose = {

  services: {

    [stacks.root.name]: {
      path: generateServicePath(stacks.root.name),
    },

    [stacks.auth.name]: {
      path: generateServicePath(stacks.auth.name),
      dependsOn: [
        stacks.root.name
      ],
    },

    [stacks.api.name]: {
      path: generateServicePath(stacks.api.name),
      dependsOn: [
        stacks.auth.name
      ]
    },

    [stacks.user.name]: {
      path: generateServicePath(stacks.user.name),
      dependsOn: [
        stacks.api.name
      ]
    },

    ["test"]: {
      path: "services/test",
      dependsOn: [
        stacks.api.name
      ]
    },

  }
}

module.exports = serverlessCompose;