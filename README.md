# GateSignal

Explainable container triage with human control. InnovateLA 2026, Ports & Logistics.

## Run the demo

Open `index.html` in a browser. No installation, keys or internet connection is required for the application itself. The optional NSF source link requires internet. The submission folder also contains an all-in-one offline HTML copy.

To serve locally, run `python3 -m http.server 8765 --directory .` and visit `http://localhost:8765`.

## Runtime and design

- `engine.js`: deterministic assessment, synthetic fixtures, toy throughput model and unit normalization.
- `app.js`: editable evidence, daily/crisis modes, regional profiles, human decision recording and JSON export.
- `index.html`, `style.css`: responsive interface and final Twist documentation.
- `engine.test.cjs`: meaningful policy, capacity and conversion checks; run with `node engine.test.cjs`.
- The full submission package includes test evidence and artifact-authoring scripts. They are not needed to run the app.

## Policy assumptions

Customs hold or unknown clearance blocks exit review eligibility. Invalid/missing numerical evidence and evidence older than 30 minutes also block eligibility. Empty-container weight conflict means measured gross exceeds tare plus 1,000 kg. Other weight conflicts exceed max(1,000 kg, 15% of declared gross). A reefer above its cargo demo limit gets urgent care priority without removing exit constraints.

Review priority points: waiting age contributes min(20, floor(wait minutes / 10)); non-clear customs +35; invalid evidence +40; stale evidence +25; weight conflict +30; warming reefer +50. This is an explainable demo ordering, not a calibrated risk probability. Blocked cases can be high-priority for human care even though they cannot exit.

## Model limits

All 100 containers are assumed available at time zero, with 3 minutes of exit service per container per lane. Strict FIFO stops at the first blocked container. Triage filters eligible containers and sorts by review priority. Counts are potential exits after human approval; the simulation never executes a release. The deliberately restrictive baseline can exaggerate gains over real operations. Holding/powered-bay capacity, staffing, travel, inspection queues, costs and emissions are not modeled. No real-world savings are claimed.

## Data and records

The fixture is entirely synthetic. There is no Terminal49/API/customs integration or model-service dependency. Regional profiles change labels, unit presentation and audit time display; canonical values remain kg/°C. They are not jurisdiction-specific compliance rules. The in-memory log disappears on close/reload/reset; export JSON before doing so. Evidence edits do not transfer prior approvals. Exported logs are demonstrations, not tamper-proof operational records.

## Responsible use

Misuse could include unjustified holds or treating advice as customs authority. Demo safeguards include simulated-data labels, mandatory rationale, restricted exit-approval blocking and no physical control connection. Production use needs authenticated sources, access control, durable audit and local workflow validation.

## AI and other tools disclosure

OpenAI Codex/ChatGPT assisted with code, test design, writing and artifact preparation. Playwright/Chrome were used for browser testing and capture; OpenAI Artifact Tool for slide authoring/rendering; ReportLab, pypdf and pypdfium2 for PDF handling. No IBM Bob use is claimed.

## Twist sources

The updated organizer instructions say to incorporate twists into the final submission rather than submit a separate answer. Twist 1 funding is proposed, not secured; NSF eligibility and genuine technical novelty must be established. Twist 2 demonstrates Singapore portability with units/time zones, not a validated deployment. Twist 3 is the accompanying poster.
