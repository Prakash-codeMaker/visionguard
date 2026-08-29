# VISIONGUARD

VISIONGUARD is a local, explainable image-quality inspection system built for the Software Internship Assessment. It accepts JPEG, PNG, and WebP images and returns a learned quality decision: `ACCEPTABLE`, `DEGRADED`, or `DEFECTIVE`, together with issue probabilities, uncertainty, statistics, localization evidence, and an explanation.

## 1. Problem

Image-quality review is often treated as a binary pass/fail task. VISIONGUARD instead exposes the evidence behind the decision: sharpness, exposure, noise, texture, color/clipping, learned class probabilities, issue heads, uncertainty, and suspicious local regions.

## 2. Design goals

- Real learned ML decision component, not a collection of threshold-only rules.
- No hosted vision API in the image-quality decision path.
- CPU-first inference inside Hatchable's V8 JavaScript runtime.
- Evidence-grounded explanations.
- Persistent results and private object storage.
- Honest separation between controlled synthetic evaluation and natural-image validation.
- Preserve the existing premium inspection UI rather than rebuilding the product.

## 3. Architecture

`Browser decode/pixel sampling → 14-feature vector + 8×6 local grid → learned quality classifier → six learned issue heads → uncertainty → feature-based local anomaly analysis → deterministic quality score → explanation → PostgreSQL + private storage`

The browser performs pixel decoding because the Hatchable server isolate does not provide the original Python/OpenCV/PyTorch environment. The server validates the uploaded bytes, runs the learned classifier, creates the heatmap, persists the result, and returns structured JSON.

The deployed Hatchable implementation uses a pure-JavaScript learned classifier because the Hatchable runtime does not provide the original Python/PyTorch execution environment.

## 4. Detection methods

Mandatory detection branches:

1. Blur / insufficient sharpness
2. Underexposure
3. Overexposure
4. Image noise
5. Severe degradation / corruption evidence
6. Potential visual defect

The first five are supported by learned issue heads and image statistics. Visual-defect evidence combines the learned visual-defect head with a lightweight local feature anomaly branch.

## 5. Feature engineering

The model uses 14 features. Each has a defined role:

- `sharpness` — high-frequency/local difference sharpness proxy.
- `gradient` — normalized local gradient energy.
- `edge_density` — proportion of strong local gradients.
- `mean_luminance` — average image brightness.
- `dark_ratio` — pixels near the dark end.
- `bright_ratio` — pixels near the bright end.
- `luma_std` — luminance spread / contrast proxy.
- `dynamic_range` — observed luminance range.
- `noise_residual` — neighbor-prediction residual proxy.
- `local_variance` — local texture/noise variation.
- `entropy` — 16-bin luminance entropy proxy.
- `saturation` — normalized RGB saturation statistic.
- `clipping_ratio` — exact channel-endpoint clipping evidence.
- `blockiness` — lightweight block/discontinuity proxy.

No feature was added solely to increase the feature count.

## 6. Learned model

Current artifact: `quality-v2.0`.

Classifier: multinomial logistic regression for the three quality classes plus six binary logistic regression issue heads.

Issue heads:

- blur
- underexposure
- overexposure
- noise
- corruption
- visual_defect

The final decision uses learned class probabilities and learned issue probabilities. The application does not implement the core decision as a simple `if blur > threshold` rule.

Model artifact: `lib/model.js`.

Metadata artifact: `public/models/quality-v2.json`.

Feature schema version: `features-v1`.

The model is statically loaded once per isolate and performs CPU inference without an external AI/vision service.

## 7. Data generation

The executable deterministic generator is `lib/mlRuntime.js`.

It creates 160 source profiles with a fixed seed (`42024`). Source profiles are assigned to train/validation/test **before** variants are generated:

- 112 training source profiles
- 24 validation source profiles
- 24 test source profiles

Each source profile receives eight independently generated conditions:

- clean
- blur
- underexposure
- overexposure
- noise
- severe degradation
- local defect
- combined degradation

Each non-clean condition uses low, medium, and high severity levels. Combined examples contain multiple degradation signals. The generator adds bounded variation so that the classifier cannot simply memorize one feature value for one class.

Total generated examples: 1,280.

Train: 896. Validation: 192. Test: 192.

Because the source profile is split before variants are created, test variants cannot share their source profile with training variants.

## 8. Evaluation methodology

The evaluation is executed by the deployed pure-JavaScript trainer/evaluator in `lib/mlRuntime.js`, exposed through `/api/v1/evaluate`.

The test set contains 24 unseen source profiles and 192 examples.

### Synthetic controlled evaluation

This is a controlled feature-space experiment. It is useful for verifying that the learned model responds to the intended degradation distributions, but it is **not** a natural-image benchmark and must not be presented as real-world CV performance.

Current held-out test results:

| Metric | Test |
|---|---:|
| Accuracy | 0.8958 |
| Macro precision | 0.9451 |
| Macro recall | 0.8002 |
| Macro F1 | 0.8560 |

Validation:

| Metric | Validation |
|---|---:|
| Accuracy | 0.9115 |
| Macro precision | 0.9296 |
| Macro recall | 0.8477 |
| Macro F1 | 0.8831 |

### Issue-level test F1

| Issue | F1 |
|---|---:|
| Blur | 0.9744 |
| Underexposure | 0.9573 |
| Overexposure | 1.0000 |
| Noise | 0.8846 |
| Corruption | 0.7925 |
| Visual defect | 1.0000 |

The main measured weakness is recall for corruption and noise, plus boundary confusion between acceptable/degraded and degraded/defective.

Reports:

- `public/reports/metrics.json`
- `public/reports/confusion-matrix.json`
- `public/reports/failure-cases.json`

## 9. Failure cases

The evaluator automatically retains the lowest-confidence and incorrect held-out cases. Examples show that uncertainty rises around mild degradation and combined cases near class boundaries.

The application does not hide these cases. They are used to justify manual review rather than being converted into arbitrary hard-coded decisions.

## 10. Explainability

Every result exposes:

- learned class probabilities
- issue probabilities
- severity
- confidence
- uncertainty
- image statistics
- feature values
- feature-grounded explanation
- local anomaly regions
- model version
- inference duration

Explanations are generated from actual measured features. No generic hosted LLM is used to invent the analysis narrative.

## 11. Heatmap / localization

The heatmap uses an 8×6 local grid. Each tile contains local luminance, sharpness, noise-residual, and gradient evidence. Suspicious tiles are ranked by a deterministic feature-based anomaly score.

This is deliberately described as **feature-based visual anomaly analysis**, not deep anomaly detection or PatchCore.

The UI supports:

- original image
- heatmap overlay
- show/hide
- opacity slider
- evidence-based localization text

## 12. Uncertainty

Class probability entropy is normalized to `[0,1]`.

The UI exposes:

- confidence
- uncertainty
- `LOW`, `MODERATE`, or `HIGH` uncertainty
- `MANUAL REVIEW RECOMMENDED` for ambiguous distributions

This prevents a high-confidence-looking label from hiding an uncertain probability distribution.

## 13. Quality score

The 0–100 score combines learned issue probabilities, learned defective-class probability, and severity-weighted evidence. The label is reconciled with the resulting score so the system does not intentionally report contradictory combinations such as a very low score with `ACCEPTABLE`.

## 14. Batch analysis

Batch analysis supports up to 20 images and persists successful results.

The UI reports:

- total
- acceptable
- degraded
- defective
- filename
- score
- label
- confidence
- uncertainty
- processing time
- issues

A CSV is generated from the returned persisted analysis results.

## 15. Analysis history

PostgreSQL persists the analysis record. History includes filename, timestamp, score, label, top issue, confidence, and processing time. Selecting a historical row retrieves the stored record and private storage references rather than recomputing the result.

## 16. Database

The existing `analyses` table is preserved. Stored fields include:

- analysis id
- created timestamp
- filename
- quality score / label
- six issue scores
- confidence / uncertainty
- uncertainty label
- image statistics JSON
- feature vector JSON
- explanation JSON
- model version
- processing time
- image storage key
- heatmap storage key

## 17. Storage

Hatchable private object storage contains uploaded originals and generated heatmaps. PostgreSQL stores stable storage keys rather than expiring signed URLs.

No persistent local runtime filesystem is required.

## 18. Validation / security

The upload pipeline checks:

- JPEG / PNG / WebP MIME type
- file signatures
- empty files
- 8 MB maximum size
- 16 million pixel maximum dimensions when browser dimensions are supplied
- sanitized storage filenames

Invalid signatures and unsupported MIME types are rejected with explicit error status codes.

A full codec decoder is not available in the Hatchable isolate, so exhaustive malformed-codec validation is a known limitation.

## 19. API

- `GET /api/health`
- `POST /api/v1/analyze`
- `GET /api/v1/analyses`
- `GET /api/v1/analyses/{id}`
- `GET /api/v1/analyses/{id}/heatmap`
- `POST /api/v1/analyze/batch`
- `GET /api/v1/model`
- `GET /api/v1/evaluate`
- `GET /api/v1/self-test` — owner/admin only
- `GET /api/v1/retrain` — owner/admin only, reproducibility artifact generation

API reference: `public/api-docs.html`.

## 20. Natural-image validation

Three unseen natural photographs were imported for a separate sanity-check workflow:

- `public/samples/natural-cat.jpg`
- `public/samples/natural-classroom.jpg`
- `public/samples/natural-landscape.jpg`

The first two are public-domain releases. The landscape source is CC0. The application includes `public/natural-eval.html`, which creates controlled clean/blur/dark/overexposed/noisy/defect transformations in the browser and sends them through the same deployed API.

**Status: NOT EMPIRICALLY COMPLETED IN THIS BUILD.** The Hatchable browser farm returned a `session not found or expired` error while attempting to run the page automatically. Therefore no natural-image accuracy number is stored or claimed. The page is present for manual evaluator execution.

This distinction is intentional: the natural-image workflow exists, but an unexecuted benchmark is not reported as a result.

## 21. Performance

The deployed pure-JavaScript trainer/evaluator completed the 1,280-example controlled training/evaluation run in roughly 0.5–0.6 seconds during direct Hatchable execution. Image inference in prior endpoint smoke tests was roughly 130–160 ms for the browser-supplied feature path.

The model is loaded as a static module. Very large images are downsampled in the browser before feature extraction, while original dimensions are retained for reporting.

## 22. Automated testing

`GET /api/v1/self-test` currently runs 17 assertions covering feature extraction, model version, clean inference, all six issue sensitivities, probability normalization, uncertainty bounds, score consistency, local anomaly grid, heatmap generation, invalid uploads, unsupported types, and database connectivity.

Latest direct run: **17/17 PASS**.

Route-level smoke tests are also executed directly through the Hatchable function runner during deployment verification.

## 23. Logging

Successful analysis logs contain structured event data with request id, model version, label, and processing time. Raw image content is never logged.

## 24. Deployment

Current deployment target: Hatchable V8 + PostgreSQL + private storage.

The current project is personal/private visibility. Hatchable's owner-controlled Settings must be used if the evaluator needs public anonymous access.

Docker/Compose and GitHub Actions are not claimed as runnable Hatchable artifacts because the platform's supported project filesystem does not expose the required root `.github/` or Docker build/runtime workflow. No unsupported Docker/CI artifact is presented as tested.

## 25. Limitations

1. The learned training/evaluation corpus is synthetic feature-space data.
2. Natural-image sanity validation is implemented but not empirically completed in this build.
3. Browser-side pixel extraction is required for accurate decoded-image features in Hatchable.
4. The byte fallback is a coarse fallback, not a replacement for decoded pixel analysis.
5. The anomaly branch is lightweight feature-based localization, not a deep embedding model.
6. Corruption detection is structural/severe-degradation evidence, not exhaustive codec fuzzing.
7. Docker/Compose and GitHub Actions cannot be truthfully marked as executed inside Hatchable.

## 26. Future work

- Retrain on a legally usable natural-image corpus with source-level split.
- Calibrate probabilities on a natural validation set.
- Add more codec-aware corruption tests when a full decoder is available.
- Replace the lightweight anomaly branch with a compact deployable embedding model if the runtime permits it.
- Provide an external Docker/CI distribution outside Hatchable.

## 27. Compliance status

The project deliberately separates four states:

- **IMPLEMENTED** — source exists and is wired into the application.
- **TESTED** — directly exercised with an observed result.
- **DEPLOYED** — shipped to the live Hatchable version.
- **NOT NATURAL-IMAGE VALIDATED** — the natural sanity page exists but its automated browser execution was not completed.

See `public/ASSESSMENT_CHECKLIST.md` for the requirement-by-requirement audit.