import { useState, type FormEvent } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import {
  LoginDocument,
  GetOnboardingStatusDocument,
  GetUsersByCompanyIdDocument,
} from "../__generated__/graphql";
import { useAuth } from "../context/useAuth";
import { setAuthToken } from "../apolloClient";
import { useNavigate } from "@tanstack/react-router";

import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import "../LoginPage.css";
const useStyles = makeStyles({
  input: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: tokens.fontFamilyBase,
  },
  submitBtn: {
    width: "100%",
    height: "48px",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "0.01em",
  },
  errorBar: {
    borderRadius: "8px",
  },
});

export default function LoginPage() {
  const apolloClient = useApolloClient();
  const styles = useStyles();
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");

  const [login, { loading, error }] = useMutation(LoginDocument);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password, companyDomain },
      });
      if (data) {
        setAuthToken("cookie");
        setToken("authenticated");

        // Kolla onboarding-status med den nya tokenen
        const { data: statusData } = await apolloClient.query<{
          getOnboardingStatus?: {
            hasFortnox: boolean;
            hasEmployees: boolean;
            isComplete: boolean;
          };
        }>({
          query: GetOnboardingStatusDocument,
          fetchPolicy: "network-only",
        });

        if (statusData?.getOnboardingStatus?.isComplete) {
          const { data: usersData } = await apolloClient.query<{
            getUsersByCompanyId?: { id: string }[];
          }>({
            query: GetUsersByCompanyIdDocument,
            variables: { companyId: data.login.companyId },
            fetchPolicy: "network-only",
          });

          if ((usersData?.getUsersByCompanyId?.length ?? 0) > 0) {
            navigate({ to: "/dashboard" });
          }
        } else {
          navigate({ to: "/setup" });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left panel — visual ── */}
      <div className="login-visual" aria-hidden="true">
        <div className="login-visual__noise" />
        <div className="login-visual__grid" />
        <div className="login-visual__glow" />

        <div className="login-visual__content">
          <div className="login-visual__logo">
            <img src="/logo.svg" alt="internox" />
          </div>
          <div className="login-visual__tagline">
            <p>Kundaktivitet.</p>
            <p>Samlat.</p>
            <p>Dagligen.</p>
          </div>
          <div className="login-visual__stats">
            <div className="login-visual__stat">
              <span className="login-visual__stat-value">∞</span>
              <span className="login-visual__stat-label">Kunder synkade</span>
            </div>
            <div className="login-visual__stat-divider" />
            <div className="login-visual__stat">
              <span className="login-visual__stat-value">1</span>
              <span className="login-visual__stat-label">Samlad vy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          <div className="login-form-header">
            <h1 className="login-form-title">Logga in</h1>
            <p className="login-form-sub">
              Välkommen tillbaka. Ange dina uppgifter nedan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Field label="E-post" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="du@foretaget.se"
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

            <Field label="Företagsdomän" required>
              <Input
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                placeholder="foretaget.se"
                appearance="outline"
                className={styles.input}
              />
            </Field>

            {error && (
              <MessageBar intent="error" className={styles.errorBar}>
                <MessageBarBody>{error.message}</MessageBarBody>
              </MessageBar>
            )}

            <Button
              type="submit"
              appearance="primary"
              disabled={loading}
              size="large"
              className={styles.submitBtn}
            >
              {loading ? "Loggar in…" : "Logga in"}
            </Button>
          </form>

          <p className="login-form-footer">
            Behöver du åtkomst?{" "}
            <a href="mailto:support@internox.se">Kontakta oss</a>
          </p>
        </div>
      </div>
    </div>
  );
}
