
import { useState, useEffect, type ChangeEvent } from "react";
import {
  FluentProvider,
  Button,
  Input,
  Field,
  Spinner,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { ArrowRight20Regular, Checkmark16Regular } from "@fluentui/react-icons";
import { useMutation } from "@apollo/client/react";
import { internoxTheme } from "../theme";
import "../OnboardingPage.css"
import { ADD_IMAP_CREDENTIALS } from "../GraphQL/mutations"; // justera sökväg

// I komponenten:

// ── Types ──────────────────────────────────────────────
type InputType = "text" | "email" | "password" | "number" | "search" | "tel" | "url";

type AlertResult = {
  type: "success" | "error";
  message: string;
} | null;

type FormState = {
  companyDomain: string;
  userEmail: string;
  imapHost: string;
  imapPort: string;
  emailAddress: string;
  password: string;
};

// ── Cookie helper ──────────────────────────────────────


// ── FluentUI makeStyles ────────────────────────────────
const useStyles = makeStyles({
  submitBtn: {
    width: "100%",
    justifyContent: "center",
  },
  fortnoxBtn: {
    gap: "10px",
  },
  fieldLabel: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

// ── Fortnox logo mark ──────────────────────────────────
const FortnoxMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect width="20" height="20" rx="4" fill="white" fillOpacity="0.25" />
    <path d="M5 5h10v3H8v2h6v3H8v4H5V5z" fill="white" />
  </svg>
);

// ── Step badge ─────────────────────────────────────────
const StepBadge = ({ number, done }: { number: string; done: boolean }) => (
  <div className={`step-number${done ? " step-number--done" : ""}`}>
    {done ? <Checkmark16Regular /> : number}
  </div>
);

// ── Field definitions ──────────────────────────────────
const EMPTY_FORM: FormState = {
  companyDomain: "", userEmail: "", imapHost: "",
  imapPort: "", emailAddress: "", password: "",
};

const FIELDS: {
  name: keyof FormState;
  label: string;
  placeholder: string;
  type: InputType;
  full: boolean;
}[] = [
  { name: "companyDomain", label: "Företagsnamn",           placeholder: "foretaget AB",      type: "text",     full: false },
  { name: "userEmail",     label: "Användarens e-post",      placeholder: "anna@foretaget.se", type: "email",    full: false },
  { name: "imapHost",      label: "IMAP-server",             placeholder: "imap.foretaget.se", type: "text",     full: false },
  { name: "imapPort",      label: "IMAP-port",               placeholder: "993",               type: "number",   full: false },
  { name: "emailAddress",  label: "E-postadress",            placeholder: "anna@foretaget.se", type: "email",    full: true  },
  { name: "password",      label: "Lösenord / App-lösenord", placeholder: "••••••••••••",      type: "password", full: true  },
];

// ── Component ──────────────────────────────────────────
export default function OnboardingPage() {
    const [addImapCredentials] = useMutation(ADD_IMAP_CREDENTIALS);
  const [fortnoxDone, setFortnoxDone] = useState<boolean>(false);
  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading]         = useState<boolean>(false);
  const [result, setResult]           = useState<AlertResult>(null);

  const classes = useStyles();
  const isValid = Object.values(form).every((v) => v.trim() !== "");

  useEffect(() => {
    if (localStorage.getItem("jwt_token")) setFortnoxDone(true);
  }, []);

  const handleFortnoxConnect = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setResult({ type: "error", message: "Ingen token hittades. Kontrollera att du är inloggad." });
      return;
    }
    window.open(`http://localhost:1222/auth?token=${encodeURIComponent(token)}`, "_blank");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async () => {
  if (!isValid) return;
  setLoading(true);
  setResult(null);
  try {
    await addImapCredentials({
      variables: {
        companyDomain: form.companyDomain,
        userEmail: form.userEmail,
        imapHost: form.imapHost,
        imapPort: parseInt(form.imapPort),
        emailAddress: form.emailAddress,
        password: form.password,
      },
    });
    setResult({ type: "success", message: "E-postkoppling sparad! Anställd har lagts till." });
    setForm(EMPTY_FORM);
  } catch (err: any) {
    setResult({ type: "error", message: err.message ?? "Något gick fel." });
  } finally {
    setLoading(false);
  }
};

  return (
    <FluentProvider theme={internoxTheme}>
      <div className="onboarding-page">

        <header className="onboarding-header">
          <div className="onboarding-logo">
            <span className="onboarding-logo-dot" />
            internox
          </div>
          <span className="onboarding-badge">Onboarding</span>
        </header>

        <main className="onboarding-main">
          <p className="onboarding-hero-label">Kom igång</p>
          <h1 className="onboarding-hero-title">Konfigurera din<br />arbetsyta</h1>
          <p className="onboarding-hero-sub">
            Koppla Fortnox för kundsynkronisering och lägg till dina anställdas
            e-postkonton för att börja spåra aktivitet per kund.
          </p>

          <div className="onboarding-steps">

            {/* Step 1 — Fortnox */}
            <div className={`step-card${fortnoxDone ? " step-card--active" : ""}`}>
              <div className="step-header">
                <StepBadge number="1" done={fortnoxDone} />
                <div>
                  <p className="step-title">Koppla Fortnox</p>
                  <p className="step-desc">Auktorisera åtkomst till kunder och fakturor</p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-body">
                <Button
                  appearance="primary"
                  size="large"
                  className={classes.fortnoxBtn}
                  icon={<FortnoxMark />}
                  iconPosition="before"
                  onClick={handleFortnoxConnect}
                >
                  Koppla Fortnox
                  <ArrowRight20Regular style={{ marginLeft: 4 }} />
                </Button>
                <p className="fortnox-btn-hint">
                  Du omdirigeras till Fortnox för att godkänna åtkomst.
                  Token läses från din session automatiskt.
                </p>
              </div>
            </div>

            {/* Step 2 — IMAP */}
            <div className="step-card">
              <div className="step-header">
                <StepBadge number="2" done={false} />
                <div>
                  <p className="step-title">Lägg till anställd</p>
                  <p className="step-desc">Konfigurera e-postkoppling via IMAP</p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-body">
                <div className="form-grid">
                  {FIELDS.map((f) => (
                    <div key={f.name} className={f.full ? "form-grid__full" : ""}>
                      <Field label={<Text className={classes.fieldLabel}>{f.label}</Text>}>
                        <Input
                          name={f.name}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={form[f.name]}
                          onChange={handleChange}
                          appearance="outline"
                        />
                      </Field>
                    </div>
                  ))}
                </div>

                <Button
                  appearance="primary"
                  size="large"
                  className={classes.submitBtn}
                  onClick={handleSubmit}
                  disabled={loading || !isValid}
                  icon={loading ? <Spinner size="tiny" /> : <ArrowRight20Regular />}
                  iconPosition="after"
                >
                  {loading ? "Sparar..." : "Lägg till anställd"}
                </Button>

                {result && (
                  <div className={`alert alert--${result.type}`}>
                    {result.message}
                  </div>
                )}

                <p className="field-hint">
                  Lösenordet krypteras och lagras säkert. Använd ett
                  app-specifikt lösenord om möjligt.
                </p>
              </div>
            </div>

          </div>
        </main>

        <footer className="onboarding-footer">
          <span>© 2025 Internox</span>
          <span>
            Behöver du hjälp?{" "}
            <a href="mailto:support@internox.se">Kontakta oss</a>
          </span>
        </footer>

      </div>
    </FluentProvider>
  );
}