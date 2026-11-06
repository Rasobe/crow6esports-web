import { ADMIN_HOME_PAGE, ADMIN_LOGIN_PAGE } from "@/domain/admin/admin-access";
import type { RateLimiter } from "@/infrastructure/http/rate-limiter";
import { isSameOriginStrict, readFormFields, redirectTo } from "./admin-request";
import { loginSchema } from "./admin-schemas";

interface LoginHandlerDeps {
  limiter: RateLimiter;
  signIn: (email: string, password: string) => Promise<boolean>;
}

/** Same message for a wrong password, an unknown account and a non-admin account. */
const failure = (reason?: "rate_limited") =>
  redirectTo(reason ? `${ADMIN_LOGIN_PAGE}?error=${reason}` : `${ADMIN_LOGIN_PAGE}?error=1`);

export function createLoginHandler({ limiter, signIn }: LoginHandlerDeps) {
  return async (request: Request, clientAddress: string): Promise<Response> => {
    if (!isSameOriginStrict(request)) return failure();

    // Every attempt counts, whether or not the credentials turn out to be valid
    if (limiter.hit(clientAddress) > 0) return failure("rate_limited");

    const fields = await readFormFields(request);
    const parsed = loginSchema.safeParse(fields);
    if (!parsed.success) return failure();

    const signedIn = await signIn(parsed.data.email, parsed.data.password).catch(() => false);
    return signedIn ? redirectTo(ADMIN_HOME_PAGE) : failure();
  };
}
