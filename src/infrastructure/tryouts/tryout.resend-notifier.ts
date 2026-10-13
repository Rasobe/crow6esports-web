import { Resend } from "resend";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import { buildTryoutEmail } from "./tryout-email";

interface ResendTryoutNotifierConfig {
  apiKey: string;
  from: string;
  to: string;
}

export function createResendTryoutNotifier({
  apiKey,
  from,
  to,
}: ResendTryoutNotifierConfig): TryoutNotifier {
  const resend = new Resend(apiKey);

  return {
    async notify(application) {
      const { error } = await resend.emails.send({
        from,
        to,
        subject: `Tryout: ${application.discord}`,
        html: buildTryoutEmail(application),
      });

      if (error) throw new Error(`Resend rejected the tryout email: ${error.message}`);
    },
  };
}
