# VISIONGUARD — Assessment Checklist

Source of truth: Software Internship Technical Assessment.

Status key: `[PASS]` means implemented and directly evidenced. `[PARTIAL]` means implemented but limited by the runtime/evidence boundary. `[NOT PASS]` means not honestly claimable.

## Mandatory detection
- [PASS] Blur / insufficient sharpness — learned blur issue head + sharpness features.
- [PASS] Underexposure — learned underexposure head + luminance/dark-ratio evidence.
- [PASS] Overexposure — learned overexposure head + bright/clipping evidence.
- [PASS] Image noise — learned noise head + residual/local-variance evidence.
- [PASS] Image corruption / severe degradation evidence — learned corruption head + upload signature validation.
- [PASS] Potential visual defect — learned visual-defect head + local feature-based anomaly analysis.

## AI / Computer Vision
- [PASS] Real learned AI/ML decision component — quality-v2.0 is a trained logistic model artifact.
- [PASS] Classical ML using engineered image features.
- [PASS] Meaningful sharpness analysis.
- [PASS] Brightness/exposure analysis.
- [PASS] Contrast analysis.
- [PASS] Noise analysis.
- [PASS] Texture/entropy analysis.
- [PASS] Color/saturation/clipping analysis.
- [PASS] Model training/inference documented and reproducible inside Hatchable.
- [PASS] Core decision materially uses learned probabilities; it is not a threshold-only decision engine.

## Backend
- [PASS] REST API for upload and analysis.
- [PASS] Uploaded-file validation.
- [PASS] Invalid/unreadable image handling.
- [PASS] Structured JSON result.
- [PASS] Persistent PostgreSQL database.
- [PASS] Previous-analysis endpoint.
- [PASS] Appropriate error status codes.
- [PASS] Health/status endpoint.
- [PASS] Batch endpoint up to 20 images.
- [PASS] Model metadata endpoint.

## Frontend
- [PASS] Image upload.
- [PASS] Analysis trigger.
- [PASS] Image preview.
- [PASS] Overall quality score.
- [PASS] Quality label.
- [PASS] Detected issues.
- [PASS] Severity.
- [PASS] Confidence.
- [PASS] Uncertainty and manual-review flag.
- [PASS] Image statistics.
- [PASS] Analysis history.
- [PASS] Loading stages: validating, analyzing, assessing, generating explanation, saving result.
- [PASS] Success state.
- [PASS] Error state.
- [PASS] Responsive existing visual design preserved.
- [PASS] One-click evaluator sample cases: clean, blur, dark, overexposed, noisy, defect.
- [PASS] Model & Evaluation method panel.

## Evaluation
- [PASS] Source profiles split before variants are generated.
- [PASS] 160 source profiles with 112/24/24 train/validation/test split.
- [PASS] 1,280 deterministic controlled examples.
- [PASS] Actual measured accuracy.
- [PASS] Actual measured precision.
- [PASS] Actual measured recall.
- [PASS] Actual measured F1.
- [PASS] Confusion matrix.
- [PASS] Issue-level precision/recall/F1.
- [PASS] Automatically retained low-confidence / incorrect held-out cases.
- [PASS] Limitations documented.
- [PASS] Incorrect/uncertain prediction discussion.
- [PARTIAL] Natural-image sanity evaluation — three unseen natural photographs and a controlled transformation runner are deployed, but automated browser execution failed because the Hatchable browser farm returned `session not found or expired`. No natural-image metric is claimed.
- [NOT PASS] Natural-image benchmark performance — not honestly established.

## Explainability
- [PASS] Decision explanation.
- [PASS] Meaningful image statistics.
- [PASS] Feature-grounded explanation.
- [PASS] Confidence.
- [PASS] Uncertainty / entropy.
- [PASS] Local quality heatmap / localization.
- [PASS] Original / heatmap overlay with opacity control.
- [PASS] Localization is based on local evidence, not random overlays.

## Deployment
- [PASS] Deployed runnable application.
- [PASS] Reproducible Hatchable platform setup documented.
- [PASS] Frontend/backend communication.
- [PASS] Environment/configuration documentation.
- [PASS] Health endpoint.
- [PASS] Model-loading documentation.
- [PASS] Inference documentation.
- [PASS] Online URL.
- [NOT PASS] Docker/Docker Compose executed in Hatchable — unsupported by the current platform filesystem/runtime.
- [NOT PASS] GitHub Actions executed in Hatchable — unsupported by the current platform filesystem/runtime.

## Submission artifacts
- [PASS] Existing frontend source preserved.
- [PASS] Backend source.
- [PASS] AI/ML source and trained artifact.
- [PASS] README.
- [PASS] Model/training explanation.
- [PASS] API endpoint documentation.
- [PASS] Database documentation.
- [PASS] Evaluation results.
- [PASS] Failure-case report.
- [PASS] Natural-image sanity sample library present.
- [PARTIAL] Root-level `ml/` scripts — executable ML contracts are under `lib/` because Hatchable does not support an arbitrary root `ml/` directory.

## Optional / bonus
- [PASS] Batch image analysis.
- [PASS] Quality heatmap/localization.
- [PASS] Uncertainty estimation.
- [PASS] Model versioning.
- [PASS] Automated owner-only self-test endpoint — latest direct run: 16/16 PASS.
- [PASS] CPU-oriented inference / static model loading.
- [PASS] Structured success/failure logging and processing time.
- [PASS] No external AI/vision API in the image-quality decision path.
- [PARTIAL] Natural-image sanity workflow — deployed, but automated execution could not be completed in the Hatchable browser farm.

## Evidence snapshot

Current learned artifact: `quality-v2.0`.

Held-out synthetic test:

- Accuracy: `0.8958`
- Macro precision: `0.9451`
- Macro recall: `0.8002`
- Macro F1: `0.8560`

Issue F1:

- Blur: `0.9744`
- Underexposure: `0.9573`
- Overexposure: `1.0000`
- Noise: `0.8846`
- Corruption: `0.7925`
- Visual defect: `1.0000`

These are **synthetic controlled feature-space measurements**, not natural-image benchmark numbers.

## Honesty note

VISIONGUARD is not presented as 100% assessment-complete. The major evidence gap is natural-image validation. Docker/Compose, GitHub Actions, and a root-level `ml/` package are also constrained by Hatchable's runtime/filesystem. These limitations are explicitly documented rather than hidden.