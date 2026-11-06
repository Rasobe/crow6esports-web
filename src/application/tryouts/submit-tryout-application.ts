import type { SubmissionLocale, TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";

interface SubmitTryoutDeps {
  repository: TryoutRepository;
  notifier: TryoutNotifier;
  /** Called when the application is stored but the notification could not be sent. */
  onNotificationFailure: (error: unknown) => void;
}

/**
 * Stores the application first and only then notifies. A storage failure propagates and
 * skips the notification; a notification failure does not undo the stored application.
 */
export async function submitTryoutApplication(
  { repository, notifier, onNotificationFailure }: SubmitTryoutDeps,
  application: TryoutApplication,
  locale: SubmissionLocale,
): Promise<void> {
  await repository.save(application, locale);

  try {
    await notifier.notify(application);
  } catch (error) {
    onNotificationFailure(error);
  }
}
