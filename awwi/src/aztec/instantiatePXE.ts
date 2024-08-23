import {
  // AccountWallet,
  // CompleteAddress,
  // ContractDeployer,
  // createDebugLogger,
  // Fr,
  // PXE,
  waitForPXE,
  // TxStatus,
  createPXEClient,
  // getContractInstanceFromDeployParams,
  // DebugLogger,
} from "@aztec/aztec.js";
import { PXE_URL } from "./../constants";

export const setupSandbox = async () => {
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  return pxe;
};

export default setupSandbox;
// try {
//   console.log(process.env);
//   let pxe = await setupSandbox();
//   let accounts = await pxe.getRegisteredAccounts();
//   console.log(accounts);
//   //let number = await pxe.getBlockNumber()
//   console.log(await pxe.getBlockNumber());
// } catch (e) {
//   console.log(e);
// }
