/**
 * English Lane A content templates — spec §1.4.1.b "helping-family" pillar.
 *
 * Audience: second- and third-generation Hispanic Americans, English-native,
 * helping their immigrant parents navigate the US financial system. They
 * search NerdWallet in English but NerdWallet doesn't address the
 * "helping my immigrant family" context.
 *
 * CRITICAL: every prompt explicitly forbids translation from Spanish. The
 * brief is English-native, the queries are English-native, the voice is
 * bicultural English. The translation-detection lint will block insertions
 * that exhibit translation markers.
 */

import { US_SEO_SUFFIX } from "./us-content-calendar";

export type EnAuthorSlug = "javier-keough" | "sabrina-keough";

export type EnContentTopic = {
  slug: string;
  cluster:
    | "credit"
    | "insurance"
    | "mortgage"
    | "taxes"
    | "healthcare-aca"
    | "banking-and-remittances";
  /** Maps to articles.category for filtering compat with existing queries. */
  category:
    | "prestamos"
    | "seguros"
    | "educacion"
    | "remesas"
    | "tarjetas"
    | "ahorro";
  imageQuery: string;
  preferredAuthor: EnAuthorSlug;
  prompt: string;
  qualityGate?: {
    minWordCount?: number;
    allowMissingTable?: boolean;
    allowMissingCallout?: boolean;
  };
};

// ─── Shared English voice + compliance suffix ─────────────────────────────
// Sister to US_SEO_SUFFIX (Spanish). Adapted for English-native register,
// FTC affiliate disclosure in English, and the bicultural-helper voice.

const EN_VOICE_SUFFIX = `

CRITICAL — VOICE RULES (this is the make-or-break of Lane A):
- You are writing for a US English-native reader who happens to be bicultural. NOT for a Spanish-speaker translating their thoughts.
- Use natural US English personal-finance register — conversational, not over-formal, not journalistic-stilted.
- DO NOT translate from Spanish. The brief is English-native. The reader searches in English. The article is written from scratch in English.
- AVOID calque expressions: "make a question" (use "ask"), "have X years" (use "be X years old"), "realize" as Spanish "realizar" (use "make/do/perform"), "the same applies" stays OK, "the same works" does not.
- AVOID copula-heavy openings: do NOT start more than ~15% of sentences with "It is / There is / This is / That is."
- AVOID over-long sentences. Target average 14-22 words per sentence. Spanish averages longer; if your sentences average >25 words, you are translating-in-your-head — rewrite shorter.
- Code-switching is permitted where natural: "Your mom probably calls it 'el ITIN' but the IRS calls it an Individual Taxpayer Identification Number." Use Spanish for proper nouns and quotation, not for grammar.
- Address the reader as the HELPER not the family member: "If you're helping your mom with her ITIN..." NOT "If you have an ITIN..."

GEO / WELTER HEADING DISCIPLINE (mandatory):
- Each H2 minimum 8 words, carries the audience-context (helping family) + topic + year if temporal.
- Each H3 minimum 6 words, answers a sub-question.
- BANNED standalone H2/H3: "Introduction", "Conclusion", "FAQ", "How it works", "Summary", "Pros and cons".
  Allowed when expanded: "## Frequently asked questions about adding an immigrant parent as authorized user in 2026" — yes; "## FAQ" — no.

CHUNK INDEPENDENCE (mandatory):
- BANNED at start of paragraphs: "As mentioned above", "As we saw earlier", "Going back to", "Later we'll see", "Earlier we discussed".
- Every body paragraph carries one piece of locally-true info: a number, a date, a proper noun, an agency name, a statute reference.

QUERY FAN-OUT (mandatory):
- Write ONE H3 ending in a question mark for each of 5 sub-queries the article should rank for. First sentence under each H3 answers it directly.

REAL-DATA BLOCK (mandatory, once per article):
- One section with verifiable data citing a primary source URL in markdown.
- Acceptable sources: IRS.gov, CFPB.gov, Healthcare.gov, CMS.gov, HUD.gov, FRED, Census ACS, KFF.org, NILC.org, Brookings, Urban Institute, state DOI/DFS.
- Format: H2 with topic + year, then prose/table with the cited figure and source URL.

CITATION DENSITY (mandatory): minimum 2 distinct authoritative URLs (not finazo.us, not cubierto.ai, not hogares.ai). 1 cited source per 250 words target.

YEAR-STAMPING (mandatory): every numeric claim carries its year — "according to the CFPB in 2024", "IRS 2026 tables", "Florida OIR 2025 rate filing".

BANNED CONTENT PATTERNS (block publication):
- Unsubstantiated savings claims ("save $147", "they're overcharging you").
- Conspiracy framing ("what your insurer doesn't want you to know").
- Urgency manipulation ("today only", "last spots").
- Definitive promises without disclaimer ("you'll definitely qualify").
- Cubierto as insurer ("Cubierto insures you" — Cubierto is a BROKER; use "Cubierto connects you with insurers").
- Hogares as lender ("Hogares lends you" — Hogares is a BROKER; use "Hogares connects you with wholesalers").
- Any "the best" / "the cheapest" without sourced comparison.

REQUIRED STRUCTURAL ELEMENTS:
- One callout box right after the intro:
  > **The key points:** point 1.
  > point 2.
  > point 3.
- One markdown comparison table with header + separator row.
- Inline image markers — exactly TWO per article:
  ![INLINE: hispanic american adult helping immigrant parent with documents]()
  ![INLINE: bicultural family looking at phone screen together]()
  Place the first right after the callout; the second around the 2/3 mark.

AFFILIATE DISCLOSURE — do NOT include inside the article. The affiliate
disclosure lives on the /legal page and in the persistent site footer
(NerdWallet pattern). Don't write "> **Disclosure:**..." in the article
Markdown. Mentioning Cubierto, Hogares or other partners by name in the
body when relevant to the topic is fine; an in-article disclosure callout
is not.

INTERNAL LINKS — use canonical English paths where available:
- English hub → /en
- Lane A pillar → /en/helping-family
- Lane B pillar → /en/research
- Spanish counterpart Insurance hub → /seguros
- Spanish counterpart Credit hub → /credito
- Spanish counterpart Mortgage hub → /hipotecas
- Spanish counterpart ACA hub → /aseguranza-salud

CUBIERTO/HOGARES HANDOFF (when topic touches insurance or mortgage):
> [Cubierto is our affiliated insurance broker — when the family member also needs Spanish service, Cubierto's Spanish-primary WhatsApp flow is the obvious bridge.](https://wa.me/13055551234?text=Hello%20Carmen)
> [Hogares is our affiliated mortgage broker for ITIN and non-QM borrowers.](https://wa.me/13055551234?text=Hello%20Sofia)

At the end of the article:
META: [150-160 char meta description with the primary English keyword]
KEYWORDS: [6-8 keywords comma-separated, low to high competition]

Output: valid Markdown only. No meta-commentary about the process.`;

// ─── Helpers ───────────────────────────────────────────────────────────────

const Y = 2026;

function topic(args: {
  slug: string;
  cluster: EnContentTopic["cluster"];
  category: EnContentTopic["category"];
  preferredAuthor?: EnAuthorSlug;
  imageQuery: string;
  brief: string;
  fanOutQuestions: string[];
  primaryKeyword: string;
  h1: string;
  dataSourceHint: string;
}): EnContentTopic {
  const fanOutBlock = args.fanOutQuestions
    .map((q, i) => `${i + 1}. ${q}`)
    .join("\n");
  return {
    slug: args.slug,
    cluster: args.cluster,
    category: args.category,
    imageQuery: args.imageQuery,
    preferredAuthor: args.preferredAuthor ?? "javier-keough",
    prompt: `You are writing an English-language Lane A article for Finazo — a Spanish-language personal finance publisher serving Hispanic families in the US. This article is for second- and third-generation Hispanic Americans helping their immigrant family members.

The brief is ENGLISH-NATIVE. You write from scratch in English. You do NOT translate from any Spanish version. If a Spanish counterpart exists, you have NOT read it.

Cluster: /en/helping-family/${args.cluster}
Primary keyword: "${args.primaryKeyword}"
H1: "${args.h1}"
Target year context: ${Y}

EDITORIAL BRIEF:
${args.brief}

DATA SOURCES TO CITE (with year-stamped figures, URL in markdown):
${args.dataSourceHint}

FAN-OUT — write exactly one H3 ending in a question mark for each of these 5 sub-queries; first sentence under each H3 answers it directly:
${fanOutBlock}

Target length: 1500-2000 words.${EN_VOICE_SUFFIX}${US_SEO_SUFFIX}`,
    qualityGate: {
      minWordCount: 1500,
    },
  };
}

// ─── Lane A topics: Credit (4) ────────────────────────────────────────────

const CREDIT_TOPICS: EnContentTopic[] = [
  topic({
    slug: "adding-immigrant-parents-as-authorized-users-2026",
    cluster: "credit",
    category: "tarjetas",
    imageQuery: "hispanic american helping mother credit card form",
    brief: "Walk the bicultural reader through adding their immigrant parent as an authorized user on the reader's own credit card. Cover which issuers accept ITIN-only authorized users (Discover, Capital One, AmEx — verify each issuer's policy), what reports to the bureaus on the parent's file vs only the primary's, how long it takes to show up, and the privacy/legal implications. Mention that authorized-user tradeline boost works for ITIN holders the same as SSN holders. Address the reader as the helper.",
    fanOutQuestions: [
      "Which credit card issuers let me add an ITIN-only parent as authorized user in 2026?",
      "Will the credit history report to my parent's ITIN file with all three bureaus?",
      "How long until my parent sees a credit score after I add them?",
      "What are the legal and privacy risks of adding my parent as authorized user?",
      "Will adding my parent hurt my own credit score?",
    ],
    primaryKeyword: "add immigrant parent as authorized user credit card",
    h1: "How to add your immigrant parent as authorized user on your credit card in 2026",
    dataSourceHint:
      "CFPB authorized-user research, MyFICO documentation on tradeline reporting (cite specific URLs), individual issuer policies on AU enrollment.",
  }),
  topic({
    slug: "cosigning-for-itin-family-members-2026",
    cluster: "credit",
    category: "tarjetas",
    imageQuery: "hispanic family signing loan document",
    brief: "Explain when cosigning for an ITIN family member makes sense vs when it backfires. Cover the legal exposure (you're 100% liable, not 50%), which lenders accept cosigners with one party having ITIN and one having SSN, what happens if the primary defaults, and how to remove yourself as cosigner later. Be honest — the answer is often 'don't cosign, do something else instead.'",
    fanOutQuestions: [
      "What legal exposure do I have when I cosign with my ITIN parent?",
      "Which lenders accept a mixed SSN-ITIN cosigner setup in 2026?",
      "What happens to my credit if my immigrant parent misses a payment?",
      "Can I remove myself as cosigner later?",
      "What are the alternatives to cosigning that protect me?",
    ],
    primaryKeyword: "cosigning for ITIN family member",
    h1: "Cosigning for your ITIN family member: the legal reality nobody tells you",
    dataSourceHint:
      "CFPB guidance on cosigner liability, FTC Holder in Due Course Rule, individual lender cosigner policies.",
  }),
  topic({
    slug: "helping-parents-build-us-credit-from-zero-2026",
    cluster: "credit",
    category: "tarjetas",
    imageQuery: "hispanic mother adult daughter looking at credit card",
    brief: "Step-by-step plan to help an immigrant parent who has ITIN and zero US credit history get to a 700+ FICO in 12 months. Cover the five tools that accept ITIN (Discover it Secured, Capital One Platinum Secured, Self Visa, Kikoff, Chime Credit Builder), how to sequence them, and what the reader should and should not do as the helper. Emphasize the parent is the account holder; the reader is the coach.",
    fanOutQuestions: [
      "Which secured credit cards accept ITIN-only applicants in 2026?",
      "How long until my immigrant parent has a FICO score?",
      "Should my parent open one card or two to start?",
      "What credit utilization should my parent target each month?",
      "When does my parent graduate from secured to unsecured cards?",
    ],
    primaryKeyword: "help immigrant parent build US credit",
    h1: "How to help your immigrant parent build US credit from zero in 12 months",
    dataSourceHint:
      "MyFICO factor weights, CFPB credit-building guides (cite URL), issuer policies on ITIN secured cards (Discover, Capital One, OpenSky, Self, Kikoff).",
  }),
  topic({
    slug: "sending-credit-cards-to-relatives-abroad-risks-2026",
    cluster: "credit",
    category: "tarjetas",
    imageQuery: "credit card international mail concept",
    brief: "Honest piece on the risks of mailing a US credit card or adding a relative living abroad as authorized user. Cover the fraud-detection patterns (international transactions on a US card flag risk algorithms), card-replacement complications, and what alternatives exist (Wise card, virtual numbers, prepaid cards). Address the helper sending money home pattern.",
    fanOutQuestions: [
      "What happens if I mail my US credit card to family abroad in 2026?",
      "Will adding an authorized user living abroad trigger fraud lockouts?",
      "What are the FX and foreign-transaction costs of using a US card abroad?",
      "What are the alternatives to mailing cards (Wise, virtual cards, prepaid)?",
      "How do I protect my own credit when family uses a card on my account?",
    ],
    primaryKeyword: "send credit card to family abroad risks",
    h1: "Sending your US credit card to family abroad: the risks and the better options",
    dataSourceHint:
      "CFPB fraud reports, FTC guidance on consumer-card responsibility, individual issuer policies on international authorized users.",
  }),
];

// ─── Lane A topics: Insurance (4) ─────────────────────────────────────────

const INSURANCE_TOPICS: EnContentTopic[] = [
  topic({
    slug: "adding-itin-spouse-to-auto-policy-2026",
    cluster: "insurance",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "hispanic couple reviewing insurance documents",
    brief: "How to add a spouse who has ITIN (not SSN) to your existing auto policy. Cover which carriers accept this without surcharging, what proof of marriage the carrier wants, what happens at the next renewal, and the credit-score implication (your spouse's lack of US credit may bump your prima). Reader is the SSN-holder helper.",
    fanOutQuestions: [
      "Which auto insurers accept ITIN spouses on a joint policy in 2026?",
      "What documents do I need to add my ITIN spouse?",
      "Will my prima go up when I add an ITIN spouse?",
      "Can my ITIN spouse drive my car legally without being on the policy?",
      "How does my spouse's lack of US credit affect our joint rate?",
    ],
    primaryKeyword: "add ITIN spouse to auto insurance policy",
    h1: "Adding your ITIN spouse to your auto policy: which carriers accept it and what it costs",
    dataSourceHint:
      "State DOI rules on permitted underwriting factors, NAIC consumer guides, individual carrier policies (Progressive, GEICO, State Farm).",
  }),
  topic({
    slug: "buying-insurance-for-elderly-immigrant-parents-2026",
    cluster: "insurance",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "adult helping elderly hispanic parent insurance papers",
    brief: "Comprehensive guide for the reader buying or arranging insurance for elderly immigrant parents (over 60). Cover auto for the parent, health insurance options (Medicare eligibility for green-card holders 5+ years, ACA otherwise, alternatives if undocumented), and final expense / life insurance. Address whether the reader can be the policyholder on their parent's behalf.",
    fanOutQuestions: [
      "Can my elderly immigrant parent enroll in Medicare in 2026?",
      "What auto insurance options exist for a 70-year-old ITIN driver?",
      "Can I buy health insurance for my parents through ACA on their behalf?",
      "What final expense insurance accepts ITIN applicants over 65?",
      "Should I be the policyholder or my parent on a senior policy?",
    ],
    primaryKeyword: "insurance for elderly immigrant parents",
    h1: "Insurance for elderly immigrant parents: health, auto, and final expense options in 2026",
    dataSourceHint:
      "CMS Medicare eligibility rules, Healthcare.gov ACA enrollment guides, state Medicaid rules, KFF reports on senior immigrant coverage.",
  }),
  topic({
    slug: "helping-parents-understand-claims-process-in-english-2026",
    cluster: "insurance",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "adult daughter helping mother phone insurance claim",
    brief: "Walk the reader through how to translate-and-coach their non-English-speaking parent through a US insurance claim — auto accident, health claim denial, homeowners damage. Cover what to write down at the scene, how to invoke the policy's language-accommodation right, how to escalate when a claims adjuster pushes back on a low-English-proficiency claimant.",
    fanOutQuestions: [
      "What should my parent say at the accident scene if their English is limited?",
      "Can I attend my parent's claims call as their translator?",
      "How do I appeal a denied health insurance claim on behalf of my parent?",
      "What state DOI consumer protections exist for low-English claimants?",
      "When should I bring in a bilingual public adjuster or attorney?",
    ],
    primaryKeyword: "help immigrant parent insurance claim english",
    h1: "How to help your parent navigate a US insurance claim when English isn't their first language",
    dataSourceHint:
      "State DOI consumer rights guides, NAIC unfair claims practices model, federal limited-English-proficiency protections (Title VI).",
  }),
  topic({
    slug: "life-insurance-for-undocumented-family-members-2026",
    cluster: "insurance",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "hispanic family generations photo album",
    brief: "Sensitive, honest guide on life insurance options when a family member is undocumented. Cover which carriers issue term and final-expense policies without SSN (some do, with ITIN or passport), whether the policy pays out if the insured is later deported, beneficiary considerations (the reader as US-citizen beneficiary), and how this differs from typical advice. Acknowledge the reader's specific concern.",
    fanOutQuestions: [
      "Can my undocumented family member get a US life insurance policy in 2026?",
      "Which carriers accept ITIN or passport instead of SSN for life insurance?",
      "Will the policy still pay if my family member is deported before death?",
      "Should I as a US citizen be the beneficiary or policy owner?",
      "What are the tax implications of receiving a life insurance payout?",
    ],
    primaryKeyword: "life insurance undocumented family member",
    h1: "Life insurance for an undocumented family member: what's possible and how to structure it",
    dataSourceHint:
      "NAIC life insurance buyer's guide, IRS Publication 525 on life insurance taxation, individual carrier ITIN policies (Ethos, Haven Life, Ladder).",
  }),
];

// ─── Lane A topics: Mortgage (3) ──────────────────────────────────────────

const MORTGAGE_TOPICS: EnContentTopic[] = [
  topic({
    slug: "cosigning-mortgage-with-itin-parent-2026",
    cluster: "mortgage",
    category: "prestamos",
    imageQuery: "adult son hispanic mother home keys",
    brief: "How cosigning a non-QM mortgage with an ITIN parent works. Cover the wholesaler landscape (ACC Mortgage, Citadel, Athas, Newfi), the income-blending math, how the cosigner's credit affects the rate, and the exit strategy (refinancing the parent off the loan later). Reader is the SSN-holder cosigner; parent is the primary occupant.",
    fanOutQuestions: [
      "Which mortgage wholesalers accept a mixed SSN-ITIN cosigner in 2026?",
      "How does my W-2 income blend with my ITIN parent's 1099 income?",
      "How does cosigning affect my credit and future borrowing capacity?",
      "What's the exit strategy if I want to refinance out later?",
      "What documents will the wholesaler want from both of us?",
    ],
    primaryKeyword: "cosign mortgage with ITIN parent",
    h1: "Cosigning a mortgage with your ITIN parent: how the income blend works in 2026",
    dataSourceHint:
      "MBA non-QM market reports, CFPB Qualified Mortgage rules, individual wholesaler ITIN guidelines (ACC, Citadel, Athas).",
  }),
  topic({
    slug: "buying-house-with-mixed-status-family-2026",
    cluster: "mortgage",
    category: "prestamos",
    imageQuery: "hispanic family different generations house front",
    brief: "Strategic guide for a household with mixed migratory statuses buying a home together. Cover whose name should be on the title, whose income counts toward the application, which wholesalers handle the structure, and the long-term tax/inheritance implications. This is the article the household sits down at the kitchen table with.",
    fanOutQuestions: [
      "Whose name should be on the title when family has mixed status?",
      "Whose income counts toward the mortgage application?",
      "What property tax exemptions apply for mixed-status owners?",
      "What inheritance implications should we plan for?",
      "Which wholesaler best handles a mixed-status borrower set?",
    ],
    primaryKeyword: "buying house with mixed status family",
    h1: "Buying a house with mixed-status family: title, income, and inheritance planning",
    dataSourceHint:
      "HUD homeownership guidance, IRS estate-tax rules, state homestead exemption rules, NILC mixed-status household analyses.",
  }),
  topic({
    slug: "helping-parents-refinance-when-they-dont-speak-english-2026",
    cluster: "mortgage",
    category: "prestamos",
    imageQuery: "adult daughter mother phone mortgage document",
    brief: "Practical guide for helping an immigrant parent refinance their existing mortgage when their English is limited. Cover the federal right to translated loan documents (RESPA limited-English-proficiency provisions), the bilingual-broker question, the FHA streamline option for FHA-loan parents, and how to spot a predatory refi pitch targeted at low-English borrowers.",
    fanOutQuestions: [
      "What federal rights does my parent have to Spanish-language refi documents?",
      "Should I use a bilingual broker or my parent's current lender to refinance?",
      "What FHA streamline refinance options exist for my parent in 2026?",
      "How do I spot a predatory refinance pitch targeted at my parent?",
      "Should I refinance the loan into my own name instead?",
    ],
    primaryKeyword: "help immigrant parent refinance mortgage english",
    h1: "Helping your parent refinance when their English is limited: rights, brokers, red flags",
    dataSourceHint:
      "RESPA Section 19 LEP guidance, CFPB enforcement actions against predatory refi marketers, HUD FHA streamline rules.",
  }),
];

// ─── Lane A topics: Taxes (3) ─────────────────────────────────────────────

const TAX_TOPICS: EnContentTopic[] = [
  topic({
    slug: "helping-parents-file-with-itin-2026",
    cluster: "taxes",
    category: "educacion",
    imageQuery: "hispanic adult helping parent tax forms",
    brief: "End-to-end guide for filing your immigrant parent's federal taxes when they have ITIN, not SSN. Cover Form W-7 if they don't have ITIN yet, the right tax preparer to use (Acceptance Agents vs commercial preparers), and the credits/deductions that apply (Child Tax Credit if grandkids have SSN, Credit for Other Dependents, ACA premium tax credit reconciliation).",
    fanOutQuestions: [
      "Can I file my immigrant parent's taxes on their behalf in 2026?",
      "What tax credits can my parent claim with ITIN?",
      "Should we use an Acceptance Agent or a commercial preparer?",
      "What documents does my parent need before we sit down to file?",
      "What happens if my parent has unreported 1099 cash work?",
    ],
    primaryKeyword: "help immigrant parent file taxes ITIN",
    h1: "Helping your immigrant parent file federal taxes with ITIN in 2026",
    dataSourceHint:
      "IRS Publication 519 (US Tax Guide for Aliens), IRS Form W-7 instructions, IRS Acceptance Agent locator, IRS Publication 972 on Child Tax Credit.",
  }),
  topic({
    slug: "claiming-immigrant-parents-as-dependents-2026",
    cluster: "taxes",
    category: "educacion",
    imageQuery: "hispanic family generations home",
    brief: "Can the reader claim an immigrant parent as a dependent on their own tax return? Cover the IRS qualifying-relative tests (support, income, citizenship/residency), the Credit for Other Dependents ($500), and the specific carve-outs for non-citizen parents. Address the common confusion around whether parents need to live with the reader.",
    fanOutQuestions: [
      "Can I claim my immigrant parent as a dependent in 2026?",
      "Does my parent need to live with me to qualify as my dependent?",
      "What is the Credit for Other Dependents and how does it apply to my parent?",
      "What if my parent lives outside the US — do they still qualify?",
      "Can I claim multiple immigrant family members as dependents?",
    ],
    primaryKeyword: "claim immigrant parent as dependent taxes",
    h1: "Claiming your immigrant parent as a dependent on your 2026 tax return",
    dataSourceHint:
      "IRS Publication 501 (Dependents, Standard Deduction, and Filing Information), IRS Publication 519, IRS qualifying-relative tests.",
  }),
  topic({
    slug: "itin-renewal-help-for-elderly-parents-2026",
    cluster: "taxes",
    category: "educacion",
    imageQuery: "elderly hispanic parent adult helper documents",
    brief: "Walk the reader through renewing an elderly parent's ITIN. Cover when renewal is required (expired ITIN, no use for 3 consecutive tax years), the W-7 renewal process, the elderly-specific complications (passport currency, finding an Acceptance Agent close to home), and what happens to the parent's refund if they file with an expired ITIN.",
    fanOutQuestions: [
      "How do I know if my parent's ITIN is expired in 2026?",
      "What documents are needed for ITIN renewal for an elderly parent?",
      "Can I file the W-7 renewal on my parent's behalf?",
      "What happens to my parent's refund if we file with expired ITIN?",
      "How long does ITIN renewal take in 2026?",
    ],
    primaryKeyword: "ITIN renewal elderly parent",
    h1: "Helping your elderly parent renew their ITIN before tax season 2026",
    dataSourceHint:
      "IRS ITIN program updates, IRS Acceptance Agent program, IRS Publication 1915, individual tax preparer organization guidance.",
  }),
];

// ─── Lane A topics: Healthcare / ACA (3) ──────────────────────────────────

const ACA_TOPICS: EnContentTopic[] = [
  topic({
    slug: "enrolling-mixed-status-family-in-aca-2026",
    cluster: "healthcare-aca",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "hispanic family laptop healthcare gov",
    brief: "The article we'd want every English-speaking adult in a mixed-status household to read before Open Enrollment. Cover whose income counts on the Healthcare.gov application, which family members can enroll vs not, how subsidies are calculated, and how to handle the household-vs-tax-unit distinction. This is the most underserved English content in the immigrant-finance corpus.",
    fanOutQuestions: [
      "Who in my mixed-status family can enroll in ACA Marketplace in 2026?",
      "Whose income do I report on the Healthcare.gov application?",
      "Will applying for my eligible family members affect my undocumented relatives' status?",
      "How is the premium tax credit calculated for a mixed-status household?",
      "What happens at tax time when we reconcile the subsidy?",
    ],
    primaryKeyword: "enroll mixed status family ACA",
    h1: "Enrolling your mixed-status family in ACA Marketplace coverage in 2026",
    dataSourceHint:
      "Healthcare.gov mixed-status enrollment guidance, NILC mixed-status household analyses, KFF reports, CMS Form 8962 reconciliation rules.",
  }),
  topic({
    slug: "finding-spanish-speaking-doctor-for-parents-2026",
    cluster: "healthcare-aca",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "spanish speaking doctor consultation hispanic patient",
    brief: "Practical guide to finding a competent Spanish-speaking primary care doctor in the US. Cover the in-network search tools (Zocdoc, insurance directories), how to verify Spanish fluency vs 'Spanish-speaking staff' (different things), the FQHC option, and what to do in rural states where bilingual providers are scarce. Reader is helping their parent.",
    fanOutQuestions: [
      "Where do I search for a Spanish-speaking doctor in network in 2026?",
      "How do I verify the doctor actually speaks Spanish vs has bilingual staff?",
      "What FQHC options exist for Spanish-speaking primary care?",
      "What should my parent do if no bilingual doctor is in network?",
      "Can I bring my parent to appointments as their translator?",
    ],
    primaryKeyword: "find spanish speaking doctor for parents",
    h1: "Finding a Spanish-speaking doctor for your immigrant parent in 2026",
    dataSourceHint:
      "HRSA FQHC locator, Title VI language access requirements, state language-access enforcement records, CMS interpreter-services guidance.",
  }),
  topic({
    slug: "paying-medical-bills-for-undocumented-parents-2026",
    cluster: "healthcare-aca",
    category: "seguros",
    preferredAuthor: "sabrina-keough",
    imageQuery: "hispanic family hospital bill paperwork",
    brief: "How to handle a US medical bill for an undocumented parent. Cover the IRS 501(r) charity care obligation of non-profit hospitals, Emergency Medicaid eligibility (covers all-status emergencies), the negotiation playbook for self-pay bills, and when bankruptcy/medical-debt-buyer protections kick in.",
    fanOutQuestions: [
      "What is IRS 501(r) charity care and how do I apply for my parent?",
      "Can my undocumented parent qualify for Emergency Medicaid in 2026?",
      "How do I negotiate a self-pay hospital bill on my parent's behalf?",
      "What protection does my parent have from medical debt collectors?",
      "Will helping pay my parent's medical bill affect my own taxes?",
    ],
    primaryKeyword: "pay medical bills undocumented parent",
    h1: "Handling US medical bills for your undocumented immigrant parent in 2026",
    dataSourceHint:
      "IRS 501(r) regulations, CMS Emergency Medicaid policy, CFPB medical-debt collection rules, KFF hospital charity-care reports.",
  }),
];

// ─── Lane A topics: Banking & Remittances (3) ─────────────────────────────

const BANKING_TOPICS: EnContentTopic[] = [
  topic({
    slug: "helping-parents-open-bank-account-with-itin-2026",
    cluster: "banking-and-remittances",
    category: "educacion",
    imageQuery: "adult helping hispanic parent bank account application",
    brief: "Step-by-step for helping an immigrant parent open their first US bank account using ITIN. Cover which banks accept ITIN universally vs branch-by-branch (Chase, BofA, Wells Fargo, vs neobanks like Chime, Cash App), the documents needed, in-person vs digital opening, and what features the parent should ask for (Spanish-language support, low minimums, no foreign-transaction fees).",
    fanOutQuestions: [
      "Which US banks accept ITIN to open an account in 2026?",
      "Does my parent need to open the account in person or can it be done online?",
      "What documents should we bring to the appointment?",
      "Which neobank is best for an ITIN-only senior immigrant?",
      "Should I have joint access on my parent's account?",
    ],
    primaryKeyword: "help immigrant parent open bank account ITIN",
    h1: "Helping your immigrant parent open their first US bank account with ITIN",
    dataSourceHint:
      "FDIC unbanked household survey, FFIEC ITIN banking guidance, individual bank account-opening policies (Chase, BofA, Chime).",
  }),
  topic({
    slug: "sending-money-home-without-fees-2026",
    cluster: "banking-and-remittances",
    category: "remesas",
    imageQuery: "phone wise remitly app remittance",
    brief: "Bicultural guide to sending money home for the reader who's helping immigrant parents (or sending themselves). Cover the corridor economics — Wise vs Remitly vs Western Union vs Xoom across Mexico, El Salvador, Guatemala, Honduras, Dominican Republic — and how to read the FX spread vs the flat fee. Include the World Bank Remittance Prices Worldwide data as the citation.",
    fanOutQuestions: [
      "Which remittance service is cheapest for sending $200 to Mexico in 2026?",
      "How do I read the FX spread vs the flat fee on a remittance offer?",
      "Are bank wires ever cheaper than Wise or Remitly for remittances?",
      "What happens if my parent receives multiple large remittances per month?",
      "Which remittance service has the best customer support in Spanish?",
    ],
    primaryKeyword: "send money home cheapest remittance service",
    h1: "How to send money home to family in Latin America without overpaying on fees in 2026",
    dataSourceHint:
      "World Bank Remittance Prices Worldwide (cite URL with year), CFPB remittance transfer rule, FRB studies on remittance cost trends.",
  }),
  topic({
    slug: "protecting-elderly-parents-from-remittance-scams-2026",
    cluster: "banking-and-remittances",
    category: "remesas",
    imageQuery: "elderly hispanic parent suspicious phone call",
    brief: "Practical guide for the reader protecting their elderly immigrant parent from remittance scams (impersonation calls demanding money for a 'family emergency', romance scams targeting widowed immigrants, fake IRS callers). Cover the FTC scam categories that overrepresent in this audience, the playbook for verifying and intervening, and the right reporting authorities.",
    fanOutQuestions: [
      "What remittance scams target elderly Hispanic immigrants most in 2026?",
      "How do I verify a 'family emergency' call is real before my parent sends money?",
      "What red flags should I teach my parent to spot in scam calls?",
      "Where do I report a scam targeting my parent?",
      "Can the remittance service reverse the transfer if my parent has been scammed?",
    ],
    primaryKeyword: "protect elderly parent remittance scam",
    h1: "Protecting your elderly immigrant parent from remittance and impersonation scams in 2026",
    dataSourceHint:
      "FTC Consumer Sentinel scam reports, CFPB elder financial exploitation research, state AG fraud reports.",
  }),
];

// ─── Public API ────────────────────────────────────────────────────────────

export function getAllEnTopics(): EnContentTopic[] {
  return [
    ...CREDIT_TOPICS,
    ...INSURANCE_TOPICS,
    ...MORTGAGE_TOPICS,
    ...TAX_TOPICS,
    ...ACA_TOPICS,
    ...BANKING_TOPICS,
  ];
}

export function countEnTopics(): number {
  return getAllEnTopics().length;
}
