export enum Inputs {
  DELETE = "DELETE"
}

export type Delete = {
  time: Date,
  type: Inputs.DELETE,
  payload: {
    id: string,
  }
}