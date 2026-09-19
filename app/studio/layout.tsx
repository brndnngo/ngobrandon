import { NextStudioLayout } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh">
      <NextStudioLayout>{children}</NextStudioLayout>
    </div>
  );
}
