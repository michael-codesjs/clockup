import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { User } from "../../../framework/entities";

export const handler:AppSyncResolverHandler<null,any> = async (event) => {

  const identity = event.identity as AppSyncIdentityCognito;

  const result = await User.new({ id: identity.sub }).unsync();
  console.log(result);

  return result;

}