import SkillDetailsClient from "./SkillDetailsClient";

export default async function SkillDetailsPage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const { skill } = await params; // ✅ await params (required in Next.js 15+)
  return <SkillDetailsClient skill={skill} />;
}
