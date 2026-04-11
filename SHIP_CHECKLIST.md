# Tap Tenz Ship Checklist

Use this checklist in order from top to bottom.

## 1) Code Freeze And Final QA

- [ ] Confirm gameplay tuning is final (difficulty, hints, scoring, overlays)
- [ ] Run a full playthrough test on at least one real iPhone
- [ ] Verify safe area and button layout on notched devices
- [ ] Verify splash screen timing and transition to game
- [ ] Verify Help overlay scroll, dismiss, and readability
- [ ] Verify New Game confirmation flow from both locations
- [ ] Verify high score persistence after app restart
- [ ] Verify no obvious animation/performance jank after long sessions

## 2) Versioning

- [ ] Update app version in app config (marketing version)
- [ ] Increment iOS build number for this release build
- [ ] Add release notes summary for TestFlight/App Store

## 3) Apple/App Store Connect Setup

- [ ] Confirm Apple Developer account and team access
- [ ] Create app record in App Store Connect (if not already created)
- [ ] Confirm bundle identifier matches project config exactly
- [ ] Set SKU, category, age rating, and price tier ($0.99)

## 4) Store Listing Assets

- [ ] Final app icon (1024x1024 PNG) uploaded and validated
- [ ] App name and subtitle finalized
- [ ] Description and keywords finalized
- [ ] Support URL added
- [ ] Privacy policy URL added
- [ ] Screenshot set captured for required iPhone sizes
- [ ] Optional preview video decided (yes/no)

## 5) Privacy And Compliance

- [ ] Complete App Privacy questionnaire
- [ ] Confirm data collection answers (likely minimal/no tracking)
- [ ] Complete export compliance questions
- [ ] Confirm content rights declarations

## 6) EAS Build

- [ ] Confirm EAS CLI is installed and logged in
- [ ] Confirm `eas.json` profiles are correct for iOS production
- [ ] Run iOS production build
- [ ] Resolve any signing/certificate prompts
- [ ] Download/open resulting build metadata and verify success

## 7) TestFlight Validation

- [ ] Upload build to App Store Connect/TestFlight (if not auto-uploaded)
- [ ] Add internal testers
- [ ] Smoke test install/update path on at least one device
- [ ] Verify app metadata shown correctly in TestFlight

## 8) Submit For Review

- [ ] Attach build to app version in App Store Connect
- [ ] Complete all missing review fields
- [ ] Add reviewer notes (if useful)
- [ ] Choose release strategy: manual release or automatic after approval
- [ ] Submit for review

## 9) Post-Submission

- [ ] Monitor App Store review status
- [ ] Respond quickly to any rejection feedback
- [ ] Prepare hotfix plan (small patch release path)

## Quick Commands (Reference)

- EAS login: `eas login`
- Configure project: `eas build:configure`
- iOS production build: `eas build -p ios --profile production`
- Submit build: `eas submit -p ios --latest`

## Notes

- Keep one source of truth for release values (version, build number, metadata copy).
- Do one final tag/commit before running production build.
