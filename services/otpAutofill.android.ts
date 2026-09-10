import OtpAutofill from "@/modules/otp-autofill";

export async function requestPhoneNumberHint(): Promise<string | null> {
  const module = OtpAutofill;
  if (!module) return null;
  try {
    return await module.requestPhoneNumberHintAsync();
  } catch {
    return null;
  }
}

export async function startOtpAutofill(
  onOtp: (code: string) => void,
  // Pass null so Google's SMS User Consent accepts SMS from any sender.
  // The DLT-registered header (e.g. GNTINF / GM-GNTINF) may not exactly
  // match a literal string filter, causing the consent dialog to be silently
  // skipped. null = show the consent bottom-sheet for any incoming SMS.
  _senderId?: string
): Promise<() => void> {
  const module = OtpAutofill;
  if (!module) return () => {};

  const subscription = module.addListener("onOtpReceived", ({ code }) => {
    if (/^\d{6}$/.test(code)) onOtp(code);
  });

  try {
    if (typeof module.startSmsUserConsentAsync === "function") {
      // null → no sender filter → consent dialog fires for any SMS
      await module.startSmsUserConsentAsync(null);
    } else {
      await module.startSmsRetrieverAsync();
    }
    return () => {
      subscription.remove();
      module.stopSmsRetriever();
    };
  } catch {
    subscription.remove();
    return () => {};
  }
}
