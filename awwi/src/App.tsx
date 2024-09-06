import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const WalletPageLazy = lazy(() => {
  return new Promise((resolve) => resolve(import("./WalletPage") as any));
});

const client = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={client}>
      <Suspense
        fallback={
          <LoadingSpinner>
            <h1>Loading PXE Assets...</h1>
          </LoadingSpinner>
        }
      >
        <WalletPageLazy />
      </Suspense>
    </QueryClientProvider>
  );
};
