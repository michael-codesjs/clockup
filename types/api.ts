import { z } from 'zod'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: any;
  AWSEmail: any;
  AWSDate: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
};

export type Query = {
  __typename?: 'Query';
  getAlarm?: Maybe<Alarm>;
  getImageUploadURL?: Maybe<Scalars['String']>;
  getProfile?: Maybe<User>;
};


export type QueryGetAlarmArgs = {
  id: Scalars['ID'];
};


export type QueryGetImageUploadUrlArgs = {
  contentType?: InputMaybe<Scalars['String']>;
  extension?: InputMaybe<Scalars['String']>;
};

export type Alarm = ICommom & {
  __typename?: 'Alarm';
  created: Scalars['AWSDateTime'];
  days?: Maybe<Array<Scalars['Int']>>;
  enabled?: Maybe<Scalars['Boolean']>;
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
  name?: Maybe<Scalars['String']>;
  onceOff?: Maybe<Scalars['Boolean']>;
  snooze: AlarmSnoozeSettings;
  time: AlarmRingTime;
};

export type ICommom = {
  created?: Maybe<Scalars['AWSDateTime']>;
  entityType?: Maybe<EntityType>;
  id: Scalars['ID'];
};

export enum EntityType {
  Alarm = 'ALARM',
  User = 'USER'
}

export type AlarmSnoozeSettings = {
  __typename?: 'AlarmSnoozeSettings';
  duration: Scalars['Int'];
  interval: Scalars['Int'];
};

export type AlarmRingTime = {
  __typename?: 'AlarmRingTime';
  hour: Scalars['Int'];
  minute: Scalars['Int'];
};

export type User = ICommom & {
  __typename?: 'User';
  created: Scalars['AWSDateTime'];
  email: Scalars['AWSEmail'];
  entityType: EntityType;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<User>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  name?: InputMaybe<Scalars['String']>;
};


type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export const EntityTypeSchema = z.nativeEnum(EntityType);

export function UpdateUserInputSchema(): z.ZodObject<Properties<UpdateUserInput>> {
  return z.object({
    email: definedNonNullAnySchema.nullish(),
    name: z.string().nullish()
  })
}
