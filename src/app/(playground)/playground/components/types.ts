export interface DesignTokens {
  teal: string;
  tealDim: string;
  tealBg: string;
  tealBorder: string;
  grey: string;
  greyLight: string;
  greyDark: string;
  greyBg: string;
  slate: string;
  ink: string;
  surface: string;
  orange: string;
  purple: string;
  green: string;
  red: string;
  yellow: string;
  blue: string;
  pink: string;
}

export interface Course {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  fullyBuilt?: boolean;
}
