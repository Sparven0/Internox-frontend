import { useState, type SubmitEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { LoginDocument } from "../__generated__/graphql";
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    width: "360px",
    padding: "40px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    textAlign: "center",
    color: tokens.colorBrandForeground1,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
});

export default function LoginPage() {
  const styles = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");

  const [login, { loading, error }] = useMutation(LoginDocument);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password, companyDomain },
      });
      if (data) {
        localStorage.setItem("token", data.login.token);
        // redirect or update auth state here
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Text as="h1" size={600} weight="semibold" className={styles.title}>
          Sign in
        </Text>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              appearance="outline"
            />
          </Field>
          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              appearance="outline"
            />
          </Field>
          <Field label="Company domain" required>
            <Input
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              placeholder="yourcompany"
              appearance="outline"
            />
          </Field>
          {error && (
            <MessageBar intent="error">
              <MessageBarBody>{error.message}</MessageBarBody>
            </MessageBar>
          )}
          <Button
            type="submit"
            appearance="primary"
            disabled={loading}
            size="large"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
