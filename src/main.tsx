import { ApolloProvider } from "@apollo/client/react";
import client from "./apolloClient";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FluentProvider } from "@fluentui/react-components";
import { internoxTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext.tsx";



createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <FluentProvider theme={internoxTheme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FluentProvider>
  </ApolloProvider>,
);
