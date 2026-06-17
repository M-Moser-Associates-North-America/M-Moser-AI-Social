// All content for AI Workshop OS — Session 1: Core Foundations.
// This is the canonical source for the Session 1 workshop material; the
// interactive page is rendered entirely from the data below.

export type SectionId =
  | 'opening'
  | 'roadmap'
  | 'enterprise'
  | 'models'
  | 'delegation'
  | 'customizing'
  | 'lab'
  | 'library';

export type AccentKey = 'accent' | 'cyan' | 'mint' | 'magenta' | 'green' | 'yellow';

export const accentVar: Record<AccentKey, string> = {
  accent: 'var(--accent)',
  cyan: 'var(--cyan)',
  mint: 'var(--mint)',
  magenta: 'var(--magenta)',
  green: 'var(--green)',
  yellow: 'var(--yellow)',
};

// --- Presentation section map (left rail + slide order) ----------------------

export type NavSection = {
  id: SectionId;
  index: string;
  label: string;
};

export const navSections: NavSection[] = [
  { id: 'opening', index: '00', label: 'Opening' },
  { id: 'roadmap', index: '01', label: 'Roadmap' },
  { id: 'enterprise', index: '02', label: 'Enterprise' },
  { id: 'models', index: '03', label: 'Models' },
  { id: 'delegation', index: '04', label: 'Delegation' },
  { id: 'customizing', index: '05', label: 'Personalize' },
  { id: 'lab', index: '06', label: 'Lab' },
  { id: 'library', index: '07', label: 'Library' },
];

// --- Timed 60-minute agenda --------------------------------------------------

export type AgendaItem = {
  id: SectionId;
  time: string;
  title: string;
  purpose: string;
  detail: string;
  chip: string;
  durationMinutes: number;
  accent: AccentKey;
};

export const agenda: AgendaItem[] = [
  {
    id: 'opening',
    time: '0:05',
    title: 'Opening and framing',
    purpose: 'Set the tone and define the practical outcome.',
    detail: 'Set expectations and explain the workshop series.',
    chip: 'Start',
    durationMinutes: 5,
    accent: 'accent',
  },
  {
    id: 'enterprise',
    time: '0:07',
    title: 'Enterprise advantage',
    purpose: 'Use the managed workspace and apply judgment.',
    detail: 'Use the managed workspace and apply safe-use judgment.',
    chip: 'Safe use',
    durationMinutes: 7,
    accent: 'cyan',
  },
  {
    id: 'models',
    time: '0:10',
    title: 'Models and thinking effort',
    purpose: 'Choose between speed, depth, and tool-heavy reasoning.',
    detail: 'Choose between fast answers, thinking models, higher effort, and tool-supported work.',
    chip: 'Choice',
    durationMinutes: 10,
    accent: 'mint',
  },
  {
    id: 'delegation',
    time: '0:15',
    title: 'Work delegation',
    purpose: 'Learn the reusable prompting framework.',
    detail: 'Practice role, context, task, constraints, output format, and quality checks.',
    chip: 'Core',
    durationMinutes: 15,
    accent: 'magenta',
  },
  {
    id: 'customizing',
    time: '0:12',
    title: 'Personal assistant setup',
    purpose: 'Generate starter Custom Instructions.',
    detail: 'Create starter Custom Instructions and understand memory boundaries.',
    chip: 'Setup',
    durationMinutes: 12,
    accent: 'yellow',
  },
  {
    id: 'lab',
    time: '0:11',
    title: 'Email Optimizer Lab',
    purpose: 'Create and refine a reusable workflow.',
    detail: 'Delegate, review, refine, and save a reusable workflow.',
    chip: 'Hands-on',
    durationMinutes: 11,
    accent: 'accent',
  },
];

export const totalWorkshopSeconds = 60 * 60;

// --- Opening -----------------------------------------------------------------

export const opening = {
  eyebrow: 'Session 1 | Core Foundations',
  title: 'AI Workshop OS: From Chatbot to Work Partner',
  lede: 'A live workshop surface for helping the team move from casual AI use to repeatable, safe, high-value workflows in ChatGPT Enterprise, including when to use fast answers, thinking models, and deeper reasoning.',
};

// --- Roadmap -----------------------------------------------------------------

export type RoadmapItem = {
  label: string;
  title: string;
  copy: string;
  current?: boolean;
};

export const roadmap = {
  eyebrow: 'Bi-weekly series',
  title: 'Where This Workshop Series Is Going',
  lede: 'Session 1 gives the team the operating model: safe use, model choice, clear delegation, personalization, and review. The remaining sessions turn that model into organized project spaces, connected tools, reusable skills, and team-ready workflows.',
  meta: ['8 sessions', 'Foundation first'],
  items: [
    { label: 'Session 1', title: 'Core Foundation', copy: 'Use Enterprise safely, choose the right model, and delegate work clearly.', current: true },
    { label: 'Session 2', title: 'Projects and Workspaces', copy: 'Organize chats, files, and instructions around real team work.' },
    { label: 'Session 3', title: 'Tools, Files, and Data', copy: 'Use uploads, analysis, tables, and file workflows without losing judgment.' },
    { label: 'Session 4', title: 'Research and Connectors', copy: 'Ground work in web, source material, and connected knowledge.' },
    { label: 'Session 5', title: 'Using Agent Skills', copy: 'Run reusable workflows and adapt them to team scenarios.' },
    { label: 'Session 6', title: 'Building Agent Skills', copy: 'Turn repeatable team processes into durable skill playbooks.' },
    { label: 'Session 7', title: 'Visual Engineering', copy: 'Use screenshots, sketches, diagrams, images, and design inputs.' },
    { label: 'Session 8', title: 'Team AI OS', copy: 'Combine projects, tools, skills, and governance into team workflows.' },
  ] as RoadmapItem[],
};

// --- Enterprise --------------------------------------------------------------

export type InfoCard = {
  title: string;
  accent: AccentKey;
  body?: string;
  bullets?: string[];
};

export const enterprise = {
  eyebrow: '7 minutes',
  title: 'Use the Right Environment for the Right Work',
  lede: 'Enterprise gives the team a managed, governed workspace. Good outcomes still depend on sharing only what is needed, reviewing outputs, and using the assistant as a collaborator.',
  meta: ['0:05-0:12', 'Approved workspace'],
  cards: [
    {
      title: 'Why Enterprise Matters',
      accent: 'accent',
      bullets: [
        'Approved environment for work use.',
        'Organization-managed access and available features.',
        'Business data protections by default.',
        'Security and compliance controls.',
      ],
    },
    {
      title: 'Safe Use Starts With Judgment',
      accent: 'cyan',
      body: 'Use Enterprise. Share only what is needed. Verify before using.',
      bullets: [
        'Reduce unnecessary sensitive detail.',
        'Upload files with a clear purpose.',
        'Treat first outputs as drafts.',
      ],
    },
    {
      title: 'Assistant, Not Oracle',
      accent: 'mint',
      body: 'ChatGPT is most valuable when the user manages direction, context, review, and refinement.',
    },
  ] as InfoCard[],
  mindset: {
    oracle: {
      title: 'Oracle mindset',
      body: '"Tell me the answer." One-shot questions, vague input, and assumed correctness leave too much hidden.',
    },
    assistant: {
      title: 'Assistant mindset',
      body: '"Help me work through this." Clear delegation, iterative collaboration, and active review make the output stronger.',
    },
  },
  compare: {
    head: ['Instead of...', 'Do this...'],
    rows: [
      ['Pasting unnecessary sensitive detail', 'Share only the context needed for the task'],
      ['Treating every answer as final', 'Review and verify before using'],
      ['Working in personal ChatGPT for company work', 'Use the Enterprise workspace'],
    ],
  },
};

// --- Models ------------------------------------------------------------------

export const models = {
  eyebrow: '10 minutes',
  title: 'Choose the Model and Thinking Effort',
  lede: 'Model choice is part of delegation. Start with the fastest reliable option for routine work, switch to Thinking for complex judgment, and reserve higher effort for work where depth is worth the wait.',
  meta: ['0:12-0:22', 'Speed vs depth'],
  cards: [
    {
      title: 'Default or Fast',
      accent: 'accent',
      body: 'Use when the task is familiar, reversible, and easy to review.',
      bullets: ['Quick drafts and rewrites.', 'Summaries of short material.', 'Brainstorming first passes.'],
    },
    {
      title: 'Thinking',
      accent: 'cyan',
      body: 'Use when the task has steps, tradeoffs, ambiguity, or files to reason over.',
      bullets: [
        'Planning, strategy, and risk review.',
        'Comparing options or making recommendations.',
        'Data, spreadsheet, or document analysis.',
      ],
    },
    {
      title: 'High Effort or Pro',
      accent: 'magenta',
      body: 'Use when quality matters more than speed and the answer will influence decisions.',
      bullets: [
        'Client-critical or leadership-facing work.',
        'Deep research and synthesis.',
        'Complex debugging or long-horizon planning.',
      ],
    },
  ] as InfoCard[],
  compare: {
    head: ['Choice', 'When to use it'],
    rows: [
      ['Fast / default', 'First drafts, cleanup, simple summaries, and low-risk work.'],
      ['Thinking / standard', 'Multi-step work, judgment calls, planning, analysis, or unclear inputs.'],
      ['Extended / high', 'Hard problems, important recommendations, deep comparisons, and work that needs careful review.'],
      ['Research / tools', 'Current facts, source checks, files, data, or connected workplace knowledge.'],
    ],
  },
  ruleOfThumb: {
    eyebrow: 'Rule of thumb',
    title: 'Use the smallest model choice that can do the job well.',
    paragraphs: [
      'Escalate when the answer is shallow, the task is ambiguous, the output is consequential, or the work needs evidence from files, data, or current sources.',
      'Exact labels may vary by workspace. The durable habit is choosing between speed, depth, and source-grounded work.',
    ],
    prompt:
      'Before answering, tell me whether this task needs a fast answer, Thinking, high effort, or research/tools. Explain your choice in one sentence, then complete the task.',
  },
};

// --- Delegation --------------------------------------------------------------

export const delegationFramework = [
  { n: 1, title: 'Role', hint: 'Who should ChatGPT act as?' },
  { n: 2, title: 'Context', hint: 'What does it need to know?' },
  { n: 3, title: 'Task', hint: 'What should it do?' },
  { n: 4, title: 'Constraints', hint: 'What rules should it follow?' },
  { n: 5, title: 'Output', hint: 'What shape should it return?' },
  { n: 6, title: 'Quality Check', hint: 'How should it self-review?' },
];

export const delegationSourceEmail = `Hi team,

Just following up from today's client check-in. I think we need to sort out the next steps and make sure everyone knows what they are doing. The client asked about the workshop agenda, the draft timeline, and who is owning the room setup, but I am not sure we fully landed those points. Can everyone review and send thoughts by tomorrow? Also we need to prepare something clearer for the client before Friday.

Thanks`;

export const weakPrompt = `Make this email better.

Email:
${delegationSourceEmail}`;

export const strongPrompt = `Act as a professional communications editor.

I am sending this email to an internal project team after a client check-in.
Rewrite it so it is clear, concise, and action-oriented.

Keep the tone professional but warm.
Keep it under 180 words.
Use bullets for action items.
Do not add information that is not in the original.
Before the rewrite, flag anything that is unclear or missing.

Email:
${delegationSourceEmail}`;

export const realExamples = [
  { title: 'Project kickoff', copy: 'Turn a loose agenda into a clear kickoff email with decisions needed, owners, and next steps.' },
  { title: 'Meeting notes', copy: 'Convert messy notes into decisions, actions, open questions, and missing owners without inventing details.' },
  { title: 'Leadership update', copy: 'Rewrite a rough status paragraph into situation, progress, risks, decisions needed, and next step.' },
];

export type BuilderKey = 'role' | 'context' | 'task' | 'constraints' | 'format' | 'quality';

export const builderFieldOrder: { key: BuilderKey; label: string; tall?: boolean }[] = [
  { key: 'role', label: 'Role' },
  { key: 'context', label: 'Context' },
  { key: 'task', label: 'Task', tall: true },
  { key: 'constraints', label: 'Constraints', tall: true },
  { key: 'format', label: 'Output format', tall: true },
  { key: 'quality', label: 'Quality check', tall: true },
];

export const builderScenarios: Record<string, { label: string; values: Record<BuilderKey, string> }> = {
  clientFollowup: {
    label: 'Client follow-up email',
    values: {
      role: 'Act as a professional communications editor.',
      context:
        'I am preparing an internal project team message after a client check-in where the next steps, owners, and client-ready follow-up are not yet clear.',
      task: 'Rewrite the message so it is clear, concise, and action-oriented.',
      constraints:
        'Keep the tone professional, warm, and direct. Keep it under 180 words. Do not add information that is not provided.',
      format: 'Use a short opening sentence, bullet-point action items, and a clear closing.',
      quality: 'Before rewriting, list any missing details or assumptions.',
    },
  },
  meetingNotes: {
    label: 'Meeting notes to action plan',
    values: {
      role: 'Act as a project coordinator.',
      context:
        'I have rough meeting notes from a project discussion. Some owners, deadlines, and decisions may be missing or unclear.',
      task: 'Turn the notes into a clear action plan that the team can use after the meeting.',
      constraints: 'Do not invent owners, deadlines, decisions, or facts. Mark missing information as Not specified.',
      format: 'Return sections for key decisions, action items, owners, deadlines, open questions, and risks.',
      quality: 'Flag anything that needs follow-up before the team can act confidently.',
    },
  },
  leadershipUpdate: {
    label: 'Leadership status update',
    values: {
      role: 'Act as a senior advisor preparing a leadership update.',
      context:
        'I have rough project status notes that need to be made concise, credible, and useful for senior leadership.',
      task: 'Rewrite the notes into an executive update that makes progress, risks, and decisions easy to scan.',
      constraints: 'Keep it under 250 words. Use a confident but neutral tone. Do not overstate certainty.',
      format: 'Use this structure: Situation, Progress, Risks, Decisions needed, Recommended next step.',
      quality: 'Flag anything that sounds unsupported, vague, or in need of verification.',
    },
  },
};

export const delegation = {
  eyebrow: '15 minutes',
  title: 'Prompting Is Delegation',
  lede: 'The useful question is not "what magic words should I type?" It is "what exactly am I delegating, and how will I know if the result is good?"',
  meta: ['0:22-0:37', 'Core method'],
  sourceTitle: 'Internal follow-up after a client meeting',
  sourceCopy:
    'This is the rough email both prompts operate on. The point is to show that the weak prompt has source material, but still gives ChatGPT almost no definition of success.',
};

export function buildDelegationPrompt(values: Record<BuilderKey, string>): string {
  const clean = (v: string) => v.trim();
  return [
    clean(values.role),
    clean(values.context),
    clean(values.task),
    '',
    `Constraints:\n${clean(values.constraints)}`,
    '',
    `Output format:\n${clean(values.format)}`,
    '',
    `Quality check:\n${clean(values.quality)}`,
    '',
    'Source material:\n[paste text here]',
  ]
    .filter((line, i) => line !== '' || i > 0)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n');
}

// --- Customizing -------------------------------------------------------------

export const customizing = {
  eyebrow: '12 minutes',
  title: 'Make ChatGPT Work More Like Your Assistant',
  lede: 'Custom Instructions set default working preferences. Memory can retain stable preferences. Projects are the teaser for long-running, project-specific context in Session 2.',
  meta: ['0:37-0:49', 'Settings -> Personalization'],
  instructions: [
    {
      title: 'Instruction 1: How I Work',
      hint: 'Starter text for Custom Instructions.',
      text: 'I use ChatGPT for professional work, including drafting, summarizing, planning, reviewing, and improving communication.',
    },
    {
      title: 'Instruction 2: How I Want Responses',
      hint: 'Starter response preferences.',
      text: 'Respond clearly and practically. Use concise structure, headings, bullets, or tables when helpful. Flag assumptions, risks, or missing context before giving final recommendations.',
    },
  ],
  memoryGood: {
    title: 'Good memory',
    items: ['I prefer concise responses.', 'I like comparison tables.', 'I often write client-facing summaries.', 'I am learning AI facilitation.'],
  },
  memoryAvoid: {
    title: 'Better kept out of memory',
    items: ['Temporary project facts.', 'Confidential client information.', 'One-off meeting details.', 'Sensitive personal or team information.'],
  },
};

export type AssistantChip = { label: string; line: string; checked: boolean };

export const assistantChips: AssistantChip[] = [
  { label: 'Concise', line: 'Keep responses concise and practical.', checked: true },
  { label: 'Strategic', line: 'Think strategically and explain tradeoffs when useful.', checked: false },
  { label: 'Client-ready', line: 'Make recommendations client-ready when the audience is external.', checked: true },
  { label: 'Table-heavy', line: 'Use tables when comparing options, risks, or decisions.', checked: false },
  { label: 'Action-oriented', line: 'Convert recommendations into clear next actions.', checked: true },
  { label: 'Critical reviewer', line: 'Act as a constructive critical reviewer before finalizing important work.', checked: false },
  { label: 'Warm tone', line: 'Keep the tone warm, direct, and professional.', checked: true },
  { label: 'Direct tone', line: 'Lead with the answer, then give supporting detail.', checked: false },
];

export function buildAssistantInstructions(selectedLines: string[]): string {
  const lines = selectedLines.length ? selectedLines : ['Respond clearly and practically.'];
  return [
    'I use ChatGPT for professional work, including drafting, summarizing, planning, reviewing, and improving communication.',
    '',
    'Response preferences:',
    ...lines.map((line) => `- ${line}`),
    '- Flag assumptions, risks, or missing context before giving final recommendations.',
  ].join('\n');
}

// --- Lab ---------------------------------------------------------------------

export const labRoughEmail = `Hi team,

Just following up on the meeting. I think we need to sort out the next steps and make sure everyone knows what they are doing. There were a few things discussed but I am not sure we fully landed them. Can everyone please review and send thoughts? Also we need to prepare something for the client soon.

Thanks`;

export const labStaticPrompt = `Act as a professional communications editor.

Rewrite the email below so it is clear, concise, and action-oriented.

Audience: internal project team.
Tone: professional, warm, and direct.
Length: under 180 words.
Format: short opening sentence, bullet-point action items, clear closing.
Do not add information that is not provided.
Before rewriting, list any missing details or assumptions.

Email:
[paste email]`;

export function buildLabPrompt(email: string): string {
  const trimmed = email.trim() || '[paste email]';
  return `Act as a professional communications editor.

Rewrite the email below so it is clear, concise, and action-oriented.

Audience: internal project team.
Tone: professional, warm, and direct.
Length: under 180 words.
Format: short opening sentence, bullet-point action items, clear closing.
Do not add information that is not provided.
Before rewriting, list any missing details or assumptions.

Email:
${trimmed}`;
}

export const refinementChips = [
  { label: 'Shorter', value: 'Make it shorter and more direct.' },
  { label: 'Warmer', value: 'Make it warmer and more collaborative.' },
  { label: 'Leadership', value: 'Create a version for senior leadership.' },
  { label: 'Client-facing', value: 'Create a version that is more client-facing.' },
  { label: 'Reusable prompt', value: 'Turn this into a reusable email improvement prompt.' },
];

export const workflowSteps = [
  { title: 'Messy input', copy: 'Start with a real draft, sanitized when needed.' },
  { title: 'Clear delegation', copy: 'Define role, audience, task, and constraints.' },
  { title: 'Refined output', copy: 'Adjust tone, length, audience, and structure.' },
  { title: 'Saved workflow', copy: 'Turn the pattern into a reusable prompt.' },
];

export const lab = {
  eyebrow: '11 minutes',
  title: 'Hands-on Lab: Email Optimizer',
  lede: 'Participants experience the full loop: delegate, review, refine, and reuse. The task is familiar, low-risk, and visibly improved within minutes.',
  meta: ['0:49-1:00', 'Delegate -> Review -> Refine -> Reuse'],
};

// --- Library -----------------------------------------------------------------

export type LibraryPrompt = { title: string; hint: string; prompt: string };

export const library = {
  eyebrow: 'Take-home resource',
  title: 'Prompt Library',
  lede: 'A small set of Session 1 prompts that reinforce the same delegation pattern across common work tasks.',
  meta: ['Copy and adapt'],
  prompts: [
    {
      title: 'Meeting Notes to Action Plan',
      hint: 'Decisions, owners, risks, and open questions.',
      prompt: `Act as a project coordinator.

Turn the meeting notes below into a clear action plan.

Return:
1. Key decisions
2. Action items
3. Owner, if mentioned
4. Deadline, if mentioned
5. Open questions
6. Risks or missing information

Do not invent owners or deadlines. If something is missing, mark it as "Not specified."

Notes:
[paste notes]`,
    },
    {
      title: 'Executive Summary Builder',
      hint: 'Leadership update from rough notes.',
      prompt: `Act as a senior advisor preparing an executive summary.

Rewrite the rough notes below into a concise leadership update.

Use this structure:
- Situation
- Progress
- Risks
- Decisions needed
- Recommended next step

Keep it under 250 words.
Use a confident but neutral tone.
Flag anything that needs verification.

Notes:
[paste notes]`,
    },
    {
      title: 'Draft Critic',
      hint: 'Review before rewriting.',
      prompt: `Act as a critical but constructive reviewer.

Review the text below and identify:
1. What is working well
2. What is unclear
3. What sounds too vague or generic
4. What may be unsupported
5. Three specific improvements

Do not rewrite yet. First give feedback.

Text:
[paste text]`,
    },
    {
      title: 'Model Choice Coach',
      hint: 'Decide whether speed or deeper thinking is needed.',
      prompt: `Before answering, tell me whether this task needs:
1. A fast/default response
2. Thinking/standard effort
3. Extended/high effort
4. Research, files, or tools

Explain your choice in one sentence, then complete the task.

Task:
[paste task]`,
    },
  ] as LibraryPrompt[],
};
