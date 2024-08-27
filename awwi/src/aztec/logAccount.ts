import { AccountManager } from "@aztec/aztec.js";

export async function logAccount(account: AccountManager) {
  const { address, partialAddress, publicKeys } = account.getCompleteAddress();
  const { initializationHash, deployer, salt } = account.getInstance();
  const wallet = await account.getWallet();
  const secretKey = wallet.getSecretKey();

  console.log(`\nNew account:\n`);
  console.log(`Address:         ${address.toString()}`);
  console.log(`Public key:      0x${publicKeys.toString()}`);
  console.log(`Secret key:     ${secretKey.toString()}`);
  console.log(`Partial address: ${partialAddress.toString()}`);
  console.log(`Salt:            ${salt.toString()}`);
  console.log(`Init hash:       ${initializationHash.toString()}`);
  console.log(`Deployer:        ${deployer.toString()}`);
}
