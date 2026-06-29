import { PageHeader } from "@/components/ui";
import { TryoutsForm } from "./components";

export async function TryoutsOpen() {
    return (
        <main className="tryouts-open">
            <PageHeader namespace="tryouts.open" />

            <div className="tryouts-open__inner">
                <TryoutsForm />
            </div>
        </main>
    );
}