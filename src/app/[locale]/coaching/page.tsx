import { createGenerateMetadata } from "@/components/seo";
import { CoachingPage } from "@/features/coaching/components";

export const generateMetadata = createGenerateMetadata('coaching', '/coaching');

export default function Page() {
    return <CoachingPage />;
}
