# VISIONGUARD — FINAL ASSESSMENT AUDIT

Source of truth: the attached Software Internship Technical Assessment.

## MANDATORY REQUIREMENTS

| Item | Status | Evidence / gap |
|---|---|---|
| Blur / insufficient sharpness | [PASS] | 14-feature pipeline, blur issue head, `/api/v1/analyze`, self-test sensitivity. |
| Underexposure | [PASS] | Luminance/dark-ratio features and issue head; self-test and held-out metrics. |
| Overexposure | [PASS] | Bright-ratio/clipping features and issue head; self-test and held-out metrics. |
| Image noise | [PASS] | Noise residual/local variance features and issue head; self-test and held-out metrics. |
| Corruption / severe degradation | [PASS] | Severe-degradation synthetic condition plus corruption issue head. |
| Potential visual defect | [PASS] | Feature-based local anomaly analysis plus visual-defect issue head. |
| Real AI/ML decision component | [PASS] | Learned multinomial logistic regression with six binary issue heads. |
| Model selection explained | [PASS] | Classical ML selected for deterministic CPU-friendly engineered-feature inference; documented in README. |
| Data preparation explained | [PASS] | 160 source profiles, eight controlled variants/source, source split before variant generation. |
| Training/model acquisition explained | [PASS] | Executable pure-JS training routine and static `quality-v2.0` artifact. |
| Evaluation explained | [PASS] | `/evaluation.html`, `/api/v1/evaluate`, metrics and methodology. |
| Meaningful sharpness analysis | [PASS] | Gradient, edge density and residual-based sharpness. |
| Brightness/exposure analysis | [PASS] | Mean luminance, dark/bright ratios, clipping. |
| Contrast analysis | [PASS] | Luminance standard deviation and dynamic range. |
| Noise analysis | [PASS] | Residual and local variance measures. |
| Texture / entropy equivalent | [PASS] | Entropy and local variance. |
| REST API | [PASS] | Ten deployed endpoints. |
| File validation | [PASS] | JPEG/PNG/WebP type, signature, size and dimension checks. |
| Invalid/unreadable handling | [PASS] | Signature rejection and browser decode fallback/error handling. |
| Structured JSON | [PASS] | Analyze/model/evaluate/batch/history APIs return structured JSON. |
| Persistent DB | [PASS] | Existing Postgres `analyses` table stores results and model version. |
| Previous analyses | [PASS] | History list/detail endpoints and UI. |
| Error handling / HTTP status | [PASS] | 400, 413, 415 and safe 500 paths are implemented; 422 is not needed for current valid request contract. |
| Frontend upload/preview/analysis | [PASS] | Existing deployed flow. |
| Score / label / issues / severity / confidence | [PASS] | Existing result UI and API response. |
| Statistics / history / loading / success / error / responsive | [PASS] | Existing UI and patched browser decode/error handling. |
| Unseen evaluation | [PASS] | 24 held-out source profiles / 192 test examples, source split before variants. |
| Appropriate metrics | [PASS] | Accuracy, macro precision/recall/F1, issue-level precision/recall/F1, confusion matrix. |
| Failure cases | [PASS] | Automatically retained low-confidence/incorrect held-out cases. |
| Limitations / uncertainty discussion | [PASS] | Evaluation page and README explicitly distinguish synthetic vs natural validation. |
| Explainability | [PASS] | Feature-grounded explanations, statistics, issue scores, uncertainty, local evidence. |
| Evidence-based heatmap | [PASS] | Local sharpness/brightness/noise/anomaly evidence; original/heatmap/overlay UI. |
| Deployment | [PASS] | Live Hatchable application and health endpoint. |
| Setup / model / inference documentation | [PASS] | README and API reference. |
| Natural-image benchmark performance | [PARTIAL] | Natural-image sanity workflow and three separate natural sources exist; automated browser execution could not be established. No natural benchmark metric is claimed. This is possible with external browser execution. |
| Docker/Compose | [PARTIAL] | Portable architecture is documented, but Hatchable does not permit the requested root-level Docker artifacts. External repository is required for an executable Docker submission. |
| Sample images | [PASS] | Natural image assets and six UI transformation samples exist. |

## BONUS REQUIREMENTS

| Item | Status | Evidence / gap |
|---|---|---|
| Batch analysis | [PASS] | Up to 20 images, aggregate counts, per-image results and CSV export. |
| Heatmap / localization | [PASS] | Evidence-based local grid and SVG heatmap. |
| Confidence calibration / uncertainty | [PARTIAL] | Entropy-based uncertainty and manual-review recommendation exist; probabilities are not calibrated. Calibration requires a held-out calibration procedure. |
| Model versioning | [PASS] | `quality-v2.0` in model endpoint, artifact and persisted analyses. |
| Automated tests | [PASS] | Owner-only self-test, 17/17 verified in closure pass. |
| Performance optimization | [PASS] | Static model loading, capped browser dimensions, shared feature extraction; processing time is persisted. |
| CI/CD | [PARTIAL] | CI workflow is not executable inside Hatchable because root `.github/workflows` is unavailable. External repository is required. |
| Monitoring/logging | [PASS] | Structured completion/failure logging and processing time. |

## EVIDENCE

- Deployed model: `quality-v2.0`.
- Classifier: multinomial logistic regression + six binary issue heads.
- Features: 14 engineered image-quality features.
- Dataset: 160 source profiles × 8 conditions = 1,280 controlled examples.
- Split: 112 train / 24 validation / 24 held-out test source profiles.
- Test examples: 192.
- Synthetic controlled test accuracy: 89.58%.
- Synthetic controlled macro precision: 94.51%.
- Synthetic controlled macro recall: 80.02%.
- Synthetic controlled macro F1: 85.60%.
- Issue F1: blur 97.44%, underexposure 95.73%, overexposure 100.00%, noise 88.46%, corruption 79.25%, visual defect 100.00%.
- These metrics are synthetic controlled feature-space measurements, not natural-image benchmark numbers.
- Self-test: 17/17 passed during the closure pass.

## LIMITATIONS

1. The controlled evaluation validates response to synthetic feature distributions, not production-world CV accuracy.
2. Natural-image sanity evaluation is deployed but remains pending external browser execution; no natural accuracy is reported.
3. Uncertainty is entropy-derived, not statistically calibrated.
4. Feature-based anomaly localization is not Grad-CAM, PatchCore, or deep saliency.
5. Root-level Docker and GitHub Actions artifacts cannot be created in the current Hatchable filesystem.
6. Root-level `ml/` is unavailable; executable ML code lives under `lib/`.

## HATCHABLE CONSTRAINTS

- Current project filesystem permits `public/**`, `api/**`, `lib/**`, migrations and selected root config files; arbitrary new root-level Docker/CI directories are not available through the project write contract.
- Browser automation was attempted for the natural-image runner and returned `browser farm: 404: session not found or expired`; this prevented an honest automated natural-image result.
- The deployed project visibility is personal, so anonymous visitors may encounter Hatchable's sign-in wall until project visibility is changed in the Hatchable console.
- These constraints are documented rather than hidden or converted into unsupported claims.