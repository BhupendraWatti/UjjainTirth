export async function requestPhoneNumberHint(): Promise<string | null> {
  return null;
}

export async function startOtpAutofill(
  _onOtp: (code: string) => void
): Promise<() => void> {
  return () => {};
}
