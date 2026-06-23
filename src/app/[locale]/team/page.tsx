import { createGenerateMetadata } from "@/components/seo/MetaTags";
import { TeamPage } from "@/features/team";

export const generateMetadata = createGenerateMetadata("team", "/team");

export default function Page() {
  return <TeamPage />;
}
