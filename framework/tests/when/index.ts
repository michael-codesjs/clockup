import { configureEnviromentVariables } from "../../../utilities/functions";
import { API } from "./api"
import { Auth } from "./auth";
import { Database } from "./database";

configureEnviromentVariables();

export abstract class When {
  
  static readonly api = API;
  static readonly database = Database;
  static readonly auth = Auth;

}