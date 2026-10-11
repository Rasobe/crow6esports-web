import type { TryoutApplication } from "./tryout-application";

export interface TryoutNotifier {
  notify(application: TryoutApplication): Promise<void>;
}
