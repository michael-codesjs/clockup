import Entities from "../../entities";


export module Database {

  export async function getCustomer(id:string) {
    const user = await Entities.user({ id }).sync();
    return user.graphqlEntity();
  }

}