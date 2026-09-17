import { detect } from '../detector';

/** Ported from tests/unit/safety/test_detector.py — the acceptance
 * corpus, kept separate from detector.ts's own CRISIS_PHRASES so this
 * can't pass just because both lists were edited together. Every
 * phrase here MUST trip the detector; false negatives are the failure
 * mode that matters (§5.10). */
const CRISIS_CORPUS: readonly string[] = [
  // English — direct intent / ideation
  'I want to kill myself',
  'i wanna kill myself tonight',
  "I'm going to end my life",
  'sometimes I just want to end it all',
  "I don't want to live anymore",
  'i cant go on like this',
  'I feel suicidal',
  'been thinking about suicide a lot',
  'I want to take my own life',
  "I've been hurting myself again",
  'I keep cutting myself',
  'engaging in self-harm',
  'selfharm again last night',
  'no point in living anymore',
  "life isn't worth living",
  'everyone would be better off without me',
  'the world would be better without me',
  "I hope I don't wake up tomorrow",
  "I've been planning to kill myself",
  'wrote a goodbye forever note',
  'thinking about jumping off a bridge',
  "I'm going to hang myself",
  'took all the pills in the cabinet',
  'wish I was dead',
  'I wish I were dead honestly',
  'better off dead at this point',
  // English — emphasis / typing noise that must not defeat matching
  'I WANT TO DIE',
  'i just wanna dieeeee',
  'i want to kill myself!!!',
  "I don't want to live anymore...",
  "i can't go on, i really can't.",
  // Banglish / romanised Bengali
  'ami ekhon more jete iccha kore',
  'aajkal mora jete iccha kore khub',
  'sotti bolte ami morte iccha kore',
  'ami more jabo',
  'মনে হয় ami mora jabo',
  'ami attohotta korte chai',
  'atmohotta korbo bhabchi',
  'ar banchte iccha kore na',
  'ami ar bachte chai na',
  'nijeke shesh kore dibo bhabchi',
  'mone hoy more gele bhalo hoto',
  'beche thakar kono mane nei ar',
  'golay dori dibo bole thik korechi',
  'bish khabo bole vabchi',
  'nijeke koshto dite chai খুব',
] as const;

const BENIGN_CORPUS: readonly string[] = [
  'I slept great last night',
  'Feeling pretty good today, went for a long walk',
  'This workout killed me lol, so tired',
  'I could die of embarrassment, that meeting was rough',
  'Mood 4/5, energy 3/5, had coffee after 2pm',
  'ami aj khub bhalo achi',
  'kaj ta shesh korte hobe aj',
  '',
] as const;

describe('detect — crisis corpus (must all trip, no exceptions)', () => {
  it.each(CRISIS_CORPUS)('detects: %s', (text) => {
    expect(detect(text)).toBe(true);
  });
});

describe('detect — benign corpus (must never trip)', () => {
  it.each(BENIGN_CORPUS)('does not trip on: %s', (text) => {
    expect(detect(text)).toBe(false);
  });
});

describe('detect — edge cases', () => {
  it('treats null and undefined as no match', () => {
    expect(detect(null)).toBe(false);
    expect(detect(undefined)).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(detect('I WANT TO KILL MYSELF')).toBe(true);
    expect(detect('i want to kill myself')).toBe(true);
  });
});
