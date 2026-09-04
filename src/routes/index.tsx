import { createFileRoute } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Board } from "@/components/board";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="flex min-h-dvh flex-col bg-background px-4 py-4 text-foreground md:px-6">
        <p className="font-display text-4xl leading-none md:text-5xl">Ô Việc</p>
        <p className="mt-1 text-lg text-muted-foreground">Đang mở sổ…</p>
        <div className="board-flow mt-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="sheet min-h-80 animate-pulse rounded-lg md:min-h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return <RedirectToSignIn />;
  return <Board />;
}
