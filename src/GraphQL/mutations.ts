import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $companyDomain: String!) {
    login(email: $email, password: $password, companyDomain: $companyDomain) {
      token
      id
      email
      role
      companyId
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($name: String!, $domain: String!) {
    createCompany(name: $name, domain: $domain) {
      id
      name
      domain
    }
  }
`;

export const ONBOARD_COMPANY = gql`
  mutation OnboardCompany($name: String!, $domain: String!) {
    onboardCompany(name: $name, domain: $domain) {
      companyId
      message
    }
  }
`;

export const CREATE_COMPANY_ADMIN = gql`
  mutation CreateCompanyAdmin(
    $company: String!
    $email: String!
    $password: String!
  ) {
    createCompanyAdmin(company: $company, email: $email, password: $password)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $companyDomain: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      companyDomain: $companyDomain
      email: $email
      password: $password
    )
  }
`;

export const ADD_IMAP_CREDENTIALS = gql`
  mutation AddImapCredentials(
    $companyDomain: String!
    $userEmail: String!
    $emailAddress: String!
    $imapHost: String!
    $imapPort: Int
    $password: String!
  ) {
    addImapCredentials(
      companyDomain: $companyDomain
      userEmail: $userEmail
      emailAddress: $emailAddress
      imapHost: $imapHost
      imapPort: $imapPort
      password: $password
    ) {
      id
    }
  }
`;

export const LOGIN_SUPER_ADMIN = gql`
  mutation LoginSuperAdmin($userName: String!, $password: String!) {
    loginSuperAdmin(userName: $userName, password: $password) {
      token
      userName
      role
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($userName: String!, $password: String!) {
    createAdmin(userName: $userName, password: $password)
  }
`;

export const REMOVE_COMPANY = gql`
  mutation RemoveCompany($companyId: ID!) {
    removeCompany(companyId: $companyId)
  }
`;

export const SAVE_FORTNOX_TOKENS = gql`
  mutation SaveFortnoxTokens(
    $companyName: String!
    $service: String!
    $accessToken: String!
    $refreshToken: String
    $expiresAt: String
  ) {
    saveFortnoxTokens(
      companyName: $companyName
      service: $service
      accessToken: $accessToken
      refreshToken: $refreshToken
      expiresAt: $expiresAt
    )
  }
`;
