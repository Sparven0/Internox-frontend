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
export const ADD_IMAP_CREDENTIALS = gql`
  mutation AddImapCredentials(
    $companyDomain: String!
    $userEmail: String!
    $imapHost: String!
    $imapPort: Int!
    $emailAddress: String!
    $password: String!
  ) {
    addImapCredentials(
      companyDomain: $companyDomain
      userEmail: $userEmail
      imapHost: $imapHost
      imapPort: $imapPort
      emailAddress: $emailAddress
      password: $password
    ) {
      id
    }
  }
`;