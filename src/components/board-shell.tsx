"use client";

import { useEffect, useState } from "react";
import { BoardCanvas } from "@/components/board/board-canvas";
import { Dock, type DockKey } from "@/components/dock";
import { WorkDrawer } from "@/components/work-drawer";
import { WorkScene } from "@/components/work-scene";
import { InfoDrawer } from "@/components/info-drawer";
import { RealtimeProvider } from "@/components/multiplayer/realtime-context";
import { PresenceBadge } from "@/components/multiplayer/presence-badge";
import type { GithubStats } from "@/lib/github";

export function BoardShell({ github }: { github: GithubStats | null }) {
  const [active, setActive] = useState<DockKey | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [followingId, setFollowingId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onToggle = (k: DockKey) => {
    setActive((prev) => (prev === k ? null : k));
  };

  const close = () => setActive(null);

  return (
    <RealtimeProvider>
      <BoardCanvas
        github={github}
        dimmed={active !== null}
        followingId={followingId}
        onFollowChange={setFollowingId}
      />
      <Dock active={active} onToggle={onToggle} />
      {isMobile ? (
        <WorkDrawer open={active === "work"} onClose={close} />
      ) : (
        <WorkScene open={active === "work"} onClose={close} />
      )}
      <InfoDrawer
        kind={
          active === "about" || active === "now" || active === "contact"
            ? active
            : null
        }
        onClose={close}
      />
      <PresenceBadge
        followingId={followingId}
        onSelect={(id) =>
          setFollowingId((cur) => (cur === id ? null : id))
        }
      />
    </RealtimeProvider>
  );
}
