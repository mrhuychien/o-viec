import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center px-4 py-10">
        <div className="sheet w-full max-w-md rounded-lg px-6 py-12">
          <div className="h-10 w-40 animate-pulse rounded-sm bg-muted" />
          <div className="mt-4 h-6 w-full animate-pulse rounded-sm bg-muted" />
        </div>
      </main>
    );
  }

  if (user) return <Navigate to="/" />;

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="sheet w-full max-w-lg rounded-lg px-6 py-10 md:px-10 md:py-12">
        <p className="font-display text-5xl leading-none text-foreground">Ô Việc</p>
        <p className="mt-4 text-2xl leading-snug text-pretty text-foreground">
          Sổ việc viết tay. Đăng nhập một lần, mở lại trên máy tính và điện thoại.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="flex min-h-14 w-full cursor-pointer items-center justify-center rounded-md bg-card px-4 text-2xl text-foreground shadow-[0_0_0_2px_var(--color-foreground)] transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.96]"
              >
                Tiếp tục với {p.label}
              </button>
            ))
          ) : (
            <p className="text-xl text-muted-foreground">Chưa bật đăng nhập.</p>
          )}
        </div>
      </div>
    </main>
  );
}
