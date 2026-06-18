import type { FlagCategory, Polarity } from "./types.js";
import { POLARITY_OF } from "./types.js";

export interface Flag {
  text: string;
  category: FlagCategory;
  weight: number;
  decode: string;
}

export interface CompiledFlag extends Flag {
  polarity: Polarity;
}

// The moat: a curated database of dating red 🚩 and green 🟢 flags — the things
// people actually say and do — each mapped to what it really signals. Pure data.
const FLAGS: Flag[] = [
  // ──────────────── 🚩 RED ────────────────
  // avoidant — commitment-dodging
  { text: "i don't believe in labels", category: "avoidant", weight: 3.5, decode: "Wants you available, but never accountable." },
  { text: "doesn't believe in labels", category: "avoidant", weight: 3.5, decode: "Wants you available, but never accountable." },
  { text: "let's keep it casual", category: "avoidant", weight: 3, decode: "I'm keeping my options open." },
  { text: "let's keep things casual", category: "avoidant", weight: 3, decode: "I'm keeping my options open." },
  { text: "i don't want anything serious", category: "avoidant", weight: 3, decode: "…with you, at least." },
  { text: "we don't need a title", category: "avoidant", weight: 3, decode: "I want plausible deniability." },
  { text: "i'm not ready for a relationship", category: "avoidant", weight: 2.5, decode: "But I'm very ready to keep you around." },
  { text: "we're basically dating", category: "avoidant", weight: 2.5, decode: "All of the work, none of the commitment." },
  { text: "i'm just a private person", category: "avoidant", weight: 2, decode: "You will never appear in my life or my phone." },
  { text: "i'm bad at texting", category: "avoidant", weight: 2, decode: "I text plenty when I'm actually interested." },

  // manipulation
  { text: "if you really loved me", category: "manipulation", weight: 4, decode: "Weaponizing your feelings to get their way." },
  { text: "you're overreacting", category: "manipulation", weight: 3, decode: "Shrinking your feelings so they don't have to change." },
  { text: "you're being dramatic", category: "manipulation", weight: 3, decode: "Your reaction is the problem, not their behavior." },
  { text: "calm down", category: "manipulation", weight: 2.5, decode: "Your feelings are inconvenient to me." },
  { text: "i was just being honest", category: "manipulation", weight: 2.5, decode: "Cruelty wearing an honesty costume." },
  { text: "you're too sensitive", category: "manipulation", weight: 3, decode: "The problem is you, apparently. (It isn't.)" },
  { text: "i never said that", category: "manipulation", weight: 3, decode: "Gaslighting in progress." },
  { text: "look what you made me do", category: "manipulation", weight: 4, decode: "Refusing every ounce of responsibility." },

  // dishonesty
  { text: "my ex is crazy", category: "dishonesty", weight: 3, decode: "They're the common denominator in every 'crazy ex' story." },
  { text: "all my exes are crazy", category: "dishonesty", weight: 3.5, decode: "…still the common denominator." },
  { text: "it's complicated", category: "dishonesty", weight: 2.5, decode: "There's someone else." },
  { text: "trust me", category: "dishonesty", weight: 2, decode: "Historically, do not." },
  { text: "i don't usually do this", category: "dishonesty", weight: 2, decode: "They definitely usually do this." },
  { text: "nothing happened", category: "dishonesty", weight: 2.5, decode: "Something happened." },

  // disrespect
  { text: "k", category: "disrespect", weight: 2.5, decode: "The whole conversation, dismissed in one letter." },
  { text: "you're not like other girls", category: "disrespect", weight: 2.5, decode: "Flattening you by putting down everyone else." },
  { text: "you're not like other guys", category: "disrespect", weight: 2.5, decode: "Flattering you with someone else's insult." },
  { text: "i hate drama", category: "disrespect", weight: 2.5, decode: "Said only by people who are, themselves, the drama." },
  { text: "chill", category: "disrespect", weight: 2, decode: "Stop reacting to the thing I did." },
  { text: "it was just a joke", category: "disrespect", weight: 2.5, decode: "I said something mean and want a free pass." },

  // unavailable — breadcrumbs
  { text: "u up", category: "unavailable", weight: 3, decode: "You're a 2am option, not a plan." },
  { text: "we should hang out sometime", category: "unavailable", weight: 2.5, decode: "A breadcrumb with no actual date attached." },
  { text: "i'll let you know", category: "unavailable", weight: 2, decode: "They won't." },
  { text: "been busy", category: "unavailable", weight: 2, decode: "You're not a priority, just an option." },
  { text: "wyd", category: "unavailable", weight: 1.5, decode: "Minimum effort, maximum hope you reply." },

  // controlling
  { text: "who were you with", category: "controlling", weight: 3, decode: "Monitoring, not curiosity." },
  { text: "why didn't you reply", category: "controlling", weight: 2.5, decode: "Surveillance dressed as concern." },
  { text: "you're really wearing that", category: "controlling", weight: 3, decode: "Control, disguised as a question." },
  { text: "i don't want you hanging out with them", category: "controlling", weight: 3.5, decode: "Isolating you from your people." },

  // ──────────────── 🟢 GREEN ────────────────
  // communication
  { text: "can we talk about it", category: "communication", weight: 3, decode: "Handles conflict like an adult." },
  { text: "let's talk about it", category: "communication", weight: 3, decode: "Faces problems instead of stonewalling." },
  { text: "i was wrong", category: "communication", weight: 3.5, decode: "Can admit fault. Genuinely rare and green." },
  { text: "i'm sorry that was on me", category: "communication", weight: 3.5, decode: "Accountability without being dragged to it." },
  { text: "i'd rather just ask than assume", category: "communication", weight: 3, decode: "Communicates instead of quietly resenting you." },
  { text: "how are you feeling about", category: "communication", weight: 2, decode: "Actually checks in on you." },

  // respect
  { text: "no rush take your time", category: "respect", weight: 2.5, decode: "Respects your pace." },
  { text: "what are you comfortable with", category: "respect", weight: 3.5, decode: "Asks about your boundaries. Big green." },
  { text: "only if you want to", category: "respect", weight: 3, decode: "No pressure — real consent." },
  { text: "that's totally fair", category: "respect", weight: 2, decode: "Validates you instead of arguing." },
  { text: "i respect that", category: "respect", weight: 2.5, decode: "Hears your boundary and honors it." },

  // growth
  { text: "i talked to my therapist about it", category: "growth", weight: 3, decode: "Self-aware and actually working on themselves." },
  { text: "i've been working on that", category: "growth", weight: 2.5, decode: "Owns their flaws and grows from them." },
  { text: "that's a good point", category: "growth", weight: 2, decode: "Can update their mind with new information." },

  // effort
  { text: "i made a reservation", category: "effort", weight: 3, decode: "Plans real dates." },
  { text: "i remembered you said", category: "effort", weight: 3, decode: "Actually listens and holds onto it." },
  { text: "i told my friends about you", category: "effort", weight: 2.5, decode: "Proud to have you in their life." },
  { text: "i'd love for you to meet my friends", category: "effort", weight: 3, decode: "Integrating you into their world." },
  { text: "i planned something for us", category: "effort", weight: 2.5, decode: "Puts in effort without being asked." },

  // care
  { text: "text me when you get home safe", category: "care", weight: 3, decode: "Genuinely cares whether you're okay." },
  { text: "did you eat", category: "care", weight: 2, decode: "Small, real, everyday care." },
  { text: "i'm proud of you", category: "care", weight: 2.5, decode: "Celebrates your wins instead of competing." },
  { text: "how did it go", category: "care", weight: 2, decode: "Remembers your life and follows up on it." },
  { text: "take care of yourself", category: "care", weight: 1.5, decode: "Wants you well, not just available." },
];

export const COMPILED_FLAGS: CompiledFlag[] = FLAGS.map((f) => ({
  ...f,
  polarity: POLARITY_OF[f.category],
}));
