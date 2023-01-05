export enum Inputs {
  CREATE = "CREATE",
  DELETE = "DELETE"
}

export type Create = {
  time: Date,
  type: Inputs.CREATE,
  payload: {
    id: string,
    name: string,
    email: string,
    created?: string,
    creatorType: string,
    creator: string,
  }
}

export type Delete = {
  time: Date,
  type: Inputs.DELETE,
  payload: {
    id: string,
    creator: string
  }
}