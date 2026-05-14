import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateCompanyDocument,
  CreateCompanyAdminDocument,
  GetAllCompaniesDocument,
  RemoveCompanyDocument,
} from "../__generated__/graphql";
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
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import {
  BuildingRegular,
  AddRegular,
  MoreHorizontalRegular,
  PersonAddFilled,
  DeleteFilled,
} from "@fluentui/react-icons";

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

function AddCompanyAdminDialog({
  open,
  onOpenChange,
  companyName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}) {
  const styles = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const [createAdmin, { loading, error }] = useMutation(
    CreateCompanyAdminDocument,
  );

  const reset = () => {
    setEmail("");
    setPassword("");
    setDone(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) reset();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createAdmin({
        variables: { company: companyName, email, password },
      });
      setDone(true);
    } catch {
      // error displayed via error state
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => handleOpenChange(d.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle style={{ color: tokens.colorNeutralForeground1 }}>
            {done ? "Klart!" : `Lägg till admin – ${companyName}`}
          </DialogTitle>
          <DialogContent>
            {!done ? (
              <form
                id="add-admin-form"
                onSubmit={handleSubmit}
                className={styles.dialogForm}
              >
                <Field label="E-post" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@acme.se"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                <Field label="Lösenord" required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    appearance="outline"
                    className={styles.input}
                  />
                </Field>
                {error && (
                  <MessageBar intent="error">
                    <MessageBarBody>{error.message}</MessageBarBody>
                  </MessageBar>
                )}
              </form>
            ) : (
              <div className={styles.successMessage}>
                <Text size={400} weight="semibold">
                  Admin har lagts till!
                </Text>
                <Text
                  size={300}
                  style={{ color: tokens.colorNeutralForeground3 }}
                >
                  Den nya adminen kan nu logga in på {companyName}.
                </Text>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {!done ? (
              <>
                <Button
                  appearance="secondary"
                  onClick={() => handleOpenChange(false)}
                >
                  Avbryt
                </Button>
                <Button
                  type="submit"
                  form="add-admin-form"
                  appearance="primary"
                  disabled={loading}
                >
                  {loading ? <Spinner size="tiny" /> : "Lägg till"}
                </Button>
              </>
            ) : (
              <Button
                appearance="primary"
                onClick={() => handleOpenChange(false)}
              >
                Stäng
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function DeleteCompanyDialog({
  open,
  onOpenChange,
  companyId,
  companyName,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
  onDeleted: () => void;
}) {
  const [removeCompany, { loading, error }] = useMutation(
    RemoveCompanyDocument,
  );

  const handleDelete = async () => {
    try {
      await removeCompany({
        variables: { companyId },
      });
      onOpenChange(false);
      onDeleted();
    } catch {
      // error displayed via error state
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => onOpenChange(d.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle style={{ color: tokens.colorNeutralForeground1 }}>
            Ta bort företag
          </DialogTitle>
          <DialogContent>
            <Text>
              Är du säker på att du vill ta bort{" "}
              <Text weight="semibold">{companyName}</Text>? Detta kan inte
              ångras.
            </Text>
            {error && (
              <MessageBar intent="error" style={{ marginTop: "12px" }}>
                <MessageBarBody>{error.message}</MessageBarBody>
              </MessageBar>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button
              appearance="primary"
              style={{
                backgroundColor: tokens.colorPaletteRedBackground3,
                color: tokens.colorNeutralForegroundOnBrand,
              }}
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? <Spinner size="tiny" /> : "Ta bort"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function CompanyRowActions({
  companyId,
  companyName,
  onDeleted,
}: {
  companyId: string;
  companyName: string;
  onDeleted: () => void;
}) {
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            icon={<MoreHorizontalRegular />}
            aria-label="Åtgärder"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<PersonAddFilled />}
              onClick={() => setAddAdminOpen(true)}
            >
              Lägg till företagsadmin
            </MenuItem>
            <MenuItem
              icon={<DeleteFilled />}
              onClick={() => setDeleteOpen(true)}
            >
              Ta bort företag
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <AddCompanyAdminDialog
        open={addAdminOpen}
        onOpenChange={setAddAdminOpen}
        companyName={companyName}
      />
      <DeleteCompanyDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        companyId={companyId}
        companyName={companyName}
        onDeleted={onDeleted}
      />
    </>
  );
}

function CreateCompanyDialog({
  onCreated,
}: {
  onCreated: () => void;
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
                  <Badge appearance="filled" color="brand">
                    1
                  </Badge>
                  <Text size={200} weight="semibold">
                    Företagsuppgifter
                  </Text>
                  <Text size={200} style={{ marginLeft: "auto" }}>
                    Steg 1 av 2
                  </Text>
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
                  <Badge appearance="filled" color="brand">
                    2
                  </Badge>
                  <Text size={200} weight="semibold">
                    Admin för {createdCompanyName}
                  </Text>
                  <Text size={200} style={{ marginLeft: "auto" }}>
                    Steg 2 av 2
                  </Text>
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
                <Text
                  size={300}
                  style={{ color: tokens.colorNeutralForeground3 }}
                >
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
              <Button
                appearance="primary"
                onClick={() => handleOpenChange(false)}
              >
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

  const { data, loading, error, refetch } = useQuery(GetAllCompaniesDocument);

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
          <CreateCompanyDialog
            onCreated={() => refetch()}
          />
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
              <Text size={400} weight="semibold">
                Inga företag ännu
              </Text>
              <Text size={300}>
                Skapa ett nytt företag för att komma igång.
              </Text>
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
                    <TableHeaderCell />
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
                          <Text
                            size={200}
                            style={{ color: tokens.colorNeutralForeground3 }}
                          >
                            {c.id}
                          </Text>
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          <CompanyRowActions
                            companyId={c.id}
                            companyName={c.name}
                            onDeleted={() => refetch()}
                          />
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
