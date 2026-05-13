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

export const GET_SENT_EMAILS = gql`
  query GetSentEmails(
    $companyId: String!
    $credentialId: String!
    $password: String
  ) {
    getSentEmails(
      companyId: $companyId
      credentialId: $credentialId
      password: $password
    ) {
      uid
      subject
      from
      to
      date
      text
      html
    }
  }
`;

export const GET_ONBOARDING_STATUS = gql`
  query GetOnboardingStatus {
    getOnboardingStatus {
      hasFortnox
      hasEmployees
      isComplete
    }
  }
`;

export const GET_FINANCIAL_YEARS = gql`
  query GetFinancialYears {
    getFinancialYears {
      id
      fortnoxId
      fromDate
      toDate
      accountChartType
      accountingMethod
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts($financialYearId: ID!) {
    getAccounts(financialYearId: $financialYearId) {
      accountNumber
      description
      active
      balanceBroughtForward
      balanceCarriedForward
      vatCode
    }
  }
`;

export const GET_VOUCHERS = gql`
  query GetVouchers($financialYearId: ID!, $page: Int, $limit: Int) {
    getVouchers(financialYearId: $financialYearId, page: $page, limit: $limit) {
      id
      voucherSeries
      voucherNumber
      transactionDate
      description
      referenceType
      referenceNumber
    }
  }
`;

export const GET_VOUCHER_DETAIL = gql`
  query GetVoucherDetail($voucherId: ID!) {
    getVoucherDetail(voucherId: $voucherId) {
      id
      voucherSeries
      voucherNumber
      transactionDate
      description
      referenceType
      referenceNumber
      rows {
        accountNumber
        debit
        credit
        description
      }
    }
  }
`;

export const GET_EMPLOYEES_BY_CUSTOMER = gql`
  query GetEmployeesByCustomer($customerId: ID!) {
    getEmployeesByCustomer(customerId: $customerId) {
      id
      email
      role
    }
  }
`;

export const GET_ALL_CUSTOMERS = gql`
  query GetAllCustomers {
    getAllCustomers {
      id
      name
      email
      fortnoxCustomerNumber
    }
  }
`;

export const GET_CUSTOMERS_BY_EMPLOYEE = gql`
  query GetCustomersByEmployee($userId: ID!) {
    getCustomersByEmployee(userId: $userId) {
      id
      name
      email
      fortnoxCustomerNumber
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      role
      email
      userName
      companyId
      companyName
    }
  }
`;

export const GET_INVOICES = gql`
  query GetInvoices(
    $page: Int
    $limit: Int
    $status: String
    $customerNumber: String
  ) {
    getInvoices(
      page: $page
      limit: $limit
      status: $status
      customerNumber: $customerNumber
    ) {
      invoiceNumber
      customerNumber
      invoiceDate
      dueDate
      totalExclVat
      totalInclVat
      vat
      currency
      status
      ourReference
      yourReference
      syncedAt
      bookedAt
      rows {
        rowNumber
        articleNumber
        description
        quantity
        price
        vatPercent
        total
      }
    }
  }
`;

export const GET_INVOICE_DETAIL = gql`
  query GetInvoiceDetail($invoiceNumber: String!) {
    getInvoiceDetail(invoiceNumber: $invoiceNumber) {
      invoiceNumber
      customerNumber
      invoiceDate
      dueDate
      totalExclVat
      totalInclVat
      vat
      currency
      status
      ourReference
      yourReference
      syncedAt
      bookedAt
      rows {
        rowNumber
        articleNumber
        description
        quantity
        price
        vatPercent
        total
      }
    }
  }
`;

export const GET_FORTNOX_AUTH_URL = gql`
  query GetFortnoxAuthUrl {
    getFortnoxAuthUrl
  }
`;

export const GET_INVOICE_RECIPIENT_ALIASES = gql`
  query GetInvoiceRecipientAliases {
    invoiceRecipientAliases {
      id
      alias
      customerId
      customer {
        id
        name
        email
      }
      createdAt
    }
  }
`;

export const GET_EMAILS_BY_USER = gql`
  query GetEmailsByUser($userId: ID!) {
    getEmailsByUser(userId: $userId) {
      id
      messageId
      subject
      fromAddress
      fromName
      toAddresses
      ccAddresses
      bccAddresses
      direction
      createdAt
      sentAt
      customerId
      mailbox
      source
      threadId
      bodyHtml
      bodyText
    }
  }
`;

export const GET_USER_ACTIVITY_TIMELINE = gql`
  query GetUserActivityTimeline(
    $userId: ID!
    $fromDate: String!
    $toDate: String!
    $limit: Int
  ) {
    getUserActivityTimeline(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
      limit: $limit
    ) {
      kind
      occurredAt
      mailSent {
        id
        subject
        messageId
        fromAddress
      }
      emailActivity {
        id
        subject
        recipientEmail
        messageId
      }
      fortnoxInvoice {
        id
        invoiceNumber
        customerNumber
        totalInclVat
        currency
        status
      }
    }
  }
`;
