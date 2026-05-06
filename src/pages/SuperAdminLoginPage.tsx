import { useState, type FormEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { LoginSuperAdminDocument } from "../__generated__/graphql";
import { setSuperAdminToken } from "../apolloClient";
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

export default function SuperAdminPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loginSuperAdmin, { loading, error }] = useMutation(
    LoginSuperAdminDocument,
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await loginSuperAdmin({
        variables: { userName, password },
      });
      if (data) {
        setSuperAdminToken(data.loginSuperAdmin.token);
        localStorage.setItem(
          "superadmin_jwt_token",
          data.loginSuperAdmin.token,
        );
        navigate({ to: "/superadmin/dashboard" });
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
            <span className="login-visual__logo-dot" />
            internox
          </div>
          <div className="login-visual__tagline">
            <p>Super Admin.</p>
            <p>Full kontroll.</p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          <div className="login-form-header">
            <h1 className="login-form-title">Super Admin</h1>
            <p className="login-form-sub">Ange dina administratörsuppgifter.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Field label="Användarnamn" required>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="admin"
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
        </div>
      </div>
    </div>
  );
}
