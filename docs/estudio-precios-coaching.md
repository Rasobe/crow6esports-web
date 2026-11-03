# Estudio de precios de coaching

Fecha: noviembre de 2026. Los precios de mercado están en USD tal como los publican las fuentes; se usan como equivalentes aproximados de EUR, y la web cobra en EUR.

## 1. Mercado de coaching de Rocket League

| Concepto                                | Rango de mercado                                   | Fuente               |
| --------------------------------------- | -------------------------------------------------- | -------------------- |
| Sesión 1 a 1, coach típico              | 20 a 30 $/h                                        | WeCoach, GameTyrant  |
| Sesión 1 a 1, Champion a Grand Champion | 30 a 60 $/h                                        | Harmonicode (2026)   |
| Sesión 1 a 1, SSL / RLCS                | 75 a 150 $/h                                       | Harmonicode (2026)   |
| Marketplaces baratos                    | 10 a 20 $/h                                        | Fiverr, Upwork       |
| Revisión de replay (1 h)                | 15 a 25 $                                          | Metafy, BetterGamer  |
| Clases en grupo                         | 10 a 20 $ por persona y hora; 25 a 35 $ por semana | Harmonicode, WeCoach |
| Sesión de equipo (1 h)                  | 40 a 60 $ en Metafy, hasta 99,90 $ en BetterGamer  | Metafy, BetterGamer  |
| Plan mensual de equipo                  | 200 $ por 4 sesiones                               | Metafy               |
| Plan mensual individual                 | 90 a 100 $ por 4 a 6 sesiones                      | Metafy               |
| Descuento por volumen                   | 10 a 15 % con 3 sesiones, 20 a 25 % con 10 o más   | Harmonicode          |
| Comisión de las plataformas             | 20 a 30 %                                          | Harmonicode          |

Todos recomiendan una sesión de presentación gratuita, y avisan de desconfiar de quien garantice subir de rango.

## 2. Dónde estaban los precios

| Producto                         | Antes                    | Mercado                | Diferencia                  |
| -------------------------------- | ------------------------ | ---------------------- | --------------------------- |
| Pack individual Basic (4 h/mes)  | 27 € (6,75 €/h)          | 20 a 30 €/h            | unas 4 veces por debajo     |
| Pack individual Elite (12 h/mes) | 67 € (5,6 €/h)           | 20 a 30 €/h            | unas 4 veces por debajo     |
| Pack de equipo Basic (4 h/mes)   | 52 € (13 €/h por equipo) | 40 a 60 €/h por equipo | unas 3 a 4 veces por debajo |
| Sesión individual                | 12 €                     | 20 a 30 €              | casi la mitad               |
| Revisión de replay               | 6 €                      | 15 a 25 €              | menos de la mitad           |
| Sesión de equipo                 | 22 €                     | 40 a 60 €              | casi la mitad               |

Consecuencias de estar tan por debajo:

- Con 6.000 horas de juego y alumnos que alcanzan 2000+ de MMR, el precio no encaja con el nivel y resta credibilidad.
- Cada hora de un pack Elite deja menos de 6 € brutos, lo que no sostiene el servicio.
- El precio tachado (39, 69, 97 €) no se había cobrado nunca. En la UE los descuentos solo pueden referirse al precio más bajo de los 30 días anteriores (Directiva Omnibus), así que ese tachado es un riesgo legal.

## 3. Precios aplicados

Criterio: situarse en la parte baja del rango típico de mercado. Es un precio de entrada atractivo para llegar al máximo público, y el pack sigue compensando frente a las sesiones sueltas.

| Producto                            | Precio    | €/hora        | Referencia de mercado     |
| ----------------------------------- | --------- | ------------- | ------------------------- |
| Sesión de presentación (30 min)     | Gratis    |               | Estándar del sector       |
| Revisión de replay                  | 10 €      |               | 15 a 25 €                 |
| Sesión individual (1 h)             | 20 €      | 20            | 20 a 30 €/h               |
| Sesión de equipo (1 h)              | 35 €      | 35            | 40 a 60 €/h               |
| Individual Basic, 1 sesión/semana   | 49 €/mes  | 12,25         | 80 € en sesiones sueltas  |
| Individual Pro, 2 sesiones/semana   | 89 €/mes  | 11,1          | 160 € en sesiones sueltas |
| Individual Elite, 3 sesiones/semana | 129 €/mes | 10,75         | 240 € en sesiones sueltas |
| Equipo Basic, 1 sesión/semana       | 89 €/mes  | 22 por equipo | 200 $ en Metafy           |
| Equipo Pro, 2 sesiones/semana       | 159 €/mes | 19,9          |                           |
| Equipo Elite, 3 sesiones/semana     | 229 €/mes | 19,1          |                           |

Cómo se llega a cada cifra:

- **Escalera de entrada:** gratis, revisión de replay a 10 €, sesión suelta a 20 €, pack desde 49 €. Hay un escalón asequible para cada presupuesto.
- **Descuento de pack:** 39 %, 44 % y 46 % frente a comprar las mismas horas sueltas. Es más que el 20 a 25 % habitual porque el pack incluye objetivos, rutina, revisión entre sesiones y soporte.
- **Equipos:** cuestan 1,8 veces el pack individual. Con 3 jugadores salen a unos 30, 53 y 76 € por jugador y mes, en línea con las clases en grupo de mercado.
- **Sin precio tachado:** el campo `originalPrice` pasa a ser opcional y solo se muestra si el precio anterior se cobró de verdad.

## 4. Fuentes

- WeCoach: https://wecoach.gg/blog/article/how-much-does-rocket-league-coaching-cost
- Harmonicode (2026): https://harmonicode.com/2026/03/25/rocket-league-coaching-your-complete-guide-to-leveling-up-in-2026/
- GameTyrant: https://gametyrant.com/news/is-rocket-league-coaching-worth-it
- GG Clan: https://ggclan.com/rocket-league-coaching
- BetterGamer: https://bettergamer.com/rocket-league/coaching
- Metafy: https://metafy.gg/rocket-league

Los datos de marketplaces cambian y varían por coach; son una referencia, no una tarifa oficial.
