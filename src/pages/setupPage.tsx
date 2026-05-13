import { useState, type ChangeEvent } from "react";
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
import { ArrowRight20Regular, Checkmark16Regular, Add20Regular } from "@fluentui/react-icons";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "@tanstack/react-router";
import { internoxTheme } from "../theme";
import { ADD_IMAP_CREDENTIALS, CREATE_USER } from "../GraphQL/mutations";
import { GetFortnoxAuthUrlDocument } from "../__generated__/graphql";
import { getAuthToken } from "../apolloClient";
import "../OnboardingPage.css";

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
  addMoreBtn: {
    flex: 1,
  },
  continueBtn: {
    flex: 1,
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
  companyDomain: "",
  userEmail: "",
  imapHost: "",
  imapPort: "",
  emailAddress: "",
  password: "",
};

const FIELDS: {
  name: keyof FormState;
  label: string;
  placeholder: string;
  type: InputType;
  full: boolean;
}[] = [
  { name: "companyDomain", label: "Företagsdomän",           placeholder: "foretaget.se",      type: "text",     full: false },
  { name: "userEmail",     label: "Användarens e-post",      placeholder: "anna@gmail.com",    type: "email",    full: false },
  { name: "imapHost",      label: "IMAP-server",             placeholder: "imap.gmail.com",    type: "text",     full: false },
  { name: "imapPort",      label: "IMAP-port",               placeholder: "993",               type: "number",   full: false },
  { name: "emailAddress",  label: "E-postadress",            placeholder: "anna@foretaget.se", type: "email",    full: true  },
  { name: "password",      label: "Lösenord / App-lösenord", placeholder: "••••••••••••",      type: "password", full: true  },
];

// ── Component ──────────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const fortnoxDone = !!getAuthToken();
  const [imapDone, setImapDone]         = useState<boolean>(false);
  const [addedCount, setAddedCount]     = useState<number>(0);
  const [form, setForm]                 = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading]           = useState<boolean>(false);
  const [result, setResult]             = useState<AlertResult>(null);

  const classes = useStyles();
  const isValid = Object.values(form).every((v) => v.trim() !== "");

  const [createUser]          = useMutation(CREATE_USER);
  const [addImapCredentials]  = useMutation(ADD_IMAP_CREDENTIALS);
  const { data: fortnoxAuthData } = useQuery(GetFortnoxAuthUrlDocument);

  const handleFortnoxConnect = () => {
    const url = fortnoxAuthData?.getFortnoxAuthUrl;
    if (url) window.open(url, "_blank");
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
      // Steg 1 — skapa användaren (ignorera om den redan finns)
      try {
        await createUser({
          variables: {
            email: form.userEmail,
            companyDomain: form.companyDomain,
            password: form.password,
          },
        });
      } catch (userErr: unknown) {
        if (!(userErr instanceof Error) || !userErr.message?.includes("Unique constraint")) {
          throw userErr;
        }
      }

      // Steg 2 — lägg till IMAP
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

      setAddedCount((prev) => prev + 1);
      setImapDone(true);
      setResult({ type: "success", message: `${form.userEmail} har lagts till!` });
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      setResult({ type: "error", message: err instanceof Error ? err.message : "Något gick fel." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    setResult(null);
    setForm(EMPTY_FORM);
    // imapDone stays true to keep step 2 highlighted
  };

  const handleContinue = () => {
    navigate({ to: "/dashboard" });
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
            <div className={`step-card${imapDone ? " step-card--active" : ""}`}>
              <div className="step-header">
                <StepBadge number="2" done={imapDone} />
                <div>
                  <p className="step-title">Lägg till anställda</p>
                  <p className="step-desc">
                    Konfigurera e-postkoppling via IMAP
                    {addedCount > 0 && (
                      <span className="step-count"> — {addedCount} tillagd{addedCount !== 1 ? "e" : ""}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="step-divider" />
              <div className="step-body">

                {/* ── Success state — add more or continue ── */}
                {imapDone && result?.type === "success" ? (
                  <div className="onboarding-decision">
                    <p className="onboarding-decision__label">
                      ✓ {result.message}
                    </p>
                    <p className="onboarding-decision__question">
                      Vill du lägga till fler anställda?
                    </p>
                    <div className="onboarding-decision__actions">
                      <Button
                        appearance="outline"
                        size="large"
                        className={classes.addMoreBtn}
                        icon={<Add20Regular />}
                        onClick={handleAddMore}
                      >
                        Lägg till fler
                      </Button>
                      <Button
                        appearance="primary"
                        size="large"
                        className={classes.continueBtn}
                        icon={<ArrowRight20Regular />}
                        iconPosition="after"
                        onClick={handleContinue}
                      >
                        Gå till dashboard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
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

                    {result?.type === "error" && (
                      <div className="alert alert--error">
                        {result.message}
                      </div>
                    )}

                    <p className="field-hint">
                      Lösenordet krypteras och lagras säkert. Använd ett
                      app-specifikt lösenord om möjligt.
                    </p>
                  </>
                )}
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