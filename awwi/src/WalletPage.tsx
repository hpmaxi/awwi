import React, { useEffect, useState } from "react";
import { setupSandbox } from "./aztec/instantiatePXE";
import { createAccount } from "./aztec/createAccount";
import { Fr, PXE } from "@aztec/aztec.js";
import { deployAccount } from "./aztec/deployAccount";
import { connectWallet } from "./evmAccount";
import { Address, WalletClient, keccak256 } from "viem";
import { LoadingSpinner } from "./LoadingSpinner";

const btnBaseClasses =
  "px-4 py-2 font-bold text-white rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline";
const btnEnabledClasses = "bg-blue-500 hover:bg-blue-600 active:bg-blue-700";
const btnDisabledClasses = "bg-blue-300 opacity-50 cursor-not-allowed";

export const WalletPage = () => {
  const [showContainer] = useState(false);
  const [pxe, setPXE] = useState<PXE | null>(null);
  const [isLoadingSandbox, setIsLoadingSandbox] = useState(true);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [signedMessage, setSignedMessage] = useState<Address>("0x");
  const [evmAccount, setEvmAccount] = useState<Address | null>(null);
  const [evmWalletClient, setEvmWallletClient] = useState<WalletClient | null>(
    null
  );

  useEffect(() => {
    setupSandbox().then((pxe) => {
      setIsLoadingSandbox(false);
      setPXE(pxe);
    });
  }, []);

  const isDisabledConnectEVMWallet = !pxe || isCreatingWallet;
  const isDisabledCreateAztecWallet = !pxe || isCreatingWallet;
  const isDisabledSignMessage = !evmAccount || !evmWalletClient;

  return isLoadingSandbox ? (
    <LoadingSpinner>
      <>
        <h1>Setting up your sandbox...</h1>
        <p>This may take a few moments. Please wait.</p>
      </>
    </LoadingSpinner>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <button
        disabled={isDisabledConnectEVMWallet}
        onClick={() =>
          connectWallet().then(async ({ walletClient, account }) => {
            walletClient && setEvmWallletClient(walletClient);
            account && setEvmAccount(account);
          })
        }
        className={`${btnBaseClasses} ${
          isDisabledConnectEVMWallet ? btnDisabledClasses : btnEnabledClasses
        }`}
      >
        Connect EVM Account
      </button>
      <button
        disabled={isDisabledSignMessage}
        onClick={async () => {
          if (!evmWalletClient || !evmAccount) return;
          const signed = await evmWalletClient.signMessage({
            account: evmAccount,
            message: "test",
          });

          setSignedMessage(signed);
        }}
        className={`${btnBaseClasses} ${
          isDisabledSignMessage ? btnDisabledClasses : btnEnabledClasses
        }`}
      >
        Sign message
      </button>
      {signedMessage && <code>{signedMessage}</code>}
      <button
        disabled={isDisabledCreateAztecWallet}
        onClick={async () => {
          if (!pxe) {
            return;
          }
          setIsCreatingWallet(true);

          const secret = Fr.fromString(keccak256(signedMessage));
          const account = await createAccount(pxe, secret, undefined);
          console.log({ account });

          const registeredAccountsPreDeploy = await pxe.getRegisteredAccounts();
          console.log({ registeredAccountsPreDeploy });

          let txReceipt;
          try {
            txReceipt = await deployAccount(account);
            console.log({ txReceipt });

            // await logAccount(account);

            setIsCreatingWallet(false);
          } catch (e) {
            console.error("error deploying account", e);
          }
        }}
        className={`${btnBaseClasses} ${
          isDisabledCreateAztecWallet ? btnDisabledClasses : btnEnabledClasses
        }`}
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
