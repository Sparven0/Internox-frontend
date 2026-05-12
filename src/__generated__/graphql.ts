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
};

export type Company = {
  __typename: 'Company';
  domain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Customer = {
  __typename: 'Customer';
  domain?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fortnoxCustomerNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EmployeeCustomer = {
  __typename: 'EmployeeCustomer';
  assignedAt: Scalars['String']['output'];
  customerId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type FortnoxAccount = {
  __typename: 'FortnoxAccount';
  accountNumber: Scalars['Int']['output'];
  active: Scalars['Boolean']['output'];
  balanceBroughtForward?: Maybe<Scalars['Float']['output']>;
  balanceCarriedForward?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  vatCode?: Maybe<Scalars['String']['output']>;
};

export type FortnoxFinancialYear = {
  __typename: 'FortnoxFinancialYear';
  accountChartType?: Maybe<Scalars['String']['output']>;
  accountingMethod?: Maybe<Scalars['String']['output']>;
  fortnoxId: Scalars['Int']['output'];
  fromDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  toDate: Scalars['String']['output'];
};

export type FortnoxInvoice = {
  __typename: 'FortnoxInvoice';
  bookedAt?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  customerNumber: Scalars['String']['output'];
  dueDate?: Maybe<Scalars['String']['output']>;
  invoiceDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
  ourReference?: Maybe<Scalars['String']['output']>;
  rows: Array<FortnoxInvoiceRow>;
  status: Scalars['String']['output'];
  syncedAt: Scalars['String']['output'];
  totalExclVat?: Maybe<Scalars['Float']['output']>;
  totalInclVat?: Maybe<Scalars['Float']['output']>;
  vat?: Maybe<Scalars['Float']['output']>;
  yourReference?: Maybe<Scalars['String']['output']>;
};

export type FortnoxInvoiceRow = {
  __typename: 'FortnoxInvoiceRow';
  articleNumber?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  rowNumber: Scalars['Int']['output'];
  total?: Maybe<Scalars['Float']['output']>;
  vatPercent?: Maybe<Scalars['Float']['output']>;
};

export type FortnoxVoucher = {
  __typename: 'FortnoxVoucher';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  transactionDate: Scalars['String']['output'];
  voucherNumber: Scalars['Int']['output'];
  voucherSeries: Scalars['String']['output'];
};

export type FortnoxVoucherDetail = {
  __typename: 'FortnoxVoucherDetail';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  rows: Array<FortnoxVoucherRow>;
  transactionDate: Scalars['String']['output'];
  voucherNumber: Scalars['Int']['output'];
  voucherSeries: Scalars['String']['output'];
};

export type FortnoxVoucherRow = {
  __typename: 'FortnoxVoucherRow';
  accountNumber: Scalars['Int']['output'];
  credit?: Maybe<Scalars['Float']['output']>;
  debit?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
};

export type ImapCredential = {
  __typename: 'ImapCredential';
  email_address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imap_host: Scalars['String']['output'];
  imap_port: Scalars['Int']['output'];
  user_id: Scalars['String']['output'];
};

export type ImapCredentialResult = {
  __typename: 'ImapCredentialResult';
  id: Scalars['ID']['output'];
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

export type InvoiceRecipientAlias = {
  __typename: 'InvoiceRecipientAlias';
  alias: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  customer: Customer;
  customerId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
};

export type Me = {
  __typename: 'Me';
  companyId?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  dbName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename: 'Mutation';
  addImapCredentials: ImapCredentialResult;
  assignCustomerToEmployee: EmployeeCustomer;
  createAdmin: Scalars['String']['output'];
  createCompany?: Maybe<Company>;
  createCompanyAdmin: Scalars['String']['output'];
  createInvoiceRecipientAlias: InvoiceRecipientAlias;
  createUser: Scalars['String']['output'];
  deleteInvoiceRecipientAlias: Scalars['Boolean']['output'];
  login: AuthPayload;
  loginSuperAdmin: SuperAdminAuthPayload;
  logout: Scalars['String']['output'];
  onboardCompany: OnboardResult;
  removeCompany: Scalars['String']['output'];
  saveFortnoxTokens: Scalars['String']['output'];
  syncFortnox: Scalars['String']['output'];
  unassignCustomerFromEmployee: Scalars['String']['output'];
};


export type MutationAddImapCredentialsArgs = {
  companyDomain: Scalars['String']['input'];
  emailAddress: Scalars['String']['input'];
  imapHost: Scalars['String']['input'];
  imapPort?: InputMaybe<Scalars['Int']['input']>;
  password: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationAssignCustomerToEmployeeArgs = {
  customerId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateAdminArgs = {
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
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


export type MutationCreateInvoiceRecipientAliasArgs = {
  alias: Scalars['String']['input'];
  customerId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  companyDomain: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteInvoiceRecipientAliasArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  companyDomain: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginSuperAdminArgs = {
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationOnboardCompanyArgs = {
  domain: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationRemoveCompanyArgs = {
  companyId: Scalars['ID']['input'];
};


export type MutationSaveFortnoxTokensArgs = {
  accessToken: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  service: Scalars['String']['input'];
};


export type MutationUnassignCustomerFromEmployeeArgs = {
  customerId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type OnboardResult = {
  __typename: 'OnboardResult';
  companyId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type OnboardingStatus = {
  __typename: 'OnboardingStatus';
  hasEmployees: Scalars['Boolean']['output'];
  hasFortnox: Scalars['Boolean']['output'];
  isComplete: Scalars['Boolean']['output'];
};

export type Query = {
  __typename: 'Query';
  getAccounts: Array<FortnoxAccount>;
  getAllCompanies?: Maybe<Array<Maybe<Company>>>;
  getAllCustomers: Array<Customer>;
  getCompanyById?: Maybe<Company>;
  getCompanyByName?: Maybe<Company>;
  getCustomersByEmployee: Array<Customer>;
  getEmployeesByCustomer: Array<User>;
  getFinancialYears: Array<FortnoxFinancialYear>;
  getFortnoxAuthUrl: Scalars['String']['output'];
  getFortnoxData?: Maybe<Scalars['JSON']['output']>;
  getImapCredentials?: Maybe<Array<Maybe<ImapCredential>>>;
  getInitPageData: InitPageData;
  getInitPageIntegrationData: InitPageIntegrationData;
  getInvoiceDetail?: Maybe<FortnoxInvoice>;
  getInvoices: Array<FortnoxInvoice>;
  getOnboardingStatus: OnboardingStatus;
  getSentEmails?: Maybe<Array<Maybe<SentEmail>>>;
  getUserActivityTimeline: Array<TimelineEvent>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  getUsersByCompanyId?: Maybe<Array<Maybe<User>>>;
  getVoucherDetail?: Maybe<FortnoxVoucherDetail>;
  getVouchers: Array<FortnoxVoucher>;
  invoiceRecipientAliases: Array<InvoiceRecipientAlias>;
  me?: Maybe<Me>;
};


export type QueryGetAccountsArgs = {
  financialYearId: Scalars['ID']['input'];
};


export type QueryGetCompanyByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCompanyByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetCustomersByEmployeeArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetEmployeesByCustomerArgs = {
  customerId: Scalars['ID']['input'];
};


export type QueryGetFortnoxDataArgs = {
  companyId: Scalars['String']['input'];
  endpoint?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetImapCredentialsArgs = {
  company: Scalars['String']['input'];
};


export type QueryGetInvoiceDetailArgs = {
  invoiceNumber: Scalars['String']['input'];
};


export type QueryGetInvoicesArgs = {
  customerNumber?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSentEmailsArgs = {
  companyId: Scalars['String']['input'];
  credentialId: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserActivityTimelineArgs = {
  fromDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  toDate: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetUsersArgs = {
  company: Scalars['String']['input'];
};


export type QueryGetUsersByCompanyIdArgs = {
  companyId: Scalars['String']['input'];
};


export type QueryGetVoucherDetailArgs = {
  voucherId: Scalars['ID']['input'];
};


export type QueryGetVouchersArgs = {
  financialYearId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type SentEmail = {
  __typename: 'SentEmail';
  date?: Maybe<Scalars['String']['output']>;
  from?: Maybe<Scalars['String']['output']>;
  html?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
  uid: Scalars['Int']['output'];
};

export type SuperAdminAuthPayload = {
  __typename: 'SuperAdminAuthPayload';
  role: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type TimelineEmailActivity = {
  __typename: 'TimelineEmailActivity';
  id: Scalars['ID']['output'];
  messageId?: Maybe<Scalars['String']['output']>;
  recipientEmail: Scalars['String']['output'];
  subject?: Maybe<Scalars['String']['output']>;
};

export type TimelineEvent = {
  __typename: 'TimelineEvent';
  emailActivity?: Maybe<TimelineEmailActivity>;
  fortnoxVoucher?: Maybe<TimelineFortnoxVoucherBrief>;
  kind: TimelineEventKind;
  mailSent?: Maybe<TimelineMailSent>;
  occurredAt: Scalars['String']['output'];
};

export enum TimelineEventKind {
  EmailActivity = 'EMAIL_ACTIVITY',
  FortnoxVoucher = 'FORTNOX_VOUCHER',
  Mail = 'MAIL'
}

export type TimelineFortnoxVoucherBrief = {
  __typename: 'TimelineFortnoxVoucherBrief';
  description?: Maybe<Scalars['String']['output']>;
  financialYearId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  transactionDate: Scalars['String']['output'];
  voucherNumber: Scalars['Int']['output'];
  voucherSeries: Scalars['String']['output'];
};

export type TimelineMailSent = {
  __typename: 'TimelineMailSent';
  fromAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  messageId: Scalars['String']['output'];
  subject?: Maybe<Scalars['String']['output']>;
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


export type LoginMutation = { login: { __typename: 'AuthPayload', id: string, email: string, role: string, companyId: string } };

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

export type CreateUserMutationVariables = Exact<{
  companyDomain: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateUserMutation = { createUser: string };

export type AddImapCredentialsMutationVariables = Exact<{
  companyDomain: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
  emailAddress: Scalars['String']['input'];
  imapHost: Scalars['String']['input'];
  imapPort?: InputMaybe<Scalars['Int']['input']>;
  password: Scalars['String']['input'];
}>;


export type AddImapCredentialsMutation = { addImapCredentials: { __typename: 'ImapCredentialResult', id: string } };

export type LoginSuperAdminMutationVariables = Exact<{
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginSuperAdminMutation = { loginSuperAdmin: { __typename: 'SuperAdminAuthPayload', userName: string, role: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: string };

export type CreateAdminMutationVariables = Exact<{
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateAdminMutation = { createAdmin: string };

export type RemoveCompanyMutationVariables = Exact<{
  companyId: Scalars['ID']['input'];
}>;


export type RemoveCompanyMutation = { removeCompany: string };

export type SaveFortnoxTokensMutationVariables = Exact<{
  companyName: Scalars['String']['input'];
  service: Scalars['String']['input'];
  accessToken: Scalars['String']['input'];
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['String']['input']>;
}>;


export type SaveFortnoxTokensMutation = { saveFortnoxTokens: string };

export type AssignCustomerToEmployeeMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  customerId: Scalars['ID']['input'];
}>;


export type AssignCustomerToEmployeeMutation = { assignCustomerToEmployee: { __typename: 'EmployeeCustomer', userId: string, customerId: string, assignedAt: string } };

export type UnassignCustomerFromEmployeeMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  customerId: Scalars['ID']['input'];
}>;


export type UnassignCustomerFromEmployeeMutation = { unassignCustomerFromEmployee: string };

export type CreateInvoiceRecipientAliasMutationVariables = Exact<{
  alias: Scalars['String']['input'];
  customerId: Scalars['ID']['input'];
}>;


export type CreateInvoiceRecipientAliasMutation = { createInvoiceRecipientAlias: { __typename: 'InvoiceRecipientAlias', id: string, alias: string, customerId: string, createdAt: string, customer: { __typename: 'Customer', id: string, name: string, email?: string | null } } };

export type DeleteInvoiceRecipientAliasMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInvoiceRecipientAliasMutation = { deleteInvoiceRecipientAlias: boolean };

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

export type GetSentEmailsQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
  credentialId: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSentEmailsQuery = { getSentEmails?: Array<{ __typename: 'SentEmail', uid: number, subject?: string | null, from?: string | null, to?: string | null, date?: string | null, text?: string | null, html?: string | null } | null> | null };

export type GetOnboardingStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOnboardingStatusQuery = { getOnboardingStatus: { __typename: 'OnboardingStatus', hasFortnox: boolean, hasEmployees: boolean, isComplete: boolean } };

export type GetFinancialYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFinancialYearsQuery = { getFinancialYears: Array<{ __typename: 'FortnoxFinancialYear', id: string, fortnoxId: number, fromDate: string, toDate: string, accountChartType?: string | null, accountingMethod?: string | null }> };

export type GetAccountsQueryVariables = Exact<{
  financialYearId: Scalars['ID']['input'];
}>;


export type GetAccountsQuery = { getAccounts: Array<{ __typename: 'FortnoxAccount', accountNumber: number, description?: string | null, active: boolean, balanceBroughtForward?: number | null, balanceCarriedForward?: number | null, vatCode?: string | null }> };

export type GetVouchersQueryVariables = Exact<{
  financialYearId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetVouchersQuery = { getVouchers: Array<{ __typename: 'FortnoxVoucher', id: string, voucherSeries: string, voucherNumber: number, transactionDate: string, description?: string | null, referenceType?: string | null, referenceNumber?: string | null }> };

export type GetVoucherDetailQueryVariables = Exact<{
  voucherId: Scalars['ID']['input'];
}>;


export type GetVoucherDetailQuery = { getVoucherDetail?: { __typename: 'FortnoxVoucherDetail', id: string, voucherSeries: string, voucherNumber: number, transactionDate: string, description?: string | null, referenceType?: string | null, referenceNumber?: string | null, rows: Array<{ __typename: 'FortnoxVoucherRow', accountNumber: number, debit?: number | null, credit?: number | null, description?: string | null }> } | null };

export type GetEmployeesByCustomerQueryVariables = Exact<{
  customerId: Scalars['ID']['input'];
}>;


export type GetEmployeesByCustomerQuery = { getEmployeesByCustomer: Array<{ __typename: 'User', id: string, email: string, role: string }> };

export type GetAllCustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCustomersQuery = { getAllCustomers: Array<{ __typename: 'Customer', id: string, name: string, email?: string | null, fortnoxCustomerNumber?: string | null }> };

export type GetCustomersByEmployeeQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetCustomersByEmployeeQuery = { getCustomersByEmployee: Array<{ __typename: 'Customer', id: string, name: string, email?: string | null, fortnoxCustomerNumber?: string | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: { __typename: 'Me', id: string, role: string, email?: string | null, userName?: string | null, companyId?: string | null, companyName?: string | null } | null };

export type GetInvoicesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  customerNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetInvoicesQuery = { getInvoices: Array<{ __typename: 'FortnoxInvoice', invoiceNumber: string, customerNumber: string, invoiceDate: string, dueDate?: string | null, totalExclVat?: number | null, totalInclVat?: number | null, vat?: number | null, currency: string, status: string, ourReference?: string | null, yourReference?: string | null, syncedAt: string, bookedAt?: string | null, rows: Array<{ __typename: 'FortnoxInvoiceRow', rowNumber: number, articleNumber?: string | null, description?: string | null, quantity?: number | null, price?: number | null, vatPercent?: number | null, total?: number | null }> }> };

export type GetInvoiceDetailQueryVariables = Exact<{
  invoiceNumber: Scalars['String']['input'];
}>;


export type GetInvoiceDetailQuery = { getInvoiceDetail?: { __typename: 'FortnoxInvoice', invoiceNumber: string, customerNumber: string, invoiceDate: string, dueDate?: string | null, totalExclVat?: number | null, totalInclVat?: number | null, vat?: number | null, currency: string, status: string, ourReference?: string | null, yourReference?: string | null, syncedAt: string, bookedAt?: string | null, rows: Array<{ __typename: 'FortnoxInvoiceRow', rowNumber: number, articleNumber?: string | null, description?: string | null, quantity?: number | null, price?: number | null, vatPercent?: number | null, total?: number | null }> } | null };

export type GetFortnoxAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFortnoxAuthUrlQuery = { getFortnoxAuthUrl: string };

export type GetInvoiceRecipientAliasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvoiceRecipientAliasesQuery = { invoiceRecipientAliases: Array<{ __typename: 'InvoiceRecipientAlias', id: string, alias: string, customerId: string, createdAt: string, customer: { __typename: 'Customer', id: string, name: string, email?: string | null } }> };

export type GetUserActivityTimelineQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  fromDate: Scalars['String']['input'];
  toDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUserActivityTimelineQuery = { getUserActivityTimeline: Array<{ __typename: 'TimelineEvent', kind: TimelineEventKind, occurredAt: string, mailSent?: { __typename: 'TimelineMailSent', id: string, subject?: string | null, messageId: string, fromAddress: string } | null, emailActivity?: { __typename: 'TimelineEmailActivity', id: string, subject?: string | null, recipientEmail: string, messageId?: string | null } | null, fortnoxVoucher?: { __typename: 'TimelineFortnoxVoucherBrief', id: string, voucherSeries: string, voucherNumber: number, transactionDate: string, description?: string | null, financialYearId: string } | null }> };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"companyDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CreateCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<CreateCompanyMutation, CreateCompanyMutationVariables>;
export const OnboardCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OnboardCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<OnboardCompanyMutation, OnboardCompanyMutationVariables>;
export const CreateCompanyAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCompanyAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCompanyAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<CreateCompanyAdminMutation, CreateCompanyAdminMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const AddImapCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddImapCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imapHost"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imapPort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addImapCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyDomain"}}},{"kind":"Argument","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"imapHost"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imapHost"}}},{"kind":"Argument","name":{"kind":"Name","value":"imapPort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imapPort"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddImapCredentialsMutation, AddImapCredentialsMutationVariables>;
export const LoginSuperAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginSuperAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginSuperAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<LoginSuperAdminMutation, LoginSuperAdminMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const CreateAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<CreateAdminMutation, CreateAdminMutationVariables>;
export const RemoveCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}]}]}}]} as unknown as DocumentNode<RemoveCompanyMutation, RemoveCompanyMutationVariables>;
export const SaveFortnoxTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveFortnoxTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"service"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expiresAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveFortnoxTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyName"}}},{"kind":"Argument","name":{"kind":"Name","value":"service"},"value":{"kind":"Variable","name":{"kind":"Name","value":"service"}}},{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"expiresAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expiresAt"}}}]}]}}]} as unknown as DocumentNode<SaveFortnoxTokensMutation, SaveFortnoxTokensMutationVariables>;
export const AssignCustomerToEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignCustomerToEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignCustomerToEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}}]}}]}}]} as unknown as DocumentNode<AssignCustomerToEmployeeMutation, AssignCustomerToEmployeeMutationVariables>;
export const UnassignCustomerFromEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnassignCustomerFromEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unassignCustomerFromEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}]}]}}]} as unknown as DocumentNode<UnassignCustomerFromEmployeeMutation, UnassignCustomerFromEmployeeMutationVariables>;
export const CreateInvoiceRecipientAliasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvoiceRecipientAlias"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"alias"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvoiceRecipientAlias"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"alias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"alias"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateInvoiceRecipientAliasMutation, CreateInvoiceRecipientAliasMutationVariables>;
export const DeleteInvoiceRecipientAliasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvoiceRecipientAlias"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInvoiceRecipientAlias"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteInvoiceRecipientAliasMutation, DeleteInvoiceRecipientAliasMutationVariables>;
export const GetAllCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetAllCompaniesQuery, GetAllCompaniesQueryVariables>;
export const GetCompanyByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompanyById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCompanyById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetCompanyByIdQuery, GetCompanyByIdQueryVariables>;
export const GetCompanyByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCompanyByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCompanyByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetCompanyByNameQuery, GetCompanyByNameQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUsersByCompanyIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByCompanyId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByCompanyId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetUsersByCompanyIdQuery, GetUsersByCompanyIdQueryVariables>;
export const GetImapCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImapCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getImapCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}},{"kind":"Field","name":{"kind":"Name","value":"imap_host"}},{"kind":"Field","name":{"kind":"Name","value":"imap_port"}},{"kind":"Field","name":{"kind":"Name","value":"email_address"}}]}}]}}]} as unknown as DocumentNode<GetImapCredentialsQuery, GetImapCredentialsQueryVariables>;
export const GetInitPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInitPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<GetInitPageDataQuery, GetInitPageDataQueryVariables>;
export const GetInitPageIntegrationDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInitPageIntegrationData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInitPageIntegrationData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"}},{"kind":"Field","name":{"kind":"Name","value":"emails"}}]}}]}}]} as unknown as DocumentNode<GetInitPageIntegrationDataQuery, GetInitPageIntegrationDataQueryVariables>;
export const GetFortnoxDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFortnoxData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endpoint"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFortnoxData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"endpoint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endpoint"}}}]}]}}]} as unknown as DocumentNode<GetFortnoxDataQuery, GetFortnoxDataQueryVariables>;
export const GetSentEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSentEmails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentialId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSentEmails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"credentialId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentialId"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"html"}}]}}]}}]} as unknown as DocumentNode<GetSentEmailsQuery, GetSentEmailsQueryVariables>;
export const GetOnboardingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOnboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOnboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFortnox"}},{"kind":"Field","name":{"kind":"Name","value":"hasEmployees"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}}]}}]}}]} as unknown as DocumentNode<GetOnboardingStatusQuery, GetOnboardingStatusQueryVariables>;
export const GetFinancialYearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFinancialYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFinancialYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fortnoxId"}},{"kind":"Field","name":{"kind":"Name","value":"fromDate"}},{"kind":"Field","name":{"kind":"Name","value":"toDate"}},{"kind":"Field","name":{"kind":"Name","value":"accountChartType"}},{"kind":"Field","name":{"kind":"Name","value":"accountingMethod"}}]}}]}}]} as unknown as DocumentNode<GetFinancialYearsQuery, GetFinancialYearsQueryVariables>;
export const GetAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"financialYearId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"financialYearId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"financialYearId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"balanceBroughtForward"}},{"kind":"Field","name":{"kind":"Name","value":"balanceCarriedForward"}},{"kind":"Field","name":{"kind":"Name","value":"vatCode"}}]}}]}}]} as unknown as DocumentNode<GetAccountsQuery, GetAccountsQueryVariables>;
export const GetVouchersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVouchers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"financialYearId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVouchers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"financialYearId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"financialYearId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"voucherSeries"}},{"kind":"Field","name":{"kind":"Name","value":"voucherNumber"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"referenceType"}},{"kind":"Field","name":{"kind":"Name","value":"referenceNumber"}}]}}]}}]} as unknown as DocumentNode<GetVouchersQuery, GetVouchersQueryVariables>;
export const GetVoucherDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVoucherDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voucherId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVoucherDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"voucherId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voucherId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"voucherSeries"}},{"kind":"Field","name":{"kind":"Name","value":"voucherNumber"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"referenceType"}},{"kind":"Field","name":{"kind":"Name","value":"referenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"debit"}},{"kind":"Field","name":{"kind":"Name","value":"credit"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetVoucherDetailQuery, GetVoucherDetailQueryVariables>;
export const GetEmployeesByCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployeesByCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEmployeesByCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetEmployeesByCustomerQuery, GetEmployeesByCustomerQueryVariables>;
export const GetAllCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fortnoxCustomerNumber"}}]}}]}}]} as unknown as DocumentNode<GetAllCustomersQuery, GetAllCustomersQueryVariables>;
export const GetCustomersByEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomersByEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCustomersByEmployee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fortnoxCustomerNumber"}}]}}]}}]} as unknown as DocumentNode<GetCustomersByEmployeeQuery, GetCustomersByEmployeeQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"companyName"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerNumber"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDate"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalExclVat"}},{"kind":"Field","name":{"kind":"Name","value":"totalInclVat"}},{"kind":"Field","name":{"kind":"Name","value":"vat"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ourReference"}},{"kind":"Field","name":{"kind":"Name","value":"yourReference"}},{"kind":"Field","name":{"kind":"Name","value":"syncedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowNumber"}},{"kind":"Field","name":{"kind":"Name","value":"articleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"vatPercent"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetInvoicesQuery, GetInvoicesQueryVariables>;
export const GetInvoiceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoiceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getInvoiceDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invoiceNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"customerNumber"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDate"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"totalExclVat"}},{"kind":"Field","name":{"kind":"Name","value":"totalInclVat"}},{"kind":"Field","name":{"kind":"Name","value":"vat"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ourReference"}},{"kind":"Field","name":{"kind":"Name","value":"yourReference"}},{"kind":"Field","name":{"kind":"Name","value":"syncedAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowNumber"}},{"kind":"Field","name":{"kind":"Name","value":"articleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"vatPercent"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<GetInvoiceDetailQuery, GetInvoiceDetailQueryVariables>;
export const GetFortnoxAuthUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFortnoxAuthUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFortnoxAuthUrl"}}]}}]} as unknown as DocumentNode<GetFortnoxAuthUrlQuery, GetFortnoxAuthUrlQueryVariables>;
export const GetInvoiceRecipientAliasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoiceRecipientAliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceRecipientAliases"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetInvoiceRecipientAliasesQuery, GetInvoiceRecipientAliasesQueryVariables>;
export const GetUserActivityTimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserActivityTimeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"toDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserActivityTimeline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fromDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fromDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"toDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"toDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"mailSent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"fromAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emailActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"recipientEmail"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fortnoxVoucher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"voucherSeries"}},{"kind":"Field","name":{"kind":"Name","value":"voucherNumber"}},{"kind":"Field","name":{"kind":"Name","value":"transactionDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"financialYearId"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserActivityTimelineQuery, GetUserActivityTimelineQueryVariables>;