import { useQuery } from "@apollo/client/react";
import {
  Badge,
  Card,
  CardHeader,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  GetInitPageDataDocument,
  GetInitPageIntegrationDataDocument,
  type GetInitPageDataQuery,
  type GetInitPageDataQueryVariables,
  type GetInitPageIntegrationDataQuery,
  type GetInitPageIntegrationDataQueryVariables,
} from "../__generated__/graphql";

interface Customer {
  name: string;
  email: string;
}

interface EmailMessage {
  uid: number;
  subject: string;
  from: string;
  to: string;
  date: string;
}

interface EmailGroup {
  userId: string;
  credentialId: string;
  emails: EmailMessage[];
  error: string | null;
}

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "16px",
  },
  card: {
    padding: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "8px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
  },
  emailRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "8px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
  },
  meta: {
    color: tokens.colorNeutralForeground3,
  },
});

export default function DashboardPage() {
  const styles = useStyles();

  const { loading, error, data } = useQuery<
    GetInitPageDataQuery,
    GetInitPageDataQueryVariables
  >(GetInitPageDataDocument);

  const { loading: integrationLoading, data: integrationData } = useQuery<
    GetInitPageIntegrationDataQuery,
    GetInitPageIntegrationDataQueryVariables
  >(GetInitPageIntegrationDataDocument);

  if (loading) {
    return (
      <div className={styles.page}>
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <MessageBar intent="error">
          <MessageBarBody>{error.message}</MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  const { company, users } = data!.getInitPageData;
  const customerList =
    (integrationData?.getInitPageIntegrationData?.customers as
      | Customer[]
      | null) ?? [];
  const emailGroups =
    (integrationData?.getInitPageIntegrationData?.emails as
      | EmailGroup[]
      | null) ?? [];

  return (
    <div className={styles.page}>
      <Text as="h1" size={700} weight="semibold">
        Dashboard
      </Text>

      <div className={styles.grid}>
        {/* Company */}
        <Card className={styles.card}>
          <CardHeader header={<Text weight="semibold">Company</Text>} />
          <Text size={400}>{company.name}</Text>
          <Text size={200} className={styles.meta}>
            ID: {company.id}
          </Text>
        </Card>

        {/* Users */}
        <Card className={styles.card}>
          <CardHeader
            header={<Text weight="semibold">Users ({users.length})</Text>}
          />
          <div className={styles.list}>
            {users.map((user) => (
              <div key={user.id} className={styles.row}>
                <Text size={300}>{user.email}</Text>
                <Badge
                  appearance="filled"
                  color={user.role === "admin" ? "brand" : "informative"}
                >
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Customers */}
        <Card className={styles.card}>
          <CardHeader
            header={
              <Text weight="semibold">
                Customers {!integrationLoading && `(${customerList.length})`}
              </Text>
            }
          />
          {integrationLoading ? (
            <Spinner size="tiny" label="Fetching…" />
          ) : (
            <div className={styles.list}>
              {customerList.map((customer, i) => (
                <div key={i} className={styles.row}>
                  <Text size={300} weight="semibold">
                    {customer.name}
                  </Text>
                  <Text size={300} className={styles.meta}>
                    {customer.email}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Emails */}
      {!integrationLoading && emailGroups.length > 0 && (
        <Card className={styles.card}>
          <CardHeader
            header={
              <Text weight="semibold">Emails ({emailGroups.length} inbox)</Text>
            }
          />
          <div className={styles.list}>
            {emailGroups.map((group) => (
              <div key={group.userId}>
                <Text size={200} className={styles.meta}>
                  User ID: {group.userId}
                </Text>
                <div className={styles.list} style={{ paddingLeft: "12px" }}>
                  {group.emails.map((email) => (
                    <div key={email.uid} className={styles.emailRow}>
                      <Text size={300} weight="semibold">
                        {email.subject}
                      </Text>
                      <Text size={200}>From: {email.from}</Text>
                      <Text size={200} className={styles.meta}>
                        {new Date(email.date).toLocaleString()}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
