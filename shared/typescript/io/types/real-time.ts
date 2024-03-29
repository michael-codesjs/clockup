import { CommonInput } from "./main"

export enum Inputs {
  ASYNC_OPERATION_RESULT = "ASYNC_OPERATION_RESULT",
  NOTIFICATION = "NOTIFICATION"
}

export type ASYNC_OPERATION_RESULT = CommonInput<Inputs.ASYNC_OPERATION_RESULT, {
  success: boolean,
  correlationId: string,
  title: string,
  message?: string
}>;