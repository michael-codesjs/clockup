import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/authentication";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { OperationResponse } from "../../../../shared/typescript/types/api";
import { stepFunctions } from "../../../../shared/typescript/lib/step-functions";

/** handler for the 'handleDeleteCognitoUserTaskToken' lambda function. */
const handler: CommonIOHandler<OperationResponse, void> = withCommonInput(async input => {

  const payload = JSON.parse(input.message) as Delete & { taskToken: string };

  if (input.success) {
    await stepFunctions()
      .sendTaskSuccess({ taskToken: payload.taskToken, output: input.message })
      .promise();
  } else {
    await stepFunctions()
      .sendTaskFailure({ taskToken: payload.taskToken })
      .promise();
  }

});

/** 'handleDeleteCognitoUserTaskToken' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);