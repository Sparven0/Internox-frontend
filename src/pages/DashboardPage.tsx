import { Text, makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export default function DashboardPage() {
  const styles = useStyles();

  return (
    <div className={styles.page}>
      <Text as="h1" size={700} weight="semibold">
        Dashboard
      </Text>
    </div>
  );
}
