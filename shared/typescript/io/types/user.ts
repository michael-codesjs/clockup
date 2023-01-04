export enum Inputs {
  CREATE = "CREATE"
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