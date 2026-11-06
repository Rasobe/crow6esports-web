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

Criterio: el precio regular se sitúa en la parte baja del rango de mercado, creíble para el nivel del coach. El precio de lanzamiento aplica un descuento visible (28 a 37 %) para que la oferta tenga urgencia y el "desde 39 €" quede por debajo de la barrera de los 40 €. El pack sigue compensando frente a las sesiones sueltas. Todas las cifras terminan en 9 (precio psicológico). Los precios de lanzamiento están vigentes hasta `LAUNCH_PRICE_ENDS`; después se cobra el precio regular.

| Producto                            | Lanzamiento | Regular   | €/hora (lanzamiento) | Referencia de mercado     |
| ----------------------------------- | ----------- | --------- | -------------------- | ------------------------- |
| Sesión de presentación (30 min)     | Gratis      | Gratis    |                      | Estándar del sector       |
| Revisión de replay                  | 9 €         | 9 €       |                      | 15 a 25 €                 |
| Sesión individual (1 h)             | 19 €        | 19 €      | 19                   | 20 a 30 €/h               |
| Sesión de equipo (1 h)              | 39 €        | 39 €      | 39                   | 40 a 60 €/h               |
| Individual Basic, 1 sesión/semana   | 39 €/mes    | 59 €/mes  | 9,75                 | 76 € en sesiones sueltas  |
| Individual Pro, 2 sesiones/semana   | 69 €/mes    | 109 €/mes | 8,6                  | 152 € en sesiones sueltas |
| Individual Elite, 3 sesiones/semana | 99 €/mes    | 149 €/mes | 8,25                 | 228 € en sesiones sueltas |
| Equipo Basic, 1 sesión/semana       | 79 €/mes    | 109 €/mes | 19,75 por equipo     | 200 $ en Metafy           |
| Equipo Pro, 2 sesiones/semana       | 129 €/mes   | 189 €/mes | 16,1 por equipo      | 312 € en sesiones sueltas |
| Equipo Elite, 3 sesiones/semana     | 189 €/mes   | 269 €/mes | 15,75 por equipo     | 468 € en sesiones sueltas |

Cómo se llega a cada cifra:

- **Escalera de entrada:** gratis, revisión de replay a 9 €, sesión suelta a 19 €, pack desde 39 €. Hay un escalón asequible para cada presupuesto.
- **Descuento de lanzamiento:** 34 %, 37 % y 34 % en individual, y 28 %, 32 % y 30 % en equipos, frente al precio regular.
- **Descuento de pack:** 49 %, 55 % y 57 % en individual, y 49 %, 59 % y 60 % en equipos, frente a comprar las mismas horas sueltas (precio de lanzamiento). Es más que el 20 a 25 % habitual porque el pack incluye objetivos, rutina, revisión entre sesiones y soporte.
- **Equipos:** cuestan unas 1,9 veces el pack individual. Con 3 jugadores salen a unos 26, 43 y 63 € por jugador y mes, en línea con las clases en grupo de mercado.
- **Margen:** durante el lanzamiento cada hora del pack Elite individual deja unos 8,25 € brutos, por debajo del mercado. Es temporal y con fecha de fin (`LAUNCH_PRICE_ENDS`); al terminar, la hora sube a unos 12,4 €.
- **Sin precio tachado propio:** el precio regular solo se muestra como referencia mientras dure el lanzamiento. En la UE un descuento solo puede referirse al precio más bajo de los 30 días anteriores (Directiva Omnibus), así que el precio regular debe cobrarse de verdad una vez termine el lanzamiento.

## 4. Fuentes

- WeCoach: https://wecoach.gg/blog/article/how-much-does-rocket-league-coaching-cost
- Harmonicode (2026): https://harmonicode.com/2026/03/25/rocket-league-coaching-your-complete-guide-to-leveling-up-in-2026/
- GameTyrant: https://gametyrant.com/news/is-rocket-league-coaching-worth-it
- GG Clan: https://ggclan.com/rocket-league-coaching
- BetterGamer: https://bettergamer.com/rocket-league/coaching
- Metafy: https://metafy.gg/rocket-league

Los datos de marketplaces cambian y varían por coach; son una referencia, no una tarifa oficial.
