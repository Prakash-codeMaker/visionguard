# VISIONGUARD — ASSESSMENT TRACEABILITY

| Requirement | Implementation | Evidence | Status |
|---|---|---|---|
| Blur detection | Sharpness/gradient features + blur head | `/api/v1/analyze`, self-test | [PASS] |
| Underexposure | Luminance/dark-ratio features + issue head | `/api/v1/analyze` | [PASS] |
| Overexposure | Bright-ratio/clipping features + issue head | `/api/v1/analyze` | [PASS] |
| Image noise | Noise residual/local variance + issue head | `/api/v1/analyze` | [PASS] |
| Corruption / severe degradation | Severe controlled condition + corruption head | `/api/v1/evaluate` | [PASS] |
| Potential visual defect | Local anomaly scoring + defect head | `/api/v1/analyze/:id/heatmap` | [PASS] |
| Real learned component | Logistic regression + binary issue heads | `lib/mlRuntime.js`, `quality-v2.0` | [PASS] |
| Engineered image features | 14 features | `lib/imageFeatures.js` | [PASS] |
| Source-profile holdout | Split before variant generation | `/api/v1/evaluate` | [PASS] |
| Held-out test | 24 unseen sources / 192 examples | `/evaluation.html` | [PASS] |
| Metrics | Accuracy, precision, recall, F1 | `/api/v1/evaluate` | [PASS] |
| Confusion matrix | Actual held-out counts/percentages | `/evaluation.html` | [PASS] |
| Failure cases | Lowest-confidence + incorrect predictions | `/evaluation.html`, `failure-cases.json` | [PASS] |
| Natural-image validation | Separate controlled natural-photo runner | `/natural-eval.html` | [PARTIAL] |
| Natural benchmark accuracy | Not reported | Pending external execution | [NOT PASS] |
| Explainability | Feature-grounded explanations/statistics | Analyze response/UI | [PASS] |
| Evidence heatmap | Local brightness/sharpness/noise/anomaly | Analyze response/UI | [PASS] |
| Uncertainty | Entropy-derived uncertainty | Analyze response/UI | [PASS] |
| Calibrated probabilities | No calibration procedure | Explicitly not claimed | [NOT PASS] |
| Batch analysis | Up to 20 images + CSV | `/api/v1/analyze/batch` | [PASS] |
| Model versioning | `quality-v2.0` + persisted version | `/api/v1/model`, `analyses` | [PASS] |
| Automated tests | 17 assertions | `/api/v1/self-test` | [PASS] |
| Performance timing | Per-analysis processing time | Analyze response/DB | [PASS] |
| Logging | Structured success/failure events | API/lib logging | [PASS] |
| Docker | Portable architecture only | README / audit | [PARTIAL] |
| CI/CD | Not available in Hatchable root filesystem | Audit | [PARTIAL] |
| Deployed application | Live Hatchable deployment | `https://visionguard.hatchable.site` | [PASS] |

## Synthetic controlled result

**Accuracy 89.58% · Macro precision 94.51% · Macro recall 80.02% · Macro F1 85.60%** on the 192-example held-out source-profile test set.

These are **synthetic controlled feature-space measurements**. They are not production accuracy and not a natural-image benchmark.

## Natural-image status

The natural-image runner contains three separate natural photographs and controlled clean/blur/dark/overexposed/noisy/defect transformations. The closure pass attempted browser execution, but the Hatchable browser farm returned `session not found or expired`. Therefore the status remains **PENDING EXTERNAL EXECUTION** and no natural-image metric is claimed.