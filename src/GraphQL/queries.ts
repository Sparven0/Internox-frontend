import { gql } from "@apollo/client";

export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanies {
      id
      name
      domain
    }
  }
`;

export const GET_COMPANY_BY_ID = gql`
  query GetCompanyById($id: ID!) {
    getCompanyById(id: $id) {
      id
      name
      domain
    }
  }
`;

export const GET_COMPANY_BY_NAME = gql`
  query GetCompanyByName($name: String!) {
    getCompanyByName(name: $name) {
      id
      name
      domain
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($company: String!) {
    getUsers(company: $company) {
      id
      email
      role
      created_at
    }
  }
`;

export const GET_USERS_BY_COMPANY_ID = gql`
  query GetUsersByCompanyId($companyId: String!) {
    getUsersByCompanyId(companyId: $companyId) {
      id
      email
      role
      created_at
    }
  }
`;

export const GET_IMAP_CREDENTIALS = gql`
  query GetImapCredentials($company: String!) {
    getImapCredentials(company: $company) {
      id
      user_id
      imap_host
      imap_port
      email_address
    }
  }
`;

export const GET_INIT_PAGE_DATA = gql`
  query GetInitPageData {
    getInitPageData {
      company {
        id
        name
      }
      users {
        id
        email
        role
      }
    }
  }
`;

export const GET_INIT_PAGE_INTEGRATION_DATA = gql`
  query GetInitPageIntegrationData {
    getInitPageIntegrationData {
      customers
      emails
    }
  }
`;

export const GET_FORTNOX_DATA = gql`
  query GetFortnoxData($companyId: String!, $endpoint: String) {
    getFortnoxData(companyId: $companyId, endpoint: $endpoint)
  }
`;
