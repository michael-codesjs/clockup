
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { User } from "../../../framework/entities";
import { EditUserMutationVariables } from "../../../types/api";

export const handler: AppSyncResolverHandler<EditUserMutationVariables,any> = async (event) => {

  const identity = event.identity as AppSyncIdentityCognito;
  const input = event.arguments.input!;

  const user = await User.new({ id: identity.sub, name: input.name!, email: input.email! }).sync();

  return user.graphqlEntity();

}