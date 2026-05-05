import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: unknown; output: unknown; }
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  companyId: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type Company = {
  __typename: 'Company';
  domain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ImapCredential = {
  __typename: 'ImapCredential';
  email_address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imap_host: Scalars['String']['output'];
  imap_port: Scalars['Int']['output'];
  user_id: Scalars['String']['output'];
};

export type InitPageCompany = {
  __typename: 'InitPageCompany';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type InitPageData = {
  __typename: 'InitPageData';
  company: InitPageCompany;
  users: Array<InitUser>;
};

export type InitPageIntegrationData = {
  __typename: 'InitPageIntegrationData';
  customers?: Maybe<Scalars['JSON']['output']>;
  emails?: Maybe<Scalars['JSON']['output']>;
};

export type InitUser = {
  __typename: 'InitUser';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createCompany?: Maybe<Company>;
  createCompanyAdmin: Scalars['String']['output'];
  login: AuthPayload;
  onboardCompany: OnboardResult;
  addImapCredentials: ImapCredential;
};



export type MutationCreateCompanyArgs = {
  domain: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateCompanyAdminArgs = {
  company: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  companyDomain: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationOnboardCompanyArgs = {
  domain: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type OnboardResult = {
  __typename: 'OnboardResult';
  companyId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  getAllCompanies?: Maybe<Array<Maybe<Company>>>;
  getCompanyById?: Maybe<Company>;
  getCompanyByName?: Maybe<Company>;
  getFortnoxData?: Maybe<Scalars['JSON']['output']>;
  getImapCredentials?: Maybe<Array<Maybe<ImapCredential>>>;
  getInitPageData: InitPageData;
  getInitPageIntegrationData: InitPageIntegrationData;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getUsersByCompanyId?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetCompanyByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCompanyByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetFortnoxDataArgs = {
  companyId: Scalars['String']['input'];
  endpoint?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetImapCredentialsArgs = {
  company: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  company: Scalars['String']['input'];
};


export type QueryGetUsersByCompanyIdArgs = {
  companyId: Scalars['String']['input'];
};

export type User = {
  __typename: 'User';
  created_at?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  companyDomain: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { __typename: 'AuthPayload', token: string, id: string, email: string, role: string, companyId: string } };

export type CreateCompanyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  domain: Scalars['String']['input'];
}>;


export type CreateCompanyMutation = { createCompany?: { __typename: 'Company', id: string, name: string, domain: string } | null };

export type OnboardCompanyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  domain: Scalars['String']['input'];
}>;


export type OnboardCompanyMutation = { onboardCompany: { __typename: 'OnboardResult', companyId: string, message: string } };

export type CreateCompanyAdminMutationVariables = Exact<{
  company: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateCompanyAdminMutation = { createCompanyAdmin: string };

export type GetAllCompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCompaniesQuery = { getAllCompanies?: Array<{ __typename: 'Company', id: string, name: string, domain: string } | null> | null };

export type GetCompanyByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCompanyByIdQuery = { getCompanyById?: { __typename: 'Company', id: string, name: string, domain: string } | null };

export type GetCompanyByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GetCompanyByNameQuery = { getCompanyByName?: { __typename: 'Company', id: string, name: string, domain: string } | null };

export type GetUsersQueryVariables = Exact<{
  company: Scalars['String']['input'];
}>;


export type GetUsersQuery = { getUsers?: Array<{ __typename: 'User', id: string, email: string, role: string, created_at?: string | null } | null> | null };

export type GetUsersByCompanyIdQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetUsersByCompanyIdQuery = { getUsersByCompanyId?: Array<{ __typename: 'User', id: string, email: string, role: string, created_at?: string | null } | null> | null };

export type GetImapCredentialsQueryVariables = Exact<{
  company: Scalars['String']['input'];
}>;


export type GetImapCredentialsQuery = { getImapCredentials?: Array<{ __typename: 'ImapCredential', id: string, user_id: string, imap_host: string, imap_port: number, email_address: string } | null> | null };

export type GetInitPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitPageDataQuery = { getInitPageData: { __typename: 'InitPageData', company: { __typename: 'InitPageCompany', id: string, name: string }, users: Array<{ __typename: 'InitUser', id: string, email: string, role: string }> } };

export type GetInitPageIntegrationDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInitPageIntegrationDataQuery = { getInitPageIntegrationData: { __typename: 'InitPageIntegrationData', customers?: unknown | null, emails?: unknown | null } };

export type GetFortnoxDataQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
  endpoint?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFortnoxDataQuery = { getFortnoxData?: unknown | null };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"companyDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CreateCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const OnboardCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OnboardCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<OnboardCompanyMutation, OnboardCompanyMutationVariables>;
export const CreateCompanyAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCompanyAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCompanyAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<CreateCompanyAdminMutation, CreateCompanyAdminMutationVariables>;
export const GetAllCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const GetCompanyByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompanyById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCompanyById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetCompanyByIdQuery, GetCompanyByIdQueryVariables>;
export const GetCompanyByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompanyByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCompanyByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetCompanyByNameQuery, GetCompanyByNameQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUsersByCompanyIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByCompanyId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByCompanyId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetUsersByCompanyIdQuery, GetUsersByCompanyIdQueryVariables>;
export const GetImapCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImapCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getImapCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"imap_host"}},{"kind":"Field","name":{"kind":"Name","value":"imap_port"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]}}]} as unknown as DocumentNode<GetImapCredentialsQuery, GetImapCredentialsQueryVariables>;
export const GetInitPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInitPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitPageDataQuery, GetInitPageDataQueryVariables>;
export const GetInitPageIntegrationDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitPageIntegrationData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInitPageIntegrationData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"}},{"kind":"Field","name":{"kind":"Name","value":"emails"}}]}}]}}]} as unknown as DocumentNode<GetInitPageIntegrationDataQuery, GetInitPageIntegrationDataQueryVariables>;
export const GetFortnoxDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFortnoxData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endpoint"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFortnoxData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"endpoint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endpoint"}}}]}]}}]} as unknown as DocumentNode<GetFortnoxDataQuery, GetFortnoxDataQueryVariables>;