import { unlockCaseStudy } from "@/app/actions/unlock";

const fieldClass =
  "box-border h-[4.5rem] w-full rounded-[16px] border border-(--color-border) bg-transparent px-6 text-center font-sans text-[1.0625rem] leading-none tracking-[-0.02em] text-foreground";

export function PasswordGate({
  next,
  error,
}: {
  next: string;
  error?: boolean;
}) {
  return (
    <section data-nav="light" className="w-full max-w-[40rem]">
      <h1 className="text-center font-sans text-[2rem] leading-none tracking-[-0.03em] text-foreground">
        This is a locked case study.
      </h1>

      <form action={unlockCaseStudy} className="mt-8 grid gap-5">
        <input type="hidden" name="next" value={next} />
        <label className="sr-only" htmlFor="case-study-password">
          Password
        </label>
        <input
          id="case-study-password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Message me for the password"
          aria-invalid={error || undefined}
          aria-describedby={error ? "case-study-password-error" : undefined}
          className={`${fieldClass} placeholder:text-[#c4c4c4] dark:placeholder:text-[#6a6a6a]`}
        />
        {error ? (
          <p
            id="case-study-password-error"
            role="alert"
            className="-my-1 text-center text-body text-muted"
          >
            That password didn’t match. Try again.
          </p>
        ) : null}
        <button type="submit" className={`${fieldClass} cursor-pointer`}>
          Enter case study
        </button>
      </form>
    </section>
  );
}
