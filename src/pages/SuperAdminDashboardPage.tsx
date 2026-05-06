import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateCompanyDocument,
  CreateCompanyAdminDocument,
  GetAllCompaniesDocument,
} from "../__generated__/graphql";
import { getSuperAdminToken } from "../apolloClient";
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Text,
  Badge,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { BuildingRegular, AddRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground1,
  },
  logoDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground,
  },
  superAdminBadge: {
    padding: `2px ${tokens.spacingHorizontalS}`,
    borderRadius: "4px",
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    padding: tokens.spacingVerticalXL,
    maxWidth: "1100px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalL,
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalS,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXL}`,
    color: tokens.colorNeutralForeground3,
  },
  dialogForm: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  stepIndicator: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  input: {
    width: "100%",
  },
  successMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
    textAlign: "center",
  },
});

type Step = "company" | "admin" | "done";

function CreateCompanyDialog({
  onCreated,
  authContext,
}: {
  onCreated: () => void;
  authContext: { headers: { Authorization: string } };
}) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("company");

  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [createdCompanyName, setCreatedCompanyName] = useState("");

  const [createCompany, { loading: loadingCompany, error: errorCompany }] =
    useMutation(CreateCompanyDocument);
  const [createAdmin, { loading: loadingAdmin, error: errorAdmin }] =
    useMutation(CreateCompanyAdminDocument);

  const resetForm = () => {
    setStep("company");
    setCompanyName("");
    setDomain("");
    setAdminEmail("");
    setAdminPassword("");
    setCreatedCompanyName("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  const handleCreateCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await createCompany({
        variables: { name: companyName, domain },
        context: authContext,
      });
      if (data?.createCompany) {
        setCreatedCompanyName(data.createCompany.name);
        setStep("admin");
      }
    } catch {
      // error displayed via errorCompany
    }
  };

  const handleCreateAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createAdmin({
        variables: {
          company: createdCompanyName,
          email: adminEmail,
          password: adminPassword,
        },
        context: authContext,
      });
      setStep("done");
      onCreated();
    } catch {
      // error displayed via errorAdmin
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => handleOpenChange(d.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" icon={<AddRegular />}>
          Nytt företag
        </Button>
      </DialogTrigger>

      <DialogSurface>
        <DialogBody>
          <DialogTitle style={{ color: tokens.colorNeutralForeground1 }}>
            {step === "company" && "Skapa företag"}
            {step === "admin" && "Skapa företagsadmin"}
            {step === "done" && "Klart!"}
          </DialogTitle>

          <DialogContent>
            {step === "company" && (
              <form
                id="company-form"
                onSubmit={handleCreateCompany}
                className={styles.dialogForm}
              >
                <div className={styles.stepIndicator}>
                  <Badge appearance="filled" color="brand">1</Badge>
                  <Text size={200} weight="semibold">Företagsuppgifter</Text>
                  <Text size={200} style={{ marginLeft: "auto" }}>Steg 1 av 2</Text>
                </div>
                <Field label="Företagsnamn" required>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme AB"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                <Field label="Domän" required>
                  <Input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="acme.se"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                {errorCompany && (
                  <MessageBar intent="error">
                    <MessageBarBody>{errorCompany.message}</MessageBarBody>
                  </MessageBar>
                )}
              </form>
            )}

            {step === "admin" && (
              <form
                id="admin-form"
                onSubmit={handleCreateAdmin}
                className={styles.dialogForm}
              >
                <div className={styles.stepIndicator}>
                  <Badge appearance="filled" color="brand">2</Badge>
                  <Text size={200} weight="semibold">
                    Admin för {createdCompanyName}
                  </Text>
                  <Text size={200} style={{ marginLeft: "auto" }}>Steg 2 av 2</Text>
                </div>
                <Field label="E-post" required>
                  <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@acme.se"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                <Field label="Lösenord" required>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                {errorAdmin && (
                  <MessageBar intent="error">
                    <MessageBarBody>{errorAdmin.message}</MessageBarBody>
                  </MessageBar>
                )}
              </form>
            )}

            {step === "done" && (
              <div className={styles.successMessage}>
                <Text size={500} weight="semibold">
                  {createdCompanyName} har skapats!
                </Text>
                <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                  Företaget och dess admin är nu redo att använda Internox.
                </Text>
              </div>
            )}
          </DialogContent>

          <DialogActions>
            {step === "company" && (
              <>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Avbryt</Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  form="company-form"
                  appearance="primary"
                  disabled={loadingCompany}
                >
                  {loadingCompany ? <Spinner size="tiny" /> : "Nästa"}
                </Button>
              </>
            )}
            {step === "admin" && (
              <Button
                type="submit"
                form="admin-form"
                appearance="primary"
                disabled={loadingAdmin}
              >
                {loadingAdmin ? <Spinner size="tiny" /> : "Skapa admin"}
              </Button>
            )}
            {step === "done" && (
              <Button appearance="primary" onClick={() => handleOpenChange(false)}>
                Stäng
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default function SuperAdminDashboardPage() {
  const styles = useStyles();
  const superAdminToken = getSuperAdminToken();
  const authContext = { headers: { Authorization: `Bearer ${superAdminToken}` } };

  const { data, loading, error, refetch } = useQuery(GetAllCompaniesDocument, {
    context: authContext,
  });

  const companies = data?.getAllCompanies ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          internox
        </div>
        <span className={styles.superAdminBadge}>Super Admin</span>
      </header>

      <main className={styles.content}>
        <div className={styles.sectionHeader}>
          <Text as="h1" size={700} weight="semibold">
            Företag
          </Text>
          <CreateCompanyDialog onCreated={() => refetch()} authContext={authContext} />
        </div>

        <div className={styles.card}>
          {loading && (
            <div className={styles.emptyState}>
              <Spinner label="Laddar företag…" />
            </div>
          )}

          {error && (
            <div className={styles.emptyState}>
              <MessageBar intent="error">
                <MessageBarBody>{error.message}</MessageBarBody>
              </MessageBar>
            </div>
          )}

          {!loading && !error && companies.length === 0 && (
            <div className={styles.emptyState}>
              <BuildingRegular fontSize={40} />
              <Text size={400} weight="semibold">Inga företag ännu</Text>
              <Text size={300}>Skapa ett nytt företag för att komma igång.</Text>
            </div>
          )}

          {!loading && !error && companies.length > 0 && (
            <div className={styles.tableWrapper}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Namn</TableHeaderCell>
                    <TableHeaderCell>Domän</TableHeaderCell>
                    <TableHeaderCell>ID</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((c) =>
                    c ? (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Text weight="semibold">{c.name}</Text>
                        </TableCell>
                        <TableCell>{c.domain}</TableCell>
                        <TableCell>
                          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                            {c.id}
                          </Text>
                        </TableCell>
                      </TableRow>
                    ) : null,
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
