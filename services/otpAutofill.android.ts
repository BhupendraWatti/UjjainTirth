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
  onOtp: (code: string) => void
): Promise<() => void> {
  const module = OtpAutofill;
  if (!module) return () => {};

  const subscription = module.addListener("onOtpReceived", ({ code }) => {
    if (/^\d{6}$/.test(code)) onOtp(code);
  });

  try {
    await module.startSmsRetrieverAsync();
    return () => {
      subscription.remove();
      module.stopSmsRetriever();
    };
  } catch {
    subscription.remove();
    return () => {};
  }
}
