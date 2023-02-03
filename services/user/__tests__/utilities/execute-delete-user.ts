import { SSM } from 'aws-sdk';
import { stepFunctions } from "../../../../shared/typescript/lib/step-functions";
import { EntityType } from "../../../../shared/typescript/types/api";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { REGION, STAGE } = configureEnviromentVariables();

type Params = {
  correlationId: string,
  payload: {
    id: string,
    creator: string,
    creatorType: EntityType
  }
}
export const executeDeleteUser = async (params: Params) => {

  const { Parameter } = await new SSM({ region: REGION }) // get DeleteUser state machine arn from ssm.
    .getParameter({ Name: `/clockup/user/${STAGE}/state-machines/delete-user/arn` })
    .promise();

  return await stepFunctions()
    .startExecution({
      stateMachineArn: Parameter.Value,
      input: JSON.stringify(params)
    })
    .promise();
}