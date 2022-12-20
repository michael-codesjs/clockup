
export enum UserMessages {
  CREATE = "CREATE"
}

export type UserCreateMessage = {
  time: Date,
  payload: {
    id: string,
    email: string,
    name: string
  }
}