export type WorkshopSession = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  outcome: string;
  href: string;
  status: 'available' | 'planned';
};

export const workshopSessions: WorkshopSession[] = [
  {
    id: 'session-1',
    number: 1,
    title: 'Core Foundation',
    shortTitle: 'Foundation',
    outcome: 'Use Enterprise safely, choose the right work mode, and delegate clearly.',
    href: '/workshops/session-1',
    status: 'available',
  },
  {
    id: 'session-2',
    number: 2,
    title: 'Projects & Workspaces',
    shortTitle: 'Projects',
    outcome: 'Organize ongoing work with project instructions, files, and team context.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-3',
    number: 3,
    title: 'Tools, Files & Data Workflows',
    shortTitle: 'Tools/Data',
    outcome: 'Use uploads, analysis, tables, spreadsheets, and structured outputs.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-4',
    number: 4,
    title: 'Research & Connectors',
    shortTitle: 'Research',
    outcome: 'Ground work in web research, source material, and connected knowledge.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-5',
    number: 5,
    title: 'Using Agent Skills',
    shortTitle: 'Use Skills',
    outcome: 'Run reusable workflows and adapt skill outputs for team scenarios.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-6',
    number: 6,
    title: 'Building Agent Skills',
    shortTitle: 'Build Skills',
    outcome: 'Turn repeatable team processes into durable skill playbooks.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-7',
    number: 7,
    title: 'Visual Engineering & Multimodal Inputs',
    shortTitle: 'Multimodal',
    outcome: 'Use images, sketches, diagrams, screenshots, and design review inputs.',
    href: '/workshops',
    status: 'planned',
  },
  {
    id: 'session-8',
    number: 8,
    title: 'Team AI Operating System',
    shortTitle: 'Team AI OS',
    outcome: 'Combine projects, tools, skills, and governance into practical team workflows.',
    href: '/workshops',
    status: 'planned',
  },
];

export const sessionOneBlocks = [
  {
    time: '0:00-0:05',
    label: 'Opening',
    title: 'Workshop framing',
    purpose: 'Set expectations and frame the series as practical workflow training.',
  },
  {
    time: '0:05-0:12',
    label: 'Block 1',
    title: 'Enterprise advantage',
    purpose: 'Use the approved workspace, share only what is needed, and verify outputs.',
  },
  {
    time: '0:12-0:22',
    label: 'Block 2',
    title: 'Models & thinking effort',
    purpose: 'Choose fast, Thinking, high effort, or research/tools based on the work.',
  },
  {
    time: '0:22-0:37',
    label: 'Block 3',
    title: 'Work Delegation Framework',
    purpose: 'Prompt through role, context, task, constraints, output format, and quality check.',
  },
  {
    time: '0:37-0:49',
    label: 'Block 4',
    title: 'Personal assistant setup',
    purpose: 'Create starter Custom Instructions and use memory deliberately.',
  },
  {
    time: '0:49-1:00',
    label: 'Block 5',
    title: 'Email Optimizer Lab',
    purpose: 'Practice delegate, review, refine, and reuse on a familiar work task.',
  },
];
