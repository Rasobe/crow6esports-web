import { TryoutsClosed } from "./tryouts-closed";
import { TryoutsOpen } from "./tryouts-open";

export function TryoutsPage() {
    const isOpen = process.env.NEXT_PUBLIC_TRYOUTS_OPEN === "true";

    return isOpen ? <TryoutsOpen /> : <TryoutsClosed />;
}