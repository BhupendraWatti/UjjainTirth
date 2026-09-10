import { NativeModule, requireOptionalNativeModule } from 'expo';

import { OtpAutofillModuleEvents } from './OtpAutofill.types';

declare class OtpAutofillModule extends NativeModule<OtpAutofillModuleEvents> {
  requestPhoneNumberHintAsync(): Promise<string>;
  startSmsRetrieverAsync(): Promise<void>;
  stopSmsRetriever(): void;
}

// Expo Go and stale development builds do not contain this local native module.
export default requireOptionalNativeModule<OtpAutofillModule>('OtpAutofill');
