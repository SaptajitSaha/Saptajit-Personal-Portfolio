import {
  siGit,
  siGithub,
  siGooglegemini,
  siJavascript,
  siLooker,
  siPandas,
  siPython,
  siPytorch,
  siReact,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import excelIcon from "@iconify-icons/vscode-icons/file-type-excel";
import powerBiIcon from "@iconify-icons/vscode-icons/file-type-powerbi";

type BrandMark =
  | { kind: "simple"; icon: SimpleIcon }
  | { kind: "iconify"; icon: typeof excelIcon };
type ToolboxTool = { name: string; mark: BrandMark };
export type ToolboxTickerRow = { label: string; direction: "left" | "right"; tools: readonly ToolboxTool[] };
const simple = (icon: SimpleIcon): BrandMark => ({ kind: "simple", icon });
const iconify = (icon: typeof excelIcon): BrandMark => ({ kind: "iconify", icon });

export const toolboxTickerRows: readonly ToolboxTickerRow[] = [
  {
    label: "Build",
    direction: "left",
    tools: [
      { name: "Python", mark: simple(siPython) },
      { name: "TypeScript", mark: simple(siTypescript) },
      { name: "JavaScript", mark: simple(siJavascript) },
      { name: "React", mark: simple(siReact) },
    ],
  },
  {
    label: "Data",
    direction: "right",
    tools: [
      { name: "Pandas", mark: simple(siPandas) },
      { name: "Power BI", mark: iconify(powerBiIcon) },
      { name: "Looker Studio", mark: simple(siLooker) },
      { name: "Excel", mark: iconify(excelIcon) },
    ],
  },
  {
    label: "AI & workflow",
    direction: "left",
    tools: [
      { name: "PyTorch", mark: simple(siPytorch) },
      { name: "Gemini", mark: simple(siGooglegemini) },
      { name: "Git", mark: simple(siGit) },
      { name: "GitHub", mark: simple(siGithub) },
    ],
  },
];

export const toolboxPractices = ["SQL", "Statistics", "Machine learning"] as const;
