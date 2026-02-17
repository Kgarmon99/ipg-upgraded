/**
 * iPG Upgraded - YC Interview Simulator
 * Questions and tips with categories
 */

const QUESTION_CATEGORIES = {
  product: { label: 'Product', icon: '◆' },
  traction: { label: 'Traction & Growth', icon: '▸' },
  team: { label: 'Team', icon: '◈' },
  business: { label: 'Business & Money', icon: '◇' },
  competition: { label: 'Competition', icon: '▷' },
  general: { label: 'General', icon: '○' },
};

const QUESTIONS = [
  // Product
  { text: 'So what are you working on?', category: 'product', hint: 'One clear sentence: what you do and for whom. No jargon. Then one line on why it matters.' },
  { text: 'Do you have a demo?', category: 'product', hint: 'Yes/no first. If yes, say what it shows in one line. If no, say when and what you\'ll show.' },
  { text: 'Where is the rocket science here?', category: 'product', hint: 'They want the non-obvious insight or technical/domain edge. What do you know or do that others don\'t?' },
  { text: 'How does your product work in more detail?', category: 'product', hint: 'Walk through the core flow: user does X, system does Y, outcome is Z. Keep it to 3–4 steps.' },
  { text: 'How is your product different?', category: 'product', hint: 'One or two concrete differentiators (feature, distribution, cost, speed). Avoid vague "we\'re better."' },
  { text: "What's new about what you make?", category: 'product', hint: 'The novel part: technology, approach, or timing. Why now and why you?' },
  { text: 'What, exactly, makes you different from existing options?', category: 'product', hint: 'Be specific. Compare to one or two alternatives and state the exact difference.' },
  { text: "What's the next step with the product evolution?", category: 'product', hint: 'One clear milestone (e.g. "launch X by date" or "get to N users"). Show prioritization.' },
  { text: "What part of your project are you going to build first?", category: 'product', hint: 'The smallest thing that proves demand or value. Explain why that first.' },
  { text: 'Why did you choose this idea?', category: 'product' },
  { text: 'What have you learned so far from working on your product?', category: 'product', hint: 'Concrete learnings: from users, metrics, or building. One or two that changed your plan.' },
  { text: 'Why did you pick this idea to work on?', category: 'product' },
  { text: "Someone just showed us an idea like this right before you. I don't like it. What else do you have?", category: 'product', hint: 'Stay calm. Briefly say how you\'re different, then pivot to a backup idea or another strength if you have one.' },
  // Traction & Growth
  { text: 'How many users do you have?', category: 'traction', hint: 'Give the number. Then one line on who they are or how they use the product if relevant.' },
  { text: 'What is your user growth rate?', category: 'traction', hint: 'Percentage or multiple (e.g. "20% MoM" or "2x in 6 months"). Mention the time window.' },
  { text: 'How many users are paying?', category: 'traction', hint: 'Number of paying users/customers. If none yet, say so and when you expect first revenue.' },
  { text: "What's the conversion rate?", category: 'traction', hint: 'Free-to-paid or signup-to-active, with the denominator (e.g. "5% of signups convert to paid").' },
  { text: 'Where do new users come from?', category: 'traction', hint: 'Top 1–2 channels (organic, paid, referrals). One line on what\'s working best.' },
  { text: "What is your growth like?", category: 'traction', hint: 'Trend: growing, flat, or early. One number or comparison (e.g. "up 15% this month").' },
  { text: 'What makes new users try you?', category: 'traction' },
  { text: 'Why do the reluctant users hold back?', category: 'traction' },
  { text: 'What are the top things users want?', category: 'traction' },
  { text: 'What has surprised you about user behaviour?', category: 'traction' },
  { text: 'How will you get users?', category: 'traction' },
  { text: 'How will customers and/or users find out about you?', category: 'traction' },
  { text: "What resistance will they have to trying you and how will you overcome it?", category: 'traction' },
  { text: 'How much does customer acquisition cost?', category: 'traction' },
  { text: 'What is your distribution strategy?', category: 'traction' },
  // Team
  { text: 'How did your team meet?', category: 'team' },
  { text: 'Why did your team get together?', category: 'team' },
  { text: 'Who in your team does what?', category: 'team' },
  { text: 'Who is "the boss"?', category: 'team' },
  { text: 'How do we know your team will stick together?', category: 'team' },
  { text: 'What else have you created together?', category: 'team' },
  { text: 'Will your team stick at this?', category: 'team' },
  { text: 'Who would you hire or how would you add to your team?', category: 'team' },
  { text: 'Who would be your next hire?', category: 'team' },
  { text: 'What domain expertise do you have?', category: 'team' },
  { text: 'What systems have you hacked?', category: 'team' },
  { text: 'Tell us about a tough problem you solved?', category: 'team' },
  { text: 'In what ways are you resourceful?', category: 'team' },
  { text: "Tell us something surprising you have done?", category: 'team' },
  { text: "What's an impressive thing you have done?", category: 'team' },
  // Business & Money
  { text: 'How will you make money?', category: 'business', hint: 'Model in one sentence (e.g. SaaS, take rate, subscription). Who pays and for what?' },
  { text: 'How much money could you make per year?', category: 'business', hint: 'TAM or realistic revenue in 3–5 years. One number with a short "if we do X" caveat.' },
  { text: 'What is your burn rate?', category: 'business', hint: 'Monthly spend. Be direct. Optional: one line on main cost (e.g. team, infra).' },
  { text: 'How long can you go before funding?', category: 'business', hint: 'Runway in months. If you have revenue, say how that extends it.' },
  { text: 'Have you raised funding?', category: 'business' },
  { text: 'Who would be your first paying customer?', category: 'business' },
  { text: 'What will you do if we don\'t fund you?', category: 'business' },
  { text: 'Will you reincorporate as a US company?', category: 'business' },
  { text: 'Would you relocate to Silicon Valley?', category: 'business' },
  // Competition
  { text: 'Who are your competitors?', category: 'competition', hint: 'Name 1–3. For each: one line on how you\'re different or why you win.' },
  { text: 'Who might become competitors?', category: 'competition' },
  { text: 'What competition do you fear most?', category: 'competition', hint: 'Be honest. Name the real threat and what you\'d do if they move.' },
  { text: "Why isn't someone already doing this?", category: 'competition', hint: 'Timing, insight, or execution edge. Why has the market waited for you?' },
  // General / Vision
  { text: 'What do you understand that others don\'t?', category: 'general', hint: 'Your unique insight about the market, tech, or users. One clear statement.' },
  { text: 'Why will you succeed?', category: 'general', hint: 'One or two reasons: team, traction, insight, or unfair advantage. Be specific.' },
  { text: 'How big an opportunity is there?', category: 'general', hint: 'Market size (TAM/SAM) in dollars. One number and how you got it.' },
  { text: 'What problems/hurdles are you anticipating?', category: 'general' },
  { text: 'Who would use your product?', category: 'general' },
  { text: 'How are you meeting customers?', category: 'general' },
  { text: 'How are you understanding customer needs?', category: 'general' },
  { text: 'What are you going to do next?', category: 'general' },
  { text: 'Who needs what you\'re making?', category: 'general' },
  { text: 'How do you know customers need what you\'re making?', category: 'general' },
  { text: 'What obstacles will you face and how will you overcome them?', category: 'general' },
  { text: 'What are the key things about your field that outsiders don\'t understand?', category: 'general' },
  { text: 'If your startup succeeds, what additional areas might you be able to expand into?', category: 'general' },
  { text: 'Six months from now, what\'s going to be your biggest problem?', category: 'general' },
  { text: 'What do you understand about your users?', category: 'general' },
  { text: "What's the funniest thing that has happened to you?", category: 'general' },
  { text: "What's the worst thing that has happened?", category: 'general' },
  { text: "What's the biggest mistake you have made?", category: 'general' },
  { text: 'How do you know people want this?', category: 'general' },
  { text: 'What do you know about this space/product others don\'t know?', category: 'general' },
];

/** Pick one question per calendar day (same question all day) */
function getQuestionOfTheDay() {
  const today = new Date();
  const seed = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n << 5) - n + seed.charCodeAt(i);
  const idx = Math.abs(n) % QUESTIONS.length;
  return { ...QUESTIONS[idx] };
}

/** Lines the "interviewer" might say after an answer (pushback / follow-up) */
const FOLLOW_UP_LINES = [
  "Can you be more specific?",
  "Why that number?",
  "I don't quite get it. Explain in one sentence.",
  "What's the evidence for that?",
  "How do you know?",
  "Go deeper.",
  "So what?",
  "Why now?",
  "What's the one thing that would change your mind?",
  "Give me an example.",
  "Who exactly are the users?",
  "What have you built so far?",
  "Why will you win?",
  "What's the bottleneck?",
];

const TIPS = [
  'Try to have quick and concise answers.',
  'Answer in 2 to 3 sentences when possible.',
  'Answer like you would in a conversation—this is not a presentation.',
  'Be substantive and get straight to the point.',
  'Avoid "um" and "uh"—they don\'t lend an aura of intelligence.',
  'Use precise and concise language.',
  'Match their tempo: YC partners talk quickly.',
  'Do not beat around the bush. Do not hem and haw.',
  'Lead with the answer, then briefly support it.',
  'If you don\'t know, say so—then offer what you do know.',
];
