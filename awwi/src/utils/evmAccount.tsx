import {
  Address,
  WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { anvil } from "viem/chains";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
});

export const connectWallet = async (): Promise<{
  walletClient: WalletClient;
  account: Address;
}> => {
  if (typeof (window as any).ethereum !== "undefined") {
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletClient = createWalletClient({
        chain: anvil,
        transport: custom((window as any).ethereum),
      });

      console.log("Connected to wallet:", accounts[0]);
      return { walletClient, account: accounts[0] };
    } catch (error) {
      throw new Error(`Failed to connect to wallet: ${JSON.stringify(error)}`);
    }
  } else {
    throw new Error("MetaMask is not installed");
  }
};
