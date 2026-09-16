"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, GATE_COOKIE } from "@/lib/session";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export async function unlockCaseStudy(formData: FormData) {
  const submitted = String(formData.get("password") ?? "");
  const expected = process.env.CASE_STUDY_PASSWORD ?? "";
  const next = String(formData.get("next") ?? "/");

  const ok =
    expected.length > 0 &&
    timingSafeEqual(digest(submitted), digest(expected));

  if (!ok) {
    redirect(`${next}?error=1`);
  }

  const token = await createSessionToken();
  const jar = await cookies();
  jar.set(GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next);
}
