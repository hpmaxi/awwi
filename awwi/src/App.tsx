import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const WalletPageLazy = lazy(() => {
  return new Promise((resolve) => resolve(import("./WalletPage") as any));
});

export const App = () => {
  return (
    <Suspense
      fallback={
        <LoadingSpinner>
          <h1>Loading PXE Assets...</h1>
        </LoadingSpinner>
      }
    >
      <WalletPageLazy />
    </Suspense>
  );
};
