import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, gamertag, role, message } = await req.json();

    await resend.emails.send({
      from: FROM_EMAIL,
      to: "tryouts@crow6esports.com",
      subject: `[Tryout] ${gamertag} — ${role}`,
      text: `Nombre: ${name}\nEmail: ${email}\nGamertag: ${gamertag}\nRol: ${role}\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
