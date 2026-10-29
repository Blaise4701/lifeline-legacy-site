# Configuration loader investigation: October 22, 2026

## Verified findings
- Main is clean at security release 4b3d6acbb8a9eae7681af1da636f9ef520ddde42.
- Main first-parent history shows ESLint loader content entering through merge 1f866a7 (September 19), being removed by c329e71 (September 26), and returning in asset commit 960f42f (October 9).
- The parent of 960f42f has the clean 465-byte ESLint configuration. The commit adds createRequire initialization and an obfuscated executable tail while also adding Ass3.png and editing the ad asset index. This proves the reintroduction point, not the identity of the inserting process.
- Next.js configuration loader content also appears in main history at 72cf2ad (September 29); aea04b7 subsequently restores clean configuration.
- Five open PR heads (#26, #25, #20, #11, #9) retained loader markers before this follow-up. #11 and #9 also retained affected Next.js configuration. #27 had already been cleaned.
- Six active PR branches now receive clean configuration, static pre-command guards, guard tests, a CI integrity workflow and agent safety instructions. Feature work stays unmerged.
- Static scanning of executable source at these original heads found the identified markers only in the affected configuration files. This is not a comprehensive malware audit.

## Prevention
The npm predev, prebuild and prelint scripts validate reviewed SHA-256 configuration hashes without importing either file. The GitHub Actions Configuration integrity job independently reads the files and verifies that lifecycle guard entries remain present. It installs no dependencies, executes no project files, requests read-only contents permission and does not persist checkout credentials.

Intentional configuration changes require static review and coordinated baseline updates. Directly invoking next or eslint bypasses npm lifecycle guards. The CI check must be made a required status check on main to enforce it at merge time. This connection cannot inspect or modify branch protection (GitHub returns 403); that setting remains unverified.

## Remaining containment and investigation
- Dormant historical branch heads still contain affected code. Do not run tooling on them. Recover feature changes onto current clean main instead of restoring configurations from old heads.
- Determine which workstation, coding environment or automation produced commits 960f42f and the earlier affected commits. Commit author names do not establish the true inserting process.
- Review prior build and editor lint execution and credential exposure with the account owner. No credentials were read, displayed or rotated here. Exposure has not been confirmed or ruled out.
- Preserve history for investigation. No history rewriting, branch deletion or merging of feature PRs was performed.
