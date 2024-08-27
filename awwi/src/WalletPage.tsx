import React, { useEffect, useState } from "react";
import { setupSandbox } from "./aztec/instantiatePXE";
import { createAccount } from "./aztec/createAccount";
import { PXE } from "@aztec/aztec.js";
import { deployAccount } from "./aztec/deployAccount";
import { logAccount } from "./aztec/logAccount";

export const WalletPage = () => {
  const [showContainer] = useState(false);
  const [pxe, setPXE] = useState<PXE | null>(null);
  const [isLoadingSandbox, setIsLoadingSandbox] = useState(true);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  useEffect(() => {
    setupSandbox().then((pxe) => {
      setIsLoadingSandbox(false);
      setPXE(pxe);
    });
  }, []);

  return isLoadingSandbox ? (
    <div className="mb-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      doing setup sandbox...
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <button
        disabled={!pxe || isCreatingWallet}
        onClick={async () => {
          if (!pxe) {
            return;
          }
          setIsCreatingWallet(true);

          const account = await createAccount(pxe, undefined, undefined);
          console.log({ account });

          const registeredAccountsPreDeploy = await pxe.getRegisteredAccounts();
          console.log({ registeredAccountsPreDeploy });

          let txReceipt;
          try {
            txReceipt = await deployAccount(account);
            console.log({ txReceipt });

            await logAccount(account);

            setIsCreatingWallet(false);
          } catch (e) {
            console.error("error deploying account", e);
          }
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
      >
        {isCreatingWallet ? "Creating Wallet" : "Create Wallet"}
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
