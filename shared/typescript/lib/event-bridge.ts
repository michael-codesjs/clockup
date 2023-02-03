import { EventBridge } from "aws-sdk";
import { configureEnviromentVariables } from "../utilities/functions";

const { REGION } = configureEnviromentVariables();

export const eventBridgeClient = () => new EventBridge({ region: REGION  });