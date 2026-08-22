export type LearningTrack = {
  title: string;
  now: string;
  tools: string;
  question: string;
  project: string;
};

export const learningTracks: LearningTrack[] = [
  {
    title: "AI / ML",
    now: "model evaluation, applied machine learning, and practical AI systems",
    tools: "Python · Pandas · PyTorch · Gemini",
    question: "How can an AI system stay useful while making its limits clear?",
    project: "Study thread",
  },
  {
    title: "DSA / CP",
    now: "data structures, algorithmic thinking, and competitive problem-solving",
    tools: "C++ · Python · LeetCode",
    question: "How do the right abstractions make a hard problem easier to reason about?",
    project: "Practice thread",
  },
  {
    title: "System Design",
    now: "reliable product architecture, trade-offs, and service boundaries",
    tools: "APIs · Databases · Queues",
    question: "What keeps a small system clear as its users and responsibilities grow?",
    project: "Architecture notes",
  },
  {
    title: "Cloud Architecture",
    now: "deployment patterns, observability, and resilient cloud foundations",
    tools: "Docker · Cloud platforms · CI/CD",
    question: "How can an application stay dependable without becoming needlessly complex?",
    project: "Infrastructure study",
  },
];
