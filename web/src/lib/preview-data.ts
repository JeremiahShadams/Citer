// Illustrative placeholder content. Replace with a verified repository example and real Citer output.
export const previewRepo = 'acme/payments-service'

export const previewQuestion = 'Where does this service validate a payment before settlement?'

export const previewAnswer =
  'Validation happens before the settlement handler processes the payment. validatePayment rejects intents that are unauthorized, have a non-positive amount, mismatch the settlement currency, or fall outside the authorization window.'

export const previewCitation = {
  file: 'payment-validator.ts',
  path: 'src/settlement/payment-validator.ts',
  start: 42,
  end: 58,
}

export const previewFiles = [
  { path: 'src/settlement/', name: 'payment-validator.ts', match: 'validatePayment()', cited: true },
  { path: 'src/settlement/', name: 'settlement-handler.ts', match: 'calls validatePayment', cited: false },
  { path: 'src/schema/', name: 'payment.schema.ts', match: 'PaymentIntent', cited: false },
]

export const codeStartLine = 36

export const codeLines = [
  '}',
  '',
  '/**',
  ' * Runs before settlement. Rejects intents that',
  ' * cannot be captured safely.',
  ' */',
  'export function validatePayment(intent: PaymentIntent): ValidationResult {',
  '  if (intent.status !== "authorized") {',
  '    return reject("NOT_AUTHORIZED", intent.id);',
  '  }',
  '',
  '  if (!isPositive(intent.amount)) {',
  '    return reject("INVALID_AMOUNT", intent.id);',
  '  }',
  '',
  '  if (intent.currency !== intent.merchant.settlementCurrency) {',
  '    return reject("CURRENCY_MISMATCH", intent.id);',
  '  }',
  '',
  '  if (isExpired(intent.authorizedAt, AUTH_WINDOW_MS)) {',
  '    return reject("AUTH_EXPIRED", intent.id);',
  '  }',
  '  return { ok: true, intent };',
  '}',
  '',
  'export function reject(code: RejectCode, id: string) {',
  '  return { ok: false, code, id };',
  '}',
]