import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Payload = {
  _type?: string;
  slug?: { current?: string } | string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing secret" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<Payload>(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag("projects", "max");

  const slug =
    typeof body?.slug === "string" ? body.slug : body?.slug?.current;
  if (slug) {
    revalidateTag(`project:${slug}`, "max");
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null });
}
