import React, { Suspense, lazy, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const Wallet = lazy(() => {
  return new Promise((resolve) => {
    resolve(import("./Container") as any);
  });
});

export const App = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Wallet />
    </Suspense>
  );
};
