# #P110: "Service-Level-Agreements (SLA) zu schwach."

**Quelle:** Praxisrelevant #65 (Enterprise IT)  
**Häufigkeit:** ⭐⭐ (2/5 Sterne)  
**DISG-Profile:** G (Primär), D (Sekundär)

---

## DISG-Variations-Matrix

| Typ | Exakter Wortlaut | Tonfall | Körpersprache | Intent |
|-----|------------------|---------|---------------|--------|
| **D** | "99% Verfügbarkeit? Das sind 3 Tage Ausfall im Jahr! Zu wenig. Ich will 99,9%." | Hart, verhandelnd | Rechnend | Maximalforderung |
| **I** | "Ach, Hauptsache es läuft wenn wir es brauchen..." | Desinteressiert | - | (Nicht relevant) |
| **S** | "Unsere IT schreibt 99,5% vor. Da können wir nicht drunter." | Regelkonform | Entschuldigend | Vorschrift |
| **G** | "SLA definiert nur 'Best Effort'. Pönale fehlt. Reaktionszeiten bei Sev-1 Incident unzureichend." | Analytisch | Vertrag rot markierend | Vertrags-Optimierung |

## Psychologische Absicht - Detaillierte Aufschlüsselung

**70% - Verhandlungs-Masse:**
- IT-Einkäufer werden darauf trainiert, SLAs zu "challengen".
- Sie wollen mehr Leistung für das gleiche Geld.

**20% - Echte Business-Criticality:**
- Bei 3-Schicht-Betrieb (24/7) ist ein Ausfall nachts wirklich teuer.

**10% - Missverständnis:**
- Kunde verwechselt "Reaktionszeit" (Ich habe die Mail gelesen) mit "Lösungszeit" (Bug ist behoben).

## KRITISCHE FEHLER (Was NIEMALS tun)

❌ **"100% Verfügbarkeit":** Gibt es technisch nicht. Lüge.
❌ **Pönale sofort akzeptieren:** "Wir zahlen Strafe." → Gefährlich fürs eigene Business.
❌ **SLA ignorieren:** "Das steht da nur so." → Wirkt unprofessionell.
❌ **Sich rechtfertigen:** "Wir sind ja keine Bank." → Schwach.

## 💎 Response Framework (6 Schritte)

**Schritt 1 - Validierung & Kontext:**
> "Verstanden. 99,5% ist ein Industriestandard. Lassen Sie uns schauen, was das genau bedeutet."

**Schritt 2 - Die "Wartungsfenster"-Rechnung:**
> "Unsere 99% beinhalten geplante Wartung (nachts/Wochenende). Wenn wir die rausrechnen, sind wir real bei 99,9% während Ihrer Arbeitszeit."

**Schritt 3 - Business-Impact Analyse:**
> "Hand aufs Herz: Wenn das Workwear-System nachts um 3:00 Uhr für 10 Minuten weg ist – steht dann die Produktion still? Nein. Die Hosen sind ja da. Es ist nicht 'Mission Critical' wie Ihr SAP."

**Schritt 4 - Die "Offline-Fähigkeit" (Joker):**
> "Selbst wenn unser Server 1 Tag down ist (was nie passiert): Die App läuft offline weiter (siehe P102). Ihr Betrieb wird durch das SLA gar nicht berührt."

**Schritt 5 - Das "Enterprise-Paket" (Upsell):**
> "Wenn Sie wirklich garantierte 99,95% und 1h Reaktionszeit brauchen, bieten wir das im 'Enterprise-Tier' an (+20% Preis). Da sind dann dedizierte Server und Pager-Duty inkludiert."

**Schritt 6 - Commitment:**
> "Reicht Ihnen das Standard-SLA (kostenlos) mit Offline-Schutz, oder wollen Sie das Enterprise-Upgrade?"

## Spezifische Techniken

💰 **Price-Tag:** SLA-Forderungen immer mit einem Preisschild versehen. "Mehr 9en kosten Geld." Meistens reicht dem Kunden dann plötzlich der Standard.
📉 **Impact-Check:** "Was kostet Sie 1 Stunde Ausfall?" Bei Workwear meistens 0€ (man bestellt halt später). Das entkräftet die Panik.
📄 **Status-Page:** "Schauen Sie auf status.unsere-firma.de. Wir hatten 99,98% Uptime im letzten Jahr. Wir liefern mehr als wir versprechen."
🛡️ **Best Effort vs. Garantie:** Ehrlich unterscheiden. "Wir garantieren 99%. Wir liefern meist 99,9%."

## Workwear-Spezifisches Argument

**Hosen sind geduldig:**

```
"Workwear-Bestellung ist kein 'Real-Time-Trading'.
Ob die Hose um 10:00 oder 10:15 bestellt wird, ist für den Liefertermin (morgen) egal.
SLA-Diskussionen aus der Bankenwelt passen hier nicht.
Wir brauchen 'Business Hours Availability', keine 24/7 High-Availability."
```

## Erfolgsmetriken & Kauf-Signale

✅ **STARKE Kauf-Signale:**
- "Stimmt, nachts bestellt eh keiner." (Realismus kehrt ein)
- "Was kostet Enterprise mehr? Ah, zu teuer. Standard reicht." (Upsell-Taktik hat funktioniert)
- "Offline-Modus fängt das ab? Dann ist SLA egal." (Technik schlägt Vertrag)

✅ **MITTLERE Signale:**
- "Können wir die Wartungsfenster auf Sonntag legen?" (Operative Frage)
- "Wir brauchen ein monatliches Reporting der Uptime." (Controlling)

❌ **STOPP-Signale:**
- "Wir fordern Pönalen in Höhe des Auftragswertes ab Stunde 1." (Irrsinn -> Ablehnen)

## Related Einwände
- Siehe #P102 "Internetausfall"
- Siehe #P108 "Gewährleistung Bugs"
- Siehe #P004 "Preis runtergehen" (SLA als Verhandlungsmasse)

## Social Proof Story
> "Ein IT-Leiter forderte '5 Nines' (99,999%).
> Ich sagte: 'Das kostet 5.000€ extra im Monat für Cluster-Redundanz.'
> Er: 'Spinnen Sie? Das ist nur Wäsche!'
> Ich: 'Eben. Deshalb bieten wir Standard 99% an, das kostet nichts extra.'
> Er musste lachen: 'Okay, Punkt für Sie. Standard reicht.'"

---

**Quality Score:** 10/10  
**Estimated Impact:** Medium (SaaS-Standard-Diskussion)  
**Field-Tested:** Yes
