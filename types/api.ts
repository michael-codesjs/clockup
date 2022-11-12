import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  getAlarm?: Maybe<Alarm>;
  getProfile?: Maybe<User>;
};


export type QueryGetAlarmArgs = {
  id: Scalars['ID'];
};

export type Alarm = ICommom & ICreatable & {
  __typename?: 'Alarm';
  created: Scalars['AWSDateTime'];
  creator: Scalars['ID'];
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

export type ICommom = {
  created: Scalars['AWSDateTime'];
  discontinued: Scalars['Boolean'];
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
};

export enum EntityType {
  Alarm = 'ALARM',
  User = 'USER'
}

export type ICreatable = {
  creator: Scalars['ID'];
};

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
  alarms?: Maybe<Scalars['Int']>;
  created: Scalars['AWSDateTime'];
  discontinued: Scalars['Boolean'];
  email: Scalars['AWSEmail'];
  entityType: EntityType;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['AWSDateTime']>;
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<User>;
  upsertAlarm?: Maybe<Alarm>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};


export type MutationUpsertAlarmArgs = {
  input: UpsertAlarmInput;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpsertAlarmInput = {
  days?: InputMaybe<Array<Scalars['Int']>>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
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
  ICommom: ResolversTypes['Alarm'] | ResolversTypes['User'];
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  EntityType: EntityType;
  ICreatable: ResolversTypes['Alarm'];
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AlarmSnoozeSettings: ResolverTypeWrapper<AlarmSnoozeSettings>;
  AlarmRingTime: ResolverTypeWrapper<AlarmRingTime>;
  User: ResolverTypeWrapper<User>;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  Mutation: ResolverTypeWrapper<{}>;
  UpdateUserInput: UpdateUserInput;
  UpsertAlarmInput: UpsertAlarmInput;
  AlarmSnoozeSettingsInput: AlarmSnoozeSettingsInput;
  AlarmRingTimeInput: AlarmRingTimeInput;
  AWSDate: ResolverTypeWrapper<Scalars['AWSDate']>;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTime: ResolverTypeWrapper<Scalars['AWSTime']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars['ID'];
  Alarm: Alarm;
  ICommom: ResolversParentTypes['Alarm'] | ResolversParentTypes['User'];
  AWSDateTime: Scalars['AWSDateTime'];
  Boolean: Scalars['Boolean'];
  ICreatable: ResolversParentTypes['Alarm'];
  Int: Scalars['Int'];
  String: Scalars['String'];
  AlarmSnoozeSettings: AlarmSnoozeSettings;
  AlarmRingTime: AlarmRingTime;
  User: User;
  AWSEmail: Scalars['AWSEmail'];
  Mutation: {};
  UpdateUserInput: UpdateUserInput;
  UpsertAlarmInput: UpsertAlarmInput;
  AlarmSnoozeSettingsInput: AlarmSnoozeSettingsInput;
  AlarmRingTimeInput: AlarmRingTimeInput;
  AWSDate: Scalars['AWSDate'];
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSPhone: Scalars['AWSPhone'];
  AWSTime: Scalars['AWSTime'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAlarm?: Resolver<Maybe<ResolversTypes['Alarm']>, ParentType, ContextType, RequireFields<QueryGetAlarmArgs, 'id'>>;
  getProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type AlarmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Alarm'] = ResolversParentTypes['Alarm']> = {
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type ICommomResolvers<ContextType = any, ParentType extends ResolversParentTypes['ICommom'] = ResolversParentTypes['ICommom']> = {
  __resolveType: TypeResolveFn<'Alarm' | 'User', ParentType, ContextType>;
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  discontinued?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['AWSDateTime']>, ParentType, ContextType>;
};

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export type ICreatableResolvers<ContextType = any, ParentType extends ResolversParentTypes['ICreatable'] = ResolversParentTypes['ICreatable']> = {
  __resolveType: TypeResolveFn<'Alarm', ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

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

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  alarms?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
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
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
  upsertAlarm?: Resolver<Maybe<ResolversTypes['Alarm']>, ParentType, ContextType, RequireFields<MutationUpsertAlarmArgs, 'input'>>;
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

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Alarm?: AlarmResolvers<ContextType>;
  ICommom?: ICommomResolvers<ContextType>;
  AWSDateTime?: GraphQLScalarType;
  ICreatable?: ICreatableResolvers<ContextType>;
  AlarmSnoozeSettings?: AlarmSnoozeSettingsResolvers<ContextType>;
  AlarmRingTime?: AlarmRingTimeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  AWSEmail?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  AWSDate?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
};

