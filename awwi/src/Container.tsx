import React, { useEffect, useState } from "react";
import { setupSandbox } from "./aztec/instantiatePXE";

export const WalletPage = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupSandbox().then(() => setIsLoading(false));
  }, []);

  return isLoading ? (
    <div className="mb-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      doing setup sandbox...
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">
        Create Wallet
      </button>

      {showContainer && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Container Content</h2>
          <p className="text-gray-600">
            This is the container that appears below the button. You can add any
            content you want here.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
