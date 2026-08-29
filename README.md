# VISIONGUARD

AI-powered image quality and defect detection for the software internship assessment.

## Problem
VISIONGUARD accepts JPEG, PNG, and WebP images and produces an explainable quality decision: ACCEPTABLE, DEGRADED, or DEFECTIVE. It covers blur, underexposure, overexposure, noise, severe degradation/corruption evidence, and potential visual defects.

## Architecture
Browser pixel analysis → deterministic feature vector → pure-JavaScript learned classifier → issue heads → uncertainty → local anomaly map → quality score → Postgres/private object storage → REST JSON response.

The existing premium inspection UI was preserved. No external AI/vision API is used.

## Learned model
`quality-v1.0` is a multinomial logistic-regression classifier with six binary logistic issue heads. It uses 14 engineered features: sharpness, gradient, edge density, mean luminance, dark/bright ratios, luminance spread, dynamic range, high-frequency residual/noise, local variance, entropy, saturation, clipping ratio, and a blockiness proxy.

The runtime artifact is `lib/model.js`; compact metadata is `public/models/quality-v1.json`. The model uses training mean/std normalization and static module loading, so it is not retrained or reloaded per request.

## Dataset and evaluation
No clean natural-image corpus was present in the existing project, and Hatchable does not permit native Python CV/ML packages. The reproducible assessment experiment therefore uses 160 deterministic source feature profiles with seed 42024. Sources are split first: 112 train / 24 validation / 24 test. Eight conditions are then generated independently per source: clean, blur, underexposure, overexposure, noise, severe degradation, local defect, combined degradation.

The held-out test contains 24 unseen source profiles and 192 examples. This avoids source leakage.

### Measured metrics

| Split | Accuracy | Macro Precision | Macro Recall | Macro F1 |
|---|---:|---:|---:|---:|
| Validation | 0.9948 | 0.9972 | 0.9861 | 0.9915 |
| Test | 1.0000 | 1.0000 | 1.0000 | 1.0000 |

Issue-level test F1: blur 1.0000, underexposure 0.9796, overexposure 1.0000, noise 0.9787, corruption 1.0000, visual defect 0.8211.

**Qualification:** these are actual measurements from the executed deterministic trainer/evaluator, but the examples are synthetic feature-space data, not a natural-image benchmark. They must not be presented as real-world CV performance.

Reports: `public/reports/metrics.json`, `public/reports/confusion-matrix.json`, `public/reports/failure-cases.json`.

## Explainability and uncertainty
The response exposes feature values, learned class probabilities, issue confidence/severity, normalized class entropy, and feature-grounded explanations. Low confidence/high entropy produces `MANUAL REVIEW RECOMMENDED`.

The heatmap uses an 8×6 grid of local pixel measurements from the uploaded image: local luminance, sharpness proxy, and noise residual. It highlights the strongest regions and supports show/hide plus opacity control.

## API
- `GET /api/health`
- `POST /api/v1/analyze`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{id}`
- `GET /api/v1/analyses/{id}/heatmap`
- `POST /api/v1/analyze/batch` (up to 20)
- `GET /api/v1/model`
- `GET /api/v1/self-test` (owner/admin only)

FastAPI/Swagger is not used because this existing application is implemented directly on Hatchable's V8-isolate REST runtime. The routes return structured JSON and use explicit status codes.

## Validation and security
Maximum upload size is 8 MB and maximum analyzed dimensions are 16 million pixels. MIME type and file signatures are checked. JPEG requires SOI/EOI markers; PNG requires IHDR/IDAT/IEND markers; WebP requires RIFF/WEBP structure. Filenames are sanitized before storage keys are created. Raw image content is never logged.

## Persistence and storage
Postgres stores analysis metadata, scores, features, explanations, model version, timing, and storage keys. Images and heatmaps use private object storage. The database stores keys rather than expiring signed URLs.

## Batch
The existing upload surface now accepts multiple files, sends up to 20 images to the batch endpoint, returns aggregate counts, persists each successful analysis, refreshes history, and generates a CSV download in the browser.

## Local / platform run
The project runs natively on Hatchable. The platform provides static hosting, REST handlers, Postgres, and private storage. `window.__HATCHABLE__.api` is used by the frontend so no API host is hardcoded.

## Environment
The requested VITE_API_URL / DATABASE_URL / SUPABASE_* variables are not required in Hatchable because database and object storage are managed by the `hatchable` SDK. No server secret is embedded in browser code.

## Deployment
Deployed through Hatchable. The project is currently personal/private visibility; final public visibility is an owner-controlled Settings action. Hatchable does not support Docker build files, root-level `ml/`, or GitHub Actions workflow directories, so executable ML contracts are kept in `lib/` and evaluation reports in `public/reports/`.

## Known limitations
1. Server-side native pixel decoding is unavailable in the Hatchable isolate; the browser computes deterministic pixel features and sends them with the upload, while the server retains a byte-feature fallback.
2. The assessment experiment is synthetic feature-space data because no clean-image corpus was supplied and native Python ML packages are unavailable. Natural-image retraining is the most important next step.
3. The anomaly branch is a lightweight local evidence/distance map, not PatchCore or a deep embedding model.
4. Corruption handling covers signatures/structure and severe-degradation evidence; exhaustive codec validation would require a full decoder.
5. Docker, GitHub Actions, and a root `ml/` folder cannot be added to this Hatchable project because those paths/build systems are outside its supported filesystem/deployment model.

## Future improvements
Retrain on a legally usable natural-image dataset with source-level split, calibrate on a natural validation set, replace the lightweight anomaly branch with a compact pretrained embedding where deployment permits it, and package an external Docker/CI distribution outside Hatchable.

See `public/ASSESSMENT_CHECKLIST.md` for the requirement-by-requirement audit.