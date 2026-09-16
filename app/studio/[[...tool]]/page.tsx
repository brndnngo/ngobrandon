import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/lib/sanity/env";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="grid min-h-dvh place-items-center px-8 text-center">
        <div className="max-w-md">
          <h1 className="text-heading">Studio is not connected yet</h1>
          <p className="mt-4 text-body text-muted">
            Create a Sanity project, then set{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
            <code>.env.local</code>. See <code>.env.example</code>.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
