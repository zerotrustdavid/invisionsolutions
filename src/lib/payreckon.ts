/**
 * PayReckon: a separate product David built and runs, surfaced from this site.
 *
 * Every claim here is drawn from the PayReckon repository itself
 * (github.com/zerotrustdavid/payreckon). Do not add feature claims, user
 * counts, or accuracy guarantees that cannot be pointed at in that codebase:
 * this site is the credibility layer for a security consultancy, and an
 * unverifiable claim costs more than it gains.
 *
 * PayReckon carries a "not financial advice" disclaimer of its own. Anywhere
 * this site describes what it calculates, that disclaimer travels with it.
 */

export const PAYRECKON_URL = "https://www.payreckon.co.uk";
export const PAYRECKON_FEEDBACK_URL = "https://www.payreckon.co.uk/feedback";
export const PAYRECKON_REPO_URL = "https://github.com/zerotrustdavid/payreckon";

export const PAYRECKON_DISCLAIMER =
  "PayReckon produces estimates for planning purposes and is not financial advice. Confirm your position with a qualified accountant before acting on it.";

export const PAYRECKON = {
  name: "PayReckon",
  tagline:
    "UK take-home pay calculators for contractors and employees: inside IR35 through an umbrella, outside IR35 through your own limited company, or permanent on PAYE, all behind one tax engine so the comparison is genuinely like for like.",
  short:
    "UK take-home pay, compared across umbrella, limited company, and PAYE.",
  problem:
    "Deciding how to be paid in the UK is genuinely hard to reason about. A day rate and a salary are not comparable numbers, and most calculators handle one arrangement in isolation. Comparing them means running three different tools that disagree with each other and hoping the difference is real rather than a modelling artefact.",
  built:
    "PayReckon runs all three arrangements through the same tax engine. Income tax, National Insurance, dividend tax, and student loan repayments are calculated by shared code, so identical taxable income is taxed identically no matter which arrangement produced it. The calculators diverge only where the tax treatment genuinely does.",
} as const;

/** The three arrangements PayReckon models. */
export const PAYRECKON_CALCULATORS = [
  {
    name: "Inside IR35",
    route: "Umbrella company",
    body: "Assignment rate through to take-home: umbrella margin, employer's NI, Apprenticeship Levy, employer pension, and rolled-up versus accrued holiday pay.",
  },
  {
    name: "Outside IR35",
    route: "Limited company",
    body: "Corporation tax with marginal relief, salary and dividend strategy, expenses, Employment Allowance, joint ownership, and Business Asset Disposal Relief.",
  },
  {
    name: "Permanent",
    route: "PAYE salary",
    body: "Bonus, overtime, cash allowances, benefits in kind, and pension contributions across all three relief methods.",
  },
] as const;

/**
 * Engineering detail. This is the part that earns PayReckon its place on a
 * consultancy site: it evidences the same discipline the consultancy sells.
 */
export const PAYRECKON_RIGOUR = [
  {
    title: "Solved, not approximated",
    body: "In an umbrella calculation, employer's NI, the Apprenticeship Levy, and employer pension are deducted from the assignment rate but charged on the gross pay that remains, so each depends on the other. PayReckon solves that relationship algebraically per NI branch, and a round-trip test asserts that gross pay plus every employment cost returns the assignment rate exactly.",
  },
  {
    title: "Every rate cited to source",
    body: "Figures come from gov.uk and gov.scot with the source URL recorded beside the number. Rates are never edited in place when a new tax year arrives. A new file is added, so historical calculations stay reproducible.",
  },
  {
    title: "Correctness held by tests",
    body: "The calculation layer is pure, unit-tested functions with no UI code involved in any calculation, so the engine can be verified independently of how it is displayed.",
  },
  {
    title: "Accessibility enforced, not eyeballed",
    body: "A palette check holds every text colour to WCAG AA against the surface it actually renders on, and verifies no two chart fills collapse into each other under protanopia, deuteranopia, or tritanopia. It exits non-zero, so a change that breaks contrast cannot land quietly.",
  },
] as const;

export const PAYRECKON_AUDIENCE = [
  {
    title: "Independent contractors",
    body: "Weighing a contract against a permanent offer, or working out what a day rate is genuinely worth once employment costs and tax are accounted for.",
  },
  {
    title: "Consultancies and small businesses",
    body: "Modelling what an engagement actually costs, and understanding the difference between engaging someone inside or outside IR35.",
  },
  {
    title: "Anyone going independent",
    body: "Leaving employment for the first time and trying to work out whether the numbers hold up before committing.",
  },
] as const;

/** Coverage claims, all verifiable in the repository's constants. */
export const PAYRECKON_COVERAGE = [
  "2024/25, 2025/26 and 2026/27 tax years",
  "Rest-of-UK and Scottish income tax",
  "Tax codes and NI category letters",
  "Student loan plans 1, 2, 4, 5 and postgraduate",
  "Three pension relief methods",
  "Blind Person's and Marriage Allowance",
];
