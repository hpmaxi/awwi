import React, { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const Container = lazy(() => {
  return new Promise((resolve) => {
    resolve(import("./Container") as any);
  });
});

export const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Container />
    </Suspense>
  );
};
