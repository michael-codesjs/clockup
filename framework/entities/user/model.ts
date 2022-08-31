
import { AWSError } from "aws-sdk";
import type { DeleteItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { cognitoProvider } from "../../../lib/cognito";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { Model, NullModel } from "../entity/model";
import { Users } from "../user/user";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

export class UserModel extends Model {

  readonly entity: Users.User;

  constructor(user: Users.User) {
    super(user);
  }

  mutate(): Promise<UpdateItemOutput> {

    return new Promise((res, rej) => { // can't use async/await because adminUpdateUserAttributes does not return a promise but instead requires us to supply a callback function

      super.mutate() // update record in the table
      .then(recordUpdateResult => { 

        /* update user attributes in the cognito user pool */

        const provider = cognitoProvider();

        const adminUpdateParams = {
          UserPoolId: COGNITO_USER_POOL_ID!,
          Username: this.entity.id,
          UserAttributes: Object.entries(this.entity.mutableAttributes()).map(([key, value]) => {
            return {
              Name: key,
              Value: value
            }
          })
        };

        const adminUpdateCallback = (error:AWSError) => {
          if(error) return rej(error)
          res(recordUpdateResult);
        }

        provider.adminUpdateUserAttributes(adminUpdateParams,adminUpdateCallback);

        })
        .catch(rej);


    });

  }


  async delete(): Promise<DeleteItemOutput> {

    return new Promise((res,rej) => { // can't use async/await because adminDeleteUser does not return a promise but instead requires us to supply a callback function


      super.delete() // delete record from the database
      .then((recordDeleteResult) => { // delete user from cognito user pool

        const provider = cognitoProvider();

        const adminDeleteParams = {
          Username: this.entity.id,
          UserPoolId: COGNITO_USER_POOL_ID!
        };
  
        const adminDeleteCallback = (error:AWSError) => {
          if(error) return rej(error)
          res(recordDeleteResult);
        }
  
        provider.adminDeleteUser(adminDeleteParams, adminDeleteCallback);

      })
      .catch(rej)

    });
  }

}

export class NullUserModel extends NullModel { }