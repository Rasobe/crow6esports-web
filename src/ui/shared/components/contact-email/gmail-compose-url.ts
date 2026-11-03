export function getGmailComposeUrl(email: string): string {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: email });
  return `https://mail.google.com/mail/?${params}`;
}
