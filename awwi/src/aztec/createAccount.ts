import { type PXE } from "@aztec/aztec.js";
import { Fr, deriveSigningKey } from "@aztec/circuits.js";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";

export async function createAccount(
  pxeClient: PXE,
  secretKey: Fr | undefined,
  salt: Fr | undefined
) {
  secretKey ??= Fr.random();
  salt ??= Fr.ZERO;

  if (!salt) {
    throw new Error("Cannot create wallet without salt");
  }

  if (!secretKey) {
    throw new Error("Cannot create wallet without secret key");
  }

  const account = getSchnorrAccount(
    pxeClient,
    secretKey,
    deriveSigningKey(secretKey),
    salt
  );

  return account;
}
