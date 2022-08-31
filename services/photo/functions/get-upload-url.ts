import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { v4 } from "uuid";
import { GetImageUploadURLQueryVariables } from "../../../types/api";
import { getImageUploadURLInputValidator } from "../../../utilities/validators";

export const handler = async (event:AppSyncResolverEvent<GetImageUploadURLQueryVariables,any>) => {

  const { extension, contentType } = getImageUploadURLInputValidator.parse(event.arguments);

  const id = v4();
  const identity = event.identity as AppSyncIdentityCognito;
  let key = identity.username+"/"+id;

  if(extension?.startsWith(".")) {
    
  }

}