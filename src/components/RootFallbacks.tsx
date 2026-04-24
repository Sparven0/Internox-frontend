import { useRouter } from "@tanstack/react-router";
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  errorBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  pageCentered: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },
  pageErrorBox: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "480px",
  },
});

export function RootPending() {
  const styles = useStyles();
  return (
    <div className={styles.centered}>
      <Spinner size="large" label="Loading…" />
    </div>
  );
}

export function RootError({ error }: { error: Error }) {
  const styles = useStyles();
  const router = useRouter();
  return (
    <div className={styles.centered}>
      <div className={styles.errorBox}>
        <MessageBar intent="error">
          <MessageBarBody>{error.message}</MessageBarBody>
        </MessageBar>
        <Button appearance="primary" onClick={() => router.invalidate()}>
          Retry
        </Button>
      </div>
    </div>
  );
}

export function PagePending() {
  const styles = useStyles();
  return (
    <div className={styles.pageCentered}>
      <Spinner label="Loading…" />
    </div>
  );
}

export function PageError({ error, reset }: { error: Error; reset: () => void }) {
  const styles = useStyles();
  return (
    <div className={styles.pageErrorBox}>
      <MessageBar intent="error">
        <MessageBarBody>{error.message}</MessageBarBody>
      </MessageBar>
      <Button appearance="outline" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
