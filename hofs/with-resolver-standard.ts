import { AppSyncResolverHandler } from "aws-lambda";
import middy from "@middy/core"
import { withErrorResponse } from "middleware/with-error-response";

export const withResolverStandard = <A, R>(resolver: AppSyncResolverHandler<A, R>) => {
  return (
    middy(resolver)
      .use(withErrorResponse())
  );
}
