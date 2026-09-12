const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the real handler with controlled network/storage boundaries; no SMS is sent.
const slots = [];
let cursor = 0;
let calls = 0;
let navigations = 0;
let resolveVerification;
let resolveLogin;
const hooks = {
  useState(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = initial;
    return [slots[index], value => { slots[index] = value; }];
  },
  useRef(initial) {
    const index = cursor++;
    if (!(index in slots)) slots[index] = { current: initial };
    return slots[index];
  },
  useEffect() {},
  useCallback(callback) { return callback; },
};
const mocks = {
  react: hooks,
  'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
  'react-native': { View: 'View', StyleSheet: { create: value => value } },
  'expo-router': { useRouter: () => ({ replace: () => { navigations++; } }) },
  '@/services/authService': {
    sendOtp: async () => ({ success: true }),
    verifyOtp: () => { calls++; return new Promise(resolve => { resolveVerification = resolve; }); },
  },
  '@/services/otpScreenService': {},
  '@/context/AuthContext': { useAuth: () => ({ login: () => new Promise(resolve => { resolveLogin = resolve; }) }) },
  '@/services/otpAutofill': { startOtpAutofill: async () => () => {} },
  '@/constants/colors': { COLORS: { bg: '#fff' } },
  './LoginView': { default: 'Login' },
  './OtpVerificationView': { default: 'OTP' },
};
const source = fs.readFileSync('components/auth/AuthVerificationView.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const context = { exports: {}, require: name => {
  assert.ok(name in mocks, `Unexpected dependency: ${name}`);
  return mocks[name];
} };
vm.runInNewContext(compiled, context);
const render = () => { cursor = 0; return context.exports.default({}).props.children.props; };

async function check() {
  const otpView = fs.readFileSync('components/auth/OtpVerificationView.tsx', 'utf8');
  assert.doesNotMatch(otpView, /<OnboardingView\b/, 'OTP must not mount a second onboarding screen during navigation');
  assert.doesNotMatch(otpView, /IS_DEMO_TIMING|onAnimationFinish/, 'Navigation must have no demo transition timer');
  await render().onSendOtp('9999999999');
  const otp = render();
  const pending = otp.onVerifyOtp('123456');
  assert.equal(navigations, 0, 'Never navigate before verification');
  const duplicate = otp.onVerifyOtp('123456');
  assert.equal(calls, 1, 'Concurrent submissions must send only one verification request');
  resolveVerification({ success: true, userId: 42 });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(navigations, 0, 'Persist the session before navigation');
  resolveLogin();
  assert.equal(await pending, true);
  await duplicate;
  assert.equal(navigations, 1, 'Successful verification must navigate without an animation timer');
  await render().onVerifyOtp('123456');
  assert.equal(calls, 1, 'Do not reuse an already accepted OTP');

  slots.length = 0;
  await render().onSendOtp('9999999999');
  const failed = render().onVerifyOtp('654321');
  resolveVerification({ success: false, message: 'Invalid OTP' });
  assert.equal(await failed, false);
  assert.equal(navigations, 1, 'Rejected OTP must never navigate');
  assert.equal(render().errorMessage, 'Invalid OTP');
  const retry = render().onVerifyOtp('123456');
  assert.equal(calls, 3, 'A rejected attempt must release the submission lock');
  resolveVerification({ success: true, userId: 42 });
  await new Promise(resolve => setImmediate(resolve));
  resolveLogin();
  assert.equal(await retry, true);
  assert.equal(navigations, 2);
  console.log('OTP verification: single request, persisted session, immediate navigation, rejection and retry passed.');
}
check().catch(error => { console.error(error); process.exitCode = 1; });
