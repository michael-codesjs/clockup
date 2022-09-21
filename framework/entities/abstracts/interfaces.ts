
export interface IEntity {
  attributes(): {
    id: string,
    created: string
  }
}

export interface IUser extends IEntity {
  attributes(): {
    id: string,
    created: string,
    name: string,
    email: string
  }
}