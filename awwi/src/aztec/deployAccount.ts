import {
  AccountManager,
  AccountWallet,
  DeployAccountOptions,
  SendMethodOptions,
} from "@aztec/aztec.js";
import { GasSettings } from "@aztec/circuits.js";

export interface IFeeOpts {
  estimateOnly: boolean;
  gasSettings: GasSettings;
  toSendOpts(sender: AccountWallet): Promise<SendMethodOptions>;
}

export async function deployAccount(account: AccountManager) {
  const sendOpts: DeployAccountOptions = {
    fee: undefined,
    skipClassRegistration: false,
    skipPublicDeployment: false,
    estimateGas: false,
    skipInitialization: false,
  };

  return account.deploy({ ...sendOpts }).wait();
}
