"use client";

import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false },
);

export function LottieAnimation({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <DotLottieReact src={src} autoplay loop className={className} />
  );
}
