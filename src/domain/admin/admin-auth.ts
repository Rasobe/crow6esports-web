export interface AdminAuth {
  /** Email of the session, verified against the auth server (never trusted from the cookie alone). */
  getVerifiedEmail(): Promise<string | null>;
  /** Starts a session. Resolves false for any failure, without saying why. */
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): Promise<void>;
}
