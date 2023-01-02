import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import * as yup from 'yup'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  getAlarm: Alarm;
  getProfile: UserOutput;
};


export type QueryGetAlarmArgs = {
  id: Scalars['ID'];
};

export type Alarm = Common & {
  __typename?: 'Alarm';
  created: Scalars['AWSDateTime'];
  creator: Scalars['ID'];
  creatorType: EntityType;
  days?: Maybe<Array<Scalars['Int']>>;
  discontinued: Scalars['Boolean'];
  enabled?: Maybe<Scalars['Boolean']>;
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
  name?: Maybe<Scalars['String']>;
  onceOff?: Maybe<Scalars['Boolean']>;
  snooze: AlarmSnoozeSettings;
  time: AlarmRingTime;
};

export type Common = {
  created: Scalars['AWSDateTime'];
  creator: Scalars['ID'];
  creatorType: EntityType;
  discontinued: Scalars['Boolean'];
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
};

export enum EntityType {
  Alarm = 'ALARM',
  Note = 'NOTE',
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

export type UserOutput = ErrorResponse | User;

export type ErrorResponse = {
  __typename?: 'ErrorResponse';
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  type: ErrorTypes;
};

export enum ErrorTypes {
  CreateFailed = 'CREATE_FAILED',
  InternalError = 'INTERNAL_ERROR',
  MalfomedInput = 'MALFOMED_INPUT',
  NotFound = 'NOT_FOUND',
  UpdateFailed = 'UPDATE_FAILED'
}

export type User = Common & {
  __typename?: 'User';
  alarms: Scalars['Int'];
  created: Scalars['AWSDateTime'];
  creator: Scalars['ID'];
  creatorType: EntityType;
  discontinued: Scalars['Boolean'];
  email: Scalars['AWSEmail'];
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAlarm: AlarmOutput;
  deleteUser: OperationOutput;
  updateAlarm: AlarmOutput;
  updateUser: UserOutput;
};


export type MutationCreateAlarmArgs = {
  input: CreateAlarmInput;
};


export type MutationUpdateAlarmArgs = {
  input: UpdateAlarmInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type CreateAlarmInput = {
  days?: InputMaybe<Array<Scalars['Int']>>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  onceOff?: InputMaybe<Scalars['Boolean']>;
  snooze: AlarmSnoozeSettingsInput;
  time: AlarmRingTimeInput;
};

export type AlarmSnoozeSettingsInput = {
  duration: Scalars['Int'];
  interval: Scalars['Int'];
};

export type AlarmRingTimeInput = {
  hour: Scalars['Int'];
  minute: Scalars['Int'];
};

export type AlarmOutput = AlarmResponse | ErrorResponse;

export type AlarmResponse = {
  __typename?: 'AlarmResponse';
  alarm: Alarm;
  creator: User;
};

export type OperationOutput = ErrorResponse | OperationResponse;

export type OperationResponse = {
  __typename?: 'OperationResponse';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type UpdateAlarmInput = {
  days?: InputMaybe<Array<Scalars['Int']>>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  onceOff?: InputMaybe<Scalars['Boolean']>;
  snooze?: InputMaybe<AlarmSnoozeSettingsInput>;
  time?: InputMaybe<AlarmRingTimeInput>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Note = Common & {
  __typename?: 'Note';
  body?: Maybe<Scalars['String']>;
  created: Scalars['AWSDateTime'];
  creator: Scalars['ID'];
  creatorType: EntityType;
  discontinued: Scalars['Boolean'];
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
  title?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Alarm: ResolverTypeWrapper<Alarm>;
  Common: ResolversTypes['Alarm'] | ResolversTypes['User'] | ResolversTypes['Note'];
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  EntityType: EntityType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AlarmSnoozeSettings: ResolverTypeWrapper<AlarmSnoozeSettings>;
  AlarmRingTime: ResolverTypeWrapper<AlarmRingTime>;
  UserOutput: ResolversTypes['ErrorResponse'] | ResolversTypes['User'];
  ErrorResponse: ResolverTypeWrapper<ErrorResponse>;
  ErrorTypes: ErrorTypes;
  User: ResolverTypeWrapper<User>;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  Mutation: ResolverTypeWrapper<{}>;
  CreateAlarmInput: CreateAlarmInput;
  AlarmSnoozeSettingsInput: AlarmSnoozeSettingsInput;
  AlarmRingTimeInput: AlarmRingTimeInput;
  AlarmOutput: ResolversTypes['AlarmResponse'] | ResolversTypes['ErrorResponse'];
  AlarmResponse: ResolverTypeWrapper<AlarmResponse>;
  OperationOutput: ResolversTypes['ErrorResponse'] | ResolversTypes['OperationResponse'];
  OperationResponse: ResolverTypeWrapper<OperationResponse>;
  UpdateAlarmInput: UpdateAlarmInput;
  UpdateUserInput: UpdateUserInput;
  AWSDate: ResolverTypeWrapper<Scalars['AWSDate']>;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTime: ResolverTypeWrapper<Scalars['AWSTime']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
  Note: ResolverTypeWrapper<Note>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  Alarm: Alarm;
  Common: ResolversParentTypes['Alarm'] | ResolversParentTypes['User'] | ResolversParentTypes['Note'];
  AWSDateTime: Scalars['AWSDateTime'];
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  String: Scalars['String'];
  AlarmSnoozeSettings: AlarmSnoozeSettings;
  AlarmRingTime: AlarmRingTime;
  UserOutput: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['User'];
  ErrorResponse: ErrorResponse;
  User: User;
  AWSEmail: Scalars['AWSEmail'];
  Mutation: {};
  CreateAlarmInput: CreateAlarmInput;
  AlarmSnoozeSettingsInput: AlarmSnoozeSettingsInput;
  AlarmRingTimeInput: AlarmRingTimeInput;
  AlarmOutput: ResolversParentTypes['AlarmResponse'] | ResolversParentTypes['ErrorResponse'];
  AlarmResponse: AlarmResponse;
  OperationOutput: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['OperationResponse'];
  OperationResponse: OperationResponse;
  UpdateAlarmInput: UpdateAlarmInput;
  UpdateUserInput: UpdateUserInput;
  AWSDate: Scalars['AWSDate'];
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSPhone: Scalars['AWSPhone'];
  AWSTime: Scalars['AWSTime'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
  Note: Note;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAlarm?: Resolver<ResolversTypes['Alarm'], ParentType, ContextType, RequireFields<QueryGetAlarmArgs, 'id'>>;
  getProfile?: Resolver<ResolversTypes['UserOutput'], ParentType, ContextType>;
};

export type AlarmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Alarm'] = ResolversParentTypes['Alarm']> = {
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  creatorType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  days?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>;
  discontinued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  onceOff?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  snooze?: Resolver<ResolversTypes['AlarmSnoozeSettings'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['AlarmRingTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Common'] = ResolversParentTypes['Common']> = {
  __resolveType: TypeResolveFn<'Alarm' | 'User' | 'Note', ParentType, ContextType>;
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  creatorType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  discontinued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
};

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export type AlarmSnoozeSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlarmSnoozeSettings'] = ResolversParentTypes['AlarmSnoozeSettings']> = {
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  interval?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlarmRingTimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlarmRingTime'] = ResolversParentTypes['AlarmRingTime']> = {
  hour?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minute?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserOutput'] = ResolversParentTypes['UserOutput']> = {
  __resolveType: TypeResolveFn<'ErrorResponse' | 'User', ParentType, ContextType>;
};

export type ErrorResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorResponse'] = ResolversParentTypes['ErrorResponse']> = {
  code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ErrorTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  alarms?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  creatorType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  discontinued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['AWSEmail'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface AwsEmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSEmail'], any> {
  name: 'AWSEmail';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAlarm?: Resolver<ResolversTypes['AlarmOutput'], ParentType, ContextType, RequireFields<MutationCreateAlarmArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['OperationOutput'], ParentType, ContextType>;
  updateAlarm?: Resolver<ResolversTypes['AlarmOutput'], ParentType, ContextType, RequireFields<MutationUpdateAlarmArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['UserOutput'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type AlarmOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlarmOutput'] = ResolversParentTypes['AlarmOutput']> = {
  __resolveType: TypeResolveFn<'AlarmResponse' | 'ErrorResponse', ParentType, ContextType>;
};

export type AlarmResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlarmResponse'] = ResolversParentTypes['AlarmResponse']> = {
  alarm?: Resolver<ResolversTypes['Alarm'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OperationOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['OperationOutput'] = ResolversParentTypes['OperationOutput']> = {
  __resolveType: TypeResolveFn<'ErrorResponse' | 'OperationResponse', ParentType, ContextType>;
};

export type OperationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['OperationResponse'] = ResolversParentTypes['OperationResponse']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface AwsDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDate'], any> {
  name: 'AWSDate';
}

export interface AwsipAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSIPAddress'], any> {
  name: 'AWSIPAddress';
}

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export interface AwsPhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSPhone'], any> {
  name: 'AWSPhone';
}

export interface AwsTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTime'], any> {
  name: 'AWSTime';
}

export interface AwsTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTimestamp'], any> {
  name: 'AWSTimestamp';
}

export interface AwsurlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSURL'], any> {
  name: 'AWSURL';
}

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  creatorType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  discontinued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Alarm?: AlarmResolvers<ContextType>;
  Common?: CommonResolvers<ContextType>;
  AWSDateTime?: GraphQLScalarType;
  AlarmSnoozeSettings?: AlarmSnoozeSettingsResolvers<ContextType>;
  AlarmRingTime?: AlarmRingTimeResolvers<ContextType>;
  UserOutput?: UserOutputResolvers<ContextType>;
  ErrorResponse?: ErrorResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  AWSEmail?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  AlarmOutput?: AlarmOutputResolvers<ContextType>;
  AlarmResponse?: AlarmResponseResolvers<ContextType>;
  OperationOutput?: OperationOutputResolvers<ContextType>;
  OperationResponse?: OperationResponseResolvers<ContextType>;
  AWSDate?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
  Note?: NoteResolvers<ContextType>;
};



export const EntityTypeSchema = yup.mixed().oneOf([EntityType.Alarm, EntityType.Note, EntityType.User]);

export const ErrorTypesSchema = yup.mixed().oneOf([ErrorTypes.CreateFailed, ErrorTypes.InternalError, ErrorTypes.MalfomedInput, ErrorTypes.NotFound, ErrorTypes.UpdateFailed]);

export function CreateAlarmInputSchema(): yup.SchemaOf<CreateAlarmInput> {
  return yup.object({
    days: yup.array().of(yup.number().defined()).optional(),
    enabled: yup.boolean(),
    name: yup.string(),
    onceOff: yup.boolean(),
    snooze: yup.lazy(() => AlarmSnoozeSettingsInputSchema().defined()) as never,
    time: yup.lazy(() => AlarmRingTimeInputSchema().defined()) as never
  })
}

export function AlarmSnoozeSettingsInputSchema(): yup.SchemaOf<AlarmSnoozeSettingsInput> {
  return yup.object({
    duration: yup.number().defined(),
    interval: yup.number().defined()
  })
}

export function AlarmRingTimeInputSchema(): yup.SchemaOf<AlarmRingTimeInput> {
  return yup.object({
    hour: yup.number().defined(),
    minute: yup.number().defined()
  })
}

export function UpdateAlarmInputSchema(): yup.SchemaOf<UpdateAlarmInput> {
  return yup.object({
    days: yup.array().of(yup.number().defined()).optional(),
    enabled: yup.boolean(),
    id: yup.string().required(),
    name: yup.string(),
    onceOff: yup.boolean(),
    snooze: yup.lazy(() => AlarmSnoozeSettingsInputSchema()) as never,
    time: yup.lazy(() => AlarmRingTimeInputSchema()) as never
  })
}

export function UpdateUserInputSchema(): yup.SchemaOf<UpdateUserInput> {
  return yup.object({
    email: yup.mixed(),
    name: yup.string()
  })
}
