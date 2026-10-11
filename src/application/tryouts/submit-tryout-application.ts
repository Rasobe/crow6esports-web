import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";

export function submitTryoutApplication(
  notifier: TryoutNotifier,
  application: TryoutApplication,
): Promise<void> {
  return notifier.notify(application);
}
