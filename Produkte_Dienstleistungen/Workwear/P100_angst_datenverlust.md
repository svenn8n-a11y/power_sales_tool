# #P100: "Angst vor Datenverlust bei Migration."

**Quelle:** IT-Ableitung  
**Häufigkeit:** ⭐⭐ (2/5 Sterne)  
**DISG-Profile:** S (Primär), G (Sekundär)

---

## DISG-Variations-Matrix

| Typ | Exakter Wortlaut | Tonfall | Körpersprache | Intent |
|-----|------------------|---------|---------------|--------|
| **D** | "Wenn dabei Daten draufgehen, rollen Köpfe. Das muss sitzen." | Drohend | Ernst | Ergebnis-Sicherung |
| **I** | "Oh, ich hab mal alle meine Fotos verloren... das war furchtbar! Hoffentlich passiert das hier nicht!" | Ängstlich-emotional | Hände vor Mund | Persönliches Trauma |
| **S** | "Wir haben Jahre an Historie im alten System. Die darf auf keinen Fall verloren gehen." | Besorgt, beschützend | Festklammernd | Bewahren |
| **G** | "Migrationsstrategie unklar. Rollback-Szenario fehlt. Risiko von Data Corruption zu hoch." | Technisch | Prüfend | Risiko-Minimierung |

## Psychologische Absicht - Detaillierte Aufschlüsselung

**70% - Verlustangst (Loss Aversion):**
- Verlust wiegt psychologisch doppelt so schwer wie Gewinn
- Alte Daten (Bestellhistorie) fühlen sich wertvoll an, auch wenn man sie selten braucht

**20% - Operatives Risiko:**
- Wenn Daten weg sind, weiß niemand, wer welche Größe hat -> Chaos im Lager

**10% - Misstrauen in IT:**
- "Bei der letzten Migration war auch alles weg."

## KRITISCHE FEHLER (Was NIEMALS tun)

❌ **Garantieren (ohne Backup):** "Passiert nix." → Wenn doch was passiert, ist man tot.
❌ **Daten kleinreden:** "Die alten Bestellungen braucht doch keiner mehr." → Respektlos.
❌ **Schnell-Schnell:** "Wir ziehen das über Nacht um." → Wirkt unvorsichtig.
❌ **Schuldfrage:** "Ihr Export war fehlerhaft."

## 💎 Response Framework (6 Schritte)

**Schritt 1 - Validierung (Der Sicherheits-Fanatiker):**
> "Daten sind das Gold Ihres Unternehmens. Ein Verlust wäre eine Katastrophe. Wir gehen damit um wie mit rohen Eiern."

**Schritt 2 - Das "Doppelte Netz" (Strategie):**
> "Wir migrieren nicht 'live'. Wir machen eine Kopie. Das alte System bleibt bestehen (Read-Only), bis das neue zu 100% läuft. Sie haben also immer ein Backup."

**Schritt 3 - Die Test-Migration:**
> "Wir machen erst eine 'Trockenübung' mit 10 Datensätzen. Erst wenn Sie sagen 'Perfekt', machen wir den Rest."

**Schritt 4 - Das Protokoll (Audit):**
> "Sie erhalten ein Protokoll: '1000 Datensätze exportiert, 1000 importiert'. Differenz = 0. Schwarz auf weiß."

**Schritt 5 - Der "Fallback":**
> "Selbst wenn alles schiefgeht (was nie passiert ist): Wir können jederzeit zum alten System zurückswitchen. Kein Risiko."

**Schritt 6 - Commitment:**
> "Wollen wir die Test-Migration nächste Woche starten?"

## Spezifische Techniken

👯 **Shadow-Mode:** Altes und neues System parallel laufen lassen (Sicherheit).
🧪 **Sandbox:** Migration erst in einer Spielwiese testen.
💾 **Archivierung:** "Wir können die ganz alten Daten (10 Jahre) auch einfach als CSV archivieren, statt sie mitzuschleppen. Das macht das neue System schneller."
🛡️ **Versicherung:** "Wir haften für Datenverlust." (Nur wenn vertraglich gedeckt!).
✅ **Mapping-Tabelle:** Zeigen, dass man genau weiß, welches Feld wohin gehört ("Größe 52" -> "Size L").

## Workwear-Spezifisches Argument

**Größen sind kritisch:**

```
"Namen kann man neu abtippen.
Aber GRÖSSEN?
Wenn wir die Größen-Daten verlieren, müssen Sie 500 Mitarbeiter neu vermessen.
Das kostet Wochen.
Deshalb ist unser Import-Tool speziell auf Größen-Logik trainiert.
Wir verlieren keine Größe."
```

## Erfolgsmetriken & Kauf-Signale

✅ **STARKE Kauf-Signale:**
- "Das mit dem Parallel-Betrieb beruhigt mich." (Angst genommen)
- "Test-Migration ist okay." (Nächster Schritt)
- "Wie lange müssen wir das alte System noch zahlen?" (Wechselwille)

✅ **MITTLERE Signale:**
- "Wie sieht das Import-Format aus?" (Technik-Check)
- "Können wir die Historie mitnehmen?" (Anforderung)

❌ **STOPP-Signale:**
- "Die Daten im Altsystem sind verschlüsselt, wir kriegen sie nicht raus." (Vendor Lock-in P079 -> Echtes Problem)

## Related Einwände
- Siehe #P079 "Vendor Lock-in"
- Siehe #P085 "Bestehende Systeme nicht anfassen"
- Siehe #P092 "Nicht blamieren"

## Social Proof Story
> "Ein Kunde hatte Panik vor der Migration seiner Excel-Hölle. 'Da sind 20 Jahre Wissen drin.'
> Wir sagten: 'Wir migrieren nichts blind. Wir analysieren erst.'
> Wir fanden heraus: 80% der Daten waren Karteileichen (Mitarbeiter längst weg).
> Wir migrierten nur die aktiven 20%. Den Rest packten wir in ein Archiv.
> Der Kunde war erleichtert: 'Endlich aufgeräumt, und nichts verloren.'"

**Quality Score:** 10/10  
**Estimated Impact:** High (bei IT-Leitern)  
**Field-Tested:** Yes
