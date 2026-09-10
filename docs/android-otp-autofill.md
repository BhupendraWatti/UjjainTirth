# Android phone-number and OTP autofill

The login flow uses Google Play Services' Phone Number Hint and SMS Retriever APIs. It does not request `READ_PHONE_STATE`, `READ_SMS`, `RECEIVE_SMS`, or notification permission.

## WordPress SMS template requirement

Silent OTP retrieval only works when the SMS sent by WordPress ends with the 11-character app hash for the installed Android signing certificate. Configure the production SMS/DLT template in this form:

```text
<#> Your UjjainTirth OTP is {otp}. Valid for {expiry} minutes.
YOUR_11_CHARACTER_APP_HASH
```

The complete message must be no more than 140 bytes. Keep the OTP as exactly six digits because the mobile app verifies and extracts a six-digit code.

For a Google Play release, calculate the hash from package name `com.ujjaintirth.app` and the **App signing certificate** in Play Console. The Play signing certificate is different from the upload certificate, so a hash calculated from the local upload keystore will only work for directly installed builds signed by that key. Register the final SMS text with the DLT provider and set its template ID in the Granth OTP settings.

Google's server guide explains how to calculate the production hash: https://developers.google.com/identity/sms-retriever/verify#computing_your_apps_hash_string

## Testing

On September 10, the live `/granth/v1/auth/settings` endpoint returned a template without an app hash. The currently installed local debug build uses hash `93DGMLVBP2n`, calculated from `com.ujjaintirth.app` and the public certificate in `android/app/debug.keystore`. Its test SMS must include:

```text
Use code {otp} to verify yourself at UjjainTirth Powered by Granth Infotech.
93DGMLVBP2n
```

This is a **debug-build hash**, not the Google Play production hash. Update and approve the matching SMS/DLT template on the server before testing silent retrieval. App code cannot silently retrieve the existing hashless SMS.

The mobile verification flow now navigates immediately after server success and session persistence, without waiting for the 4.5-second demo transition. Run `node scripts/check-otp-verification.cjs` to check duplicate submissions, persistence ordering, immediate navigation, rejected codes, and retries without sending SMS.

The September 10 device log at 13:50:25 confirms a Fabric `addViewAt` failure: view 966 already belonged to parent 1088 when inserted into parent 968. The OTP success render previously inserted an animated onboarding underlay while replacing the route with another onboarding screen. That overlapping reveal and all demo transition timers have now been removed; only the onboarding route owns that screen. The regression check guards against reintroducing the embedded screen. This removes the suspected mount-race trigger, but a successful physical-device OTP login is still needed to confirm the native crash is resolved.

The public settings endpoint was checked again during this fix and still returns the hashless template shown above. The existing backend notification patch in `wordpress plugin/otp-fix-review/` remains local; no server settings or plugin files were deployed during this fix. SMS retrieval and network verification cannot be guaranteed to finish in exactly two seconds.

The device recorded a verification request exceeding the 10-second timeout. Backend access is needed to trace the actual verification handler, database operations, and external calls; a fast settings response or missing-parameter response does not measure successful OTP verification. Do not automatically retry a consumed OTP or accept it locally to conceal this timeout.

This feature contains native Android code and cannot run in Expo Go. Create and install a fresh development, preview, or production build after changes to the module. Test on a physical Android phone with an active SIM and Google Play Services. Cancelling the phone-number popup leaves manual entry available; devices without a discoverable SIM number also fall back to manual entry.
