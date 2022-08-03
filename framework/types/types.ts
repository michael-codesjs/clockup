


export type User = {
  name: string,
  email: string,
  username: string,
  password: string
}

export type AuthedUser = User & {
  auth: {
    idToken: string | undefined,
    accessToken: string | undefined
  }
}

export type Entities = User;