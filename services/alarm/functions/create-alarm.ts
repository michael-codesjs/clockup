import { ArgumentsWithCreator, userInstanciator } from "@middleware/user-instanciator";
import { AppSyncResolverHandler } from "aws-lambda";
import { AlarmResponse, MutationCreateAlarmArgs, CreateAlarmInputSchema } from "@local-types/api";
import Entities from "@entities";
import { AlarmConstructorParams } from "framework/entities/types/constructor-params";
import { withResolverStandard } from "@hofs/with-resolver-standard";
import { yupInputValidator } from "@middleware/yup-input-validator";

const main: AppSyncResolverHandler<ArgumentsWithCreator<MutationCreateAlarmArgs>, AlarmResponse> = async event => {

  const { user, input } = event.arguments;

  const alarm = Entities.Alarm({ ...input as AlarmConstructorParams, creator: user });

  await alarm.put(); // insert alarm record into table

  return alarm.graphQlEntity();

};

export const handler = (
  withResolverStandard(main)
  .use(yupInputValidator(CreateAlarmInputSchema))
  .use(userInstanciator())
);