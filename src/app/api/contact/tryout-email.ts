import type { TryoutsFormData } from "@/features/tryouts/schema";

export function buildTryoutEmail(data: TryoutsFormData): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva solicitud de tryout — Crow 6 Esports</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#141414;border-top:3px solid #f5b800;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#f5b800;">
                CROW 6 ESPORTS
              </p>
              <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">
                NUEVA SOLICITUD
              </h1>
              <p style="margin:8px 0 0;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);">
                PROCESO DE SELECCIÓN — ROCKET LEAGUE
              </p>
            </td>
          </tr>

          <!-- Discord badge -->
          <tr>
            <td style="background:#f5b800;padding:16px 40px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0a0a0a;">
                CANDIDATO
              </p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#0a0a0a;">
                ${data.discord}
              </p>
            </td>
          </tr>

          <!-- Sección: Perfil -->
          <tr>
            <td style="background:#141414;padding:32px 40px 0;">
              <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#f5b800;border-bottom:1px solid rgba(245,184,0,0.2);padding-bottom:10px;">
                PERFIL BÁSICO
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#141414;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Fecha de nacimiento", data.birthDate)}
                ${row("País / Región", data.country)}
                ${row("Disponibilidad entre semana", data.availabilityWeekdays)}
                ${row("Disponibilidad fines de semana", data.availabilityWeekends)}
                ${row("Disponibilidad para scrims", data.availabilityScrims)}
              </table>
            </td>
          </tr>

          <!-- Sección: Técnico -->
          <tr>
            <td style="background:#1a1a1a;padding:32px 40px 0;">
              <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#f5b800;border-bottom:1px solid rgba(245,184,0,0.2);padding-bottom:10px;">
                DATOS TÉCNICOS
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#1a1a1a;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Rango actual 2v2", data.rank)}
                ${row("Peak MMR 2v2", data.peak)}
                ${row("Horas jugadas totales", String(data.hoursPlayed))}
                ${row("Estilo de juego", data.playstyle)}
                ${rowLink("RLTracker", data.rltracker)}
                ${data.highlights ? rowLink("Highlights", data.highlights) : ""}
              </table>
            </td>
          </tr>

          <!-- Sección: Mentalidad -->
          <tr>
            <td style="background:#141414;padding:32px 40px 0;">
              <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#f5b800;border-bottom:1px solid rgba(245,184,0,0.2);padding-bottom:10px;">
                MENTALIDAD Y EQUIPO
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#141414;padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Experiencia competitiva", data.hasCompetitiveExp === "yes" ? "Sí" : "No")}
                ${data.previousTeams ? row("Equipos anteriores", data.previousTeams) : ""}
                ${rowLong("Reacción ante errores de compañeros", data.reactionToMistakes)}
                ${row("Reacción ante derrotas", data.reactionToLosses)}
                ${rowLong("Qué busca en Crow 6", data.lookingFor)}
                ${row("Abierto a coaching / VOD reviews", data.openToCoaching === "yes" ? "Sí" : data.openToCoaching === "no" ? "No" : "Tal vez")}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0a;border-top:1px solid rgba(245,184,0,0.15);padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.2);">
                #GOCROWS · CROW 6 ESPORTS · HUESCA, ESPAÑA
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

function row(label: string, value: string): string {
    return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);">
          ${label}
        </p>
        <p style="margin:3px 0 0;font-size:14px;color:#ffffff;">
          ${value}
        </p>
      </td>
    </tr>
  `;
}

function rowLink(label: string, url: string): string {
    return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);">
          ${label}
        </p>
        <a href="${url}" style="margin:3px 0 0;display:block;font-size:14px;color:#f5b800;text-decoration:none;">
          ${url}
        </a>
      </td>
    </tr>
  `;
}

function rowLong(label: string, value: string): string {
    return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);">
          ${label}
        </p>
        <p style="margin:6px 0 0;font-size:14px;color:#ffffff;line-height:1.6;background:rgba(255,255,255,0.03);padding:10px 12px;border-left:2px solid #f5b800;">
          ${value}
        </p>
      </td>
    </tr>
  `;
}