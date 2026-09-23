# LLFG Retirement Acquisition Engine — GitHub Integration Notes

Target repository: `Blaise4701/lifeline-legacy-site`
Target branch: `feature/retirement-acquisition-engine`

This package is shaped as additive paths for the existing Next.js repository. It does not modify existing production files.

## Included
- `docs/retirement-acquisition-engine/` — locked framework v2.9 and GHL Phase 1 checklist
- `public/retirement-income-stress-test/index.html` — static reviewer preview (noindex/nofollow)
- `src/app/retirement-income-stress-test/page.tsx` — clean route that redirects to the preview HTML

## Migration audit fixes applied before packaging
1. Fixed Screen 3 → Screen 4 navigation so Account Inventory is no longer skipped.
2. Synced Planning Track logic to v2.5 so `mainly_researching` produces `education` unless `has_current_plan` forces `second_opinion`.
3. Synced Screen 4 option vocabulary to the canonical `401k_403b` code.
4. Updated Stress-Test Build Version to `v2.8`; Fit Model remains v1.6; Engagement Model remains v1.3.
5. Added `noindex,nofollow` to the reviewer preview.

## Do not merge to production yet
The consent text remains explicitly marked `COMPLIANCE REVIEW REQUIRED`, OTP is demo-only, GHL writes are not wired, and Fit/Tier calculation remains client-side in this reviewer preview.
