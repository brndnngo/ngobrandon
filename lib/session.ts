import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const GATE_COOKIE = "bn_gate";
const ALG = "HS256";

function secret() {
  const value =
    process.env.SESSION_SECRET ?? "local-dev-only-not-for-production-use-32b";
  return new TextEncoder().encode(value);
}

export async function createSessionToken() {
  return new SignJWT({ gate: true })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function hasGateAccess() {
  const jar = await cookies();
  const token = jar.get(GATE_COOKIE)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
