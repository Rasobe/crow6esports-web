import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing env var: STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // The API version is pinned to ensure compatibility. Upgrade intentionally.
  apiVersion: "2026-05-27.dahlia",
  appInfo: {
    name: "CROW6 Esports Store",
    url: "https://crow6esports.com",
  },
});
