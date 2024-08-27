import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const WalletPage = lazy(() => {
  return new Promise((resolve) => {
    resolve(import("./WalletPage") as any);
  });
});

export const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WalletPage />
    </Suspense>
  );
};
