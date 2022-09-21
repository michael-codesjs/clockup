
import * as zod from "zod";
import { GetImageUploadURLQueryVariables, UpdateUserInput } from "../types/api";

type Properties<T> = Required<{
  [K in keyof T]: zod.ZodType<T[K], any, T[K]>;
}>;

export const updateUserInputValidator:zod.ZodObject<Properties<UpdateUserInput>> = zod.object({
	name: zod.string().min(1, { message: "A name is required" }),
	email: zod.string().min(1, { message: "Email is required" })
});

export const getImageUploadURLInputValidator:zod.ZodObject<Properties<GetImageUploadURLQueryVariables>> = zod.object({
	extension: zod.string().min(2, { message: "Enter a valid extension length" }),
	contentType: zod.string().min(1, { message: "Enter a valid contextType" })
});