import { ApolloProvider } from "@apollo/client/react";
import client from "./apolloClient";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <FluentProvider theme={webLightTheme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FluentProvider>
  </ApolloProvider>,
);
