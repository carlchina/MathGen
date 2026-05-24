export enum OperationType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  REMAINDER_DIVISION = 'REMAINDER_DIVISION', // e.g., 47 ÷ 8 = 5 ··· 7
  MIXED_3_NUM = 'MIXED_3_NUM', // e.g., 25 + 18 + 5
  MIXED_OP = 'MIXED_OP', // e.g., 35 + 7 × 4 = 63
  MISSING_OPERAND = 'MISSING_OPERAND', // e.g., ▢ ÷ 7 = 5 ··· 6 or ( ) + 25 = 81
}

export interface MathProblem {
  id: string;
  display: string; // The text to show, e.g., "27 + 15 ="
  answer: string;  // Stored for answer key (can represent complex text like "5 ··· 7")
  type: OperationType;
}

export interface ConceptProblem {
  id: string;
  center: number;
  leftAnswer: string;
  rightAnswer: string;
}

export interface ConceptSection {
  neighbors: ConceptProblem[];       // 相邻的数
  neighborTens: ConceptProblem[];    // 相邻整十数
  neighborHundreds: ConceptProblem[];// 相邻整百数
}

export interface WorksheetConfig {
  schoolName: string;
  gradeInfo: string;
  totalColumns: number;
  rowsPerColumn: number;
  showAnswers?: boolean; // Toggle to display answer sheet
}
