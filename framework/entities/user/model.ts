import type { DeleteItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import type { AbsoluteUserAttributes } from "../types";
import { cognitoProvider } from "../../../lib/cognito";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { Model, NullModel } from "../entity/model";
import UserFactory from "./user";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

type AbsoluteUserVariant = ReturnType<typeof UserFactory.createEntity<AbsoluteUserAttributes>>;

export class UserModel extends Model {

  readonly entity: AbsoluteUserVariant;

  constructor(user: AbsoluteUserVariant) {
    super(user);
  }

  async mutate(): Promise<UpdateItemOutput> {

    const recordUpdateResult = await super.mutate();

    const cognitoAdminUpdateParams = {
      UserPoolId: COGNITO_USER_POOL_ID!,
      Username: this.entity.id,
      UserAttributes: Object.entries(this.entity.mutableAttributes()).map(([key, value]) => {
        return {
          Name: key,
          Value: value as string
        }
      })
    };

    await cognitoProvider()
      .adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
      .promise();

    return recordUpdateResult;

  }


  async delete(): Promise<DeleteItemOutput> {

    const recordDeleteResult = await super.delete(); // delete record from the database

    const cognitoDeleteParams = {
      Username: this.entity.id,
      UserPoolId: COGNITO_USER_POOL_ID!
    };

    await cognitoProvider()
      .adminDeleteUser(cognitoDeleteParams) // delete user in the cognito user pool
      .promise()

    return recordDeleteResult;

  }

}

export class NullUserModel extends NullModel { }