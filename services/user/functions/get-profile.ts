import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { User } from "../../../framework/entities";
import { configureEnviromentVariables } from "../../../utilities/functions";

configureEnviromentVariables();

export const handler = async (event:AppSyncResolverEvent<null,any>) => {

  const identity = event.identity as AppSyncIdentityCognito;

  const user = await User.new({ id: identity.sub }).sync();

  return user instanceof user.AbsoluteTypeOfSelf ? user.graphqlEntity() : {};
  
}