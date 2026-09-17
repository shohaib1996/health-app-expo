/**
 * Crisis-language keyword detector — verbatim port of
 * app/modules/safety/detector.py (backend §5.10, S-60).
 *
 * Deterministic and dependency-free — pure string manipulation, no
 * model call, no network. This is what makes S-60 work in airplane
 * mode. Keep it in lockstep with the Python original: no regex
 * features without a direct equivalent on both sides, no
 * locale-dependent behaviour beyond casefold/NFKC.
 *
 * False negatives are the failure mode that matters here, not false
 * positives: a missed phrase means S-60 never shows. Bias every
 * change toward recall.
 */

export const DETECTOR_VERSION = '2026.09.15-1';

const APOSTROPHE_RE = /['‘’`]/g;
const PUNCTUATION_RE = /[.,!?;:"()[\]{}\-_/\|@#$%^&*+=~<>]/g;
const WHITESPACE_RE = /\s+/g;
// Collapses emphasis-elongated runs ("dieeeee", "nooooo") to a double
// letter, so they still contain the plain-spelling phrase as a
// substring. "3+ -> 2", not "-> 1", so ordinary double letters (kill,
// goodbye) are never touched.
const REPEAT_RUN_RE = /(.)\1{2,}/g;

/** Casefold, strip punctuation/contractions, collapse whitespace and
 * letter-repetition emphasis — mirrors detector.py's `normalize`
 * exactly, including the order of operations. */
export function normalize(text: string): string {
  let normalized = text.normalize('NFKC');
  normalized = normalized.toLowerCase();
  normalized = normalized.replace(APOSTROPHE_RE, '');
  normalized = normalized.replace(PUNCTUATION_RE, ' ');
  normalized = normalized.replace(REPEAT_RUN_RE, '$1$1');
  normalized = normalized.replace(WHITESPACE_RE, ' ').trim();
  return normalized;
}

// Crisis phrasings, in natural spelling — normalized once at module
// load (see NORMALIZED_PHRASES), same two corpora as the backend:
// plain English, and Banglish/romanised Bengali. Keep this list
// identical to CRISIS_PHRASES in detector.py; a change on one side
// without the other is a recall regression on whichever platform was
// missed.
export const CRISIS_PHRASES: readonly string[] = [
  // --- direct suicidal intent / ideation / method — English ---
  'kill myself',
  'kill me',
  'killing myself',
  'end my life',
  'ending my life',
  'end it all',
  'end it tonight',
  'want to die',
  'wanna die',
  'want to be dead',
  'wish i was dead',
  'wish i were dead',
  'better off dead',
  'no reason to live',
  'no reason to live anymore',
  'not worth living',
  'life is not worth living',
  "life isn't worth living",
  "don't want to live",
  "don't want to be alive",
  "can't go on",
  "can't do this anymore",
  'suicidal',
  'suicide',
  'commit suicide',
  'take my own life',
  'taking my own life',
  'hurt myself',
  'hurting myself',
  'harm myself',
  'harming myself',
  'self harm',
  'selfharm',
  'cutting myself',
  'cut myself',
  'want to disappear',
  'want to stop existing',
  'give up on life',
  'no point in living',
  'no point living',
  'ready to die',
  'ready to end it',
  'planning to kill myself',
  'plan to kill myself',
  'goodbye forever',
  'this is goodbye',
  'final goodbye',
  'take all the pills',
  'taking all the pills',
  'took all the pills',
  'jump off a bridge',
  'jumping off a bridge',
  'jump in front of a train',
  'jumping in front of a train',
  'tie a rope',
  'hang myself',
  'hanging myself',
  'going to end it',
  'nothing to live for',
  'better without me',
  'better off without me',
  'world would be better without me',
  'world would be better off without me',
  'everyone would be better without me',
  'everyone would be better off without me',
  "better if i wasn't here",
  "hope i don't wake up",
  "don't want to wake up",
  // --- Banglish / romanised Bengali ---
  'more jete iccha kore',
  'mora jete iccha kore',
  'morte iccha kore',
  'ami more jabo',
  'ami mora jabo',
  'ami morte chai',
  'attohotta korte chai',
  'atmohotta korte chai',
  'attohotta korbo',
  'atmohotta korbo',
  'banchte iccha kore na',
  'bachte iccha kore na',
  'banchte chai na',
  'bachte chai na',
  'ar banchte chai na',
  'ar bachte chai na',
  'nijeke shesh kore dibo',
  'nijeke shesh kore debo',
  'nijeke shesh kore felbo',
  'more gele bhalo hoto',
  'mora gele bhalo hoto',
  'beche thakar kono mane nei',
  'bnache thakar kono mane nei',
  'golay dori dibo',
  'golay dori debo',
  'bish khabo',
  'bish kheye felbo',
  'nijeke koshto dite chai',
  'nijer khoti korte chai',
  'ghumer oushud kheye felbo',
  'morei jabo',
  'morey jabo',
] as const;

const NORMALIZED_PHRASES: readonly string[] = CRISIS_PHRASES.map(normalize);

/** True if `text` contains a crisis phrase. Substring match against the
 * normalized corpus — deterministic, offline, no false-negative
 * tolerance on the core set (see __tests__/detector.test.ts). */
export function detect(text: string | null | undefined): boolean {
  if (!text) return false;
  const normalized = normalize(text);
  return NORMALIZED_PHRASES.some((phrase) => normalized.includes(phrase));
}
