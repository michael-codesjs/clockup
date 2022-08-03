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
  getProfile?: Maybe<User>;
};


export type QueryGetAlarmArgs = {
  id: Scalars['ID'];
};

export type Alarm = {
  __typename?: 'Alarm';
  created?: Maybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  alarms?: Maybe<Scalars['Int']>;
  created?: Maybe<Scalars['AWSDateTime']>;
  email?: Maybe<Scalars['AWSEmail']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};
