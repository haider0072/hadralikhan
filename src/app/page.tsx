import { BoardCanvas } from "@/components/board/board-canvas";
import { SeoContent } from "@/components/board/seo-content";
import { getGithubStats } from "@/lib/github";

export const revalidate = 1800;

export default async function Home() {
  const github = await getGithubStats().catch(() => null);
  return (
    <>
      <SeoContent />
      <BoardCanvas github={github} />
    </>
  );
}
