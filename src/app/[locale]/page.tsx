import { HomePage } from "@/features/home";
import { createGenerateMetadata } from "@/components/seo/MetaTags";

export const generateMetadata = createGenerateMetadata("home", "");

export default function Page() {
  return <HomePage />;
}