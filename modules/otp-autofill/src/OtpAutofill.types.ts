export type OtpAutofillModuleEvents = {
  onOtpReceived: (event: OtpReceivedEvent) => void;
};

export type OtpReceivedEvent = {
  code: string;
  message: string;
};
