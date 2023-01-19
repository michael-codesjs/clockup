export enum Inputs {
  ASYNC_OPERATION_RESULT = "ASYNC_OPERATION_RESULT",
  NOTIFICATION = "NOTIFICATION"
}

export type ASYNC_OPERATION_RESULT = {
  success: boolean,
  cid: string,
  title: string,
  message?: string
}