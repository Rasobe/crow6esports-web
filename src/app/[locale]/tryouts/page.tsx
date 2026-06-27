import { createGenerateMetadata } from "@/components/seo/MetaTags";
import { TryoutsPage } from "@/features/tryouts";

export const generateMetadata = createGenerateMetadata("tryouts", "/tryouts");

export default function Page() {
  return <TryoutsPage />;
}
