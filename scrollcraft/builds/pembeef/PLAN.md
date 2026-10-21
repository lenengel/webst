# PEMBEEF Website, Plan (Stand 21.10.2026)

Zum Gegenlesen und Grillen. Details zu Fakten und Gefühlskurve stehen in `BRIEF.md`, die Aufnahmeliste in `DREHPLAN.md`.

## Ziel
Die neue Seite für pembeef.at beantwortet fünf Fragen in dieser Reihenfolge:
1. **WER** sind wir (Hof, Familie, Menschen)
2. **WOFÜR** stehen wir (Weide, Bio, Kreislauf)
3. **WAS** bekommt man (Qualität, Bio, Weiderind, Produkte)
4. **Partnerbetrieb** (Prannleithen, "Kuhhperation")
5. **WO** bekommt man es (d'Greisslerei, SPAR Yspertal, direkt, nächster Liefertermin)

## Entscheidungen bisher
| Thema | Entscheidung | Quelle |
|---|---|---|
| Logo | Stempel-Siegel unverändert | Lukas |
| Stil | erdig, Papier, Gras | Lukas |
| Struktur | Gang über den Hof, eine durchgehende Welt mit Karte als Navigation | Lukas |
| Bewegtbild | nur am eigenen Hof, sonst Fotos | Lukas |
| Prannleithen | Partnerfotos, Zustimmung liegt vor, Fotografen-Credits Pflicht | Lukas |
| Liefertermin | Variante A: nur anzeigen. Reservieren später | Lukas |
| Endpunkt | neuer öffentlicher `GET /api/public/next-delivery` (Weg 2), Branch `feat/public-next-delivery` in `lenengel/P` | Lukas |
| Kinder | nicht zeigen, nicht nennen. Hund Louis Larry darf rein | Lukas |
| Hofgründung | 1771 | Lukas |
| Stier | TORO | Lukas |

## Grammatik und Signature Move
- **Continuous world** (`data-sc-mode="worldflight"`). Die anderen sieben Grammatiken passen nicht (siehe Brief).
- Signature: der **Rinderpfad**, ein Faden über die Karte vom Hof über Prannleithen und Erlauf zu den Verkaufsstellen. Er endet im Liefertermin.
- **Risiko:** Worldflight ist die fragilste Grammatik. Ohne Bewegtbild lösen wir die Reise mit Fotoebenen und Parallax. Wenn das nicht trägt, wechsle ich auf **Chaptered editorial** und sage es offen.

## Stationen
1. Ankunft: Hof im Abendlicht, ohne Text (still)
2. Menschen: Julia, Lukas, Martha, Hermann, Louis Larry
3. Weide und Kreislauf (Peak, größte Scrollspanne): Gras, Rind, Mist, Gras
4. Prannleithen, "Kuhhperation": 10 bis 12 Monate alt hin, 5 bis 8 Monate Reifezeit, dann Kohl & Babinger in Erlauf
5. Auf den Tisch: Produkte, Qualität, Bio, Weiderind
6. Reservieren: nächster Liefertermin, d'Greisslerei, SPAR Yspertal, WhatsApp, Telefon, E-Mail

## Fotos
- Quelle Weide, Stall, Produkt: Google-Fotos-Album "PemBeef" (300 Bilder, per Link abrufbar).
- Quelle Porträts: Drive-Ordner "Shooting mit Manuel Tauber" (Fotograf: Manuel Tauber-Romieri, im EXIF). Dort ist die Datei nur für dich freigegeben. Ich kann sie nicht laden, bis du sie freigibst.
- Hundefoto: `louis.jpg` im Drive (nicht freigegeben) oder aus `D:\DEV\...\Hund`.
- Prannleithen: `D:\DEV\PEMBEEF_Website\Fotos\kuuhperation best of`, nicht erreichbar.
- Porträt-Ausschnitt aus dem Foto mit Lukas, T-Shirt-Logo mit dem echten SVG-Logo überlagert (kein KI-Bild).
- Bildnachweise stehen in einer eigenen Zeile am Seitenende, gelesen aus den Original-Metadaten.

## Technik
- Statische Seite aus echtem HTML, Engine `scrollcraft.js` unverändert, Tokens für Papier, Moos und Rinderrot.
- Liefertermin: `fetch` auf `/api/public/next-delivery` mit Ausweichtext bei Fehler.
- CORS: `CORS_ORIGIN` ist eine einzelne Adresse für das Admin-Panel. Die Website darf sie nicht ersetzen. Lösung: Der öffentliche Pfad antwortet für alle Herkunftsadressen (nur Lesen, ohne Cookies). Diese Anpassung ist noch **nicht** gebaut.
- Hosting: offen, Vorschlag Railway-Service neben dem Bestellsystem.
- Domain: `pembeef.at` läuft wieder (Lukas). Umstellung erst nach Freigabe.

## Prüfung (Pflicht vor Übergabe)
Scrollpositionen auf Desktop, Handy (390 px) und mit reduzierter Bewegung, Kontrast, Tastaturfokus, Kontaktbogen. Danach der Gefühlsvergleich aus `BRIEF.md`. Ich melde offen, was nicht prüfbar war (echtes iPhone).

## Was die Seite nicht tut
Keine erfundenen Zahlen, keine Preise (die in d'Greisslerei sind Händlerpreise), keine Kinder, keine Reservierung.

## Offene Fragen und Annahmen zum Grillen
1. Reicht eine fotobasierte Welt ohne Drohnenfilm, damit sie sich nach "Gang über den Hof" anfühlt?
2. Soll die Seite Preise oder nur "Pakete und Bestellung" zeigen?
3. Wer pflegt Texte, Termine und Fotos später? Das Bestellsystem liefert nur den Termin.
4. Soll die Seite nur Deutsch sein?
5. Was passiert mit `neu.` und `dev.` nach dem Livegang?
6. Datenschutz und Impressum: Wer liefert die Texte?
7. Brauchen wir einen Cookie-freien Aufbau (keine Analytics), oder ist Statistik gewünscht?
