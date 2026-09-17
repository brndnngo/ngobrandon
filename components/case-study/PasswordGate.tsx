import { unlockCaseStudy } from "@/app/actions/unlock";

export function PasswordGate({
  next,
  error,
}: {
  next: string;
  error?: boolean;
}) {
  return (
    <section data-nav="light" className="mx-auto max-w-md py-32">
      <h1 className="font-display text-heading">This work is private.</h1>
      <p className="mt-4 text-body text-muted">
        Enter the password to read the case study.
      </p>

      <form action={unlockCaseStudy} className="mt-10 grid gap-4">
        <input type="hidden" name="next" value={next} />
        <label className="grid gap-2 text-body">
          <span className="text-eyebrow text-muted uppercase">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="border border-(--color-border) bg-transparent px-3 py-2 text-body outline-none focus:border-(--color-foreground)"
          />
        </label>
        {error ? (
          <p role="alert" className="text-body text-muted">
            That password didn’t match. Try again.
          </p>
        ) : null}
        <button
          type="submit"
          className="justify-self-start text-body underline underline-offset-4"
        >
          Continue
        </button>
      </form>
    </section>
  );
}
