// Re-export the native module. On web, it will be resolved to OtpAutofillModule.web.ts
// and on native platforms to OtpAutofillModule.ts
export { default } from './src/OtpAutofillModule';
export * from './src/OtpAutofill.types';
