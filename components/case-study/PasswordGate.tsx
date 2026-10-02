"use client";

import { unlockCaseStudy } from "@/app/actions/unlock";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useFormStatus } from "react-dom";

const WRONG_PASSWORD = "That password didn’t match. Try again.";
const EMPTY_PASSWORD = "Enter the password first";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-busy={pending}
      className="w-full rounded-[4px] border border-(--color-border) bg-transparent px-3 py-2 text-center text-body text-foreground transition-colors hover:bg-subtle"
    >
      {pending ? "Checking…" : "Enter case study"}
    </button>
  );
}

export function PasswordGate({
  next,
  error,
}: {
  next: string;
  error?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messageId = useId();
  const [message, setMessage] = useState(error ? WRONG_PASSWORD : "");

  useEffect(() => {
    if (error) setMessage(WRONG_PASSWORD);
  }, [error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const password = String(
      new FormData(event.currentTarget).get("password") ?? "",
    );
    if (password.length === 0) {
      event.preventDefault();
      setMessage(EMPTY_PASSWORD);
      inputRef.current?.focus();
    }
  }

  return (
    <section data-nav="light" className="mx-auto max-w-md py-32">
      <h1 className="font-display text-heading">This is a locked case study.</h1>

      <form
        action={unlockCaseStudy}
        noValidate
        onSubmit={handleSubmit}
        className="mt-4 grid gap-4"
      >
        <input type="hidden" name="next" value={next} />
        <div className="grid gap-2">
          <input
            ref={inputRef}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Message me for the password"
            aria-label="Password"
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            onChange={() => {
              if (message) setMessage("");
            }}
            className="w-full rounded-[4px] border border-(--color-border) bg-transparent px-3 py-2 text-body text-foreground outline-none placeholder:text-muted focus:border-(--color-foreground)"
          />
          {message ? (
            <p
              id={messageId}
              role="alert"
              aria-live="polite"
              className="text-cs-caption text-muted"
            >
              {message}
            </p>
          ) : null}
        </div>
        <SubmitButton />
      </form>
    </section>
  );
}
