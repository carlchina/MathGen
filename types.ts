export enum OperationType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  MIXED_3_NUM = 'MIXED_3_NUM', // e.g., 25 + 18 + 5
  MISSING_OPERAND = 'MISSING_OPERAND', // e.g., ( ) + 25 = 81
}

export interface MathProblem {
  id: string;
  display: string; // The text to show, e.g., "27 + 15 ="
  answer: number;  // stored for answer key (optional feature)
  type: OperationType;
}

export interface WorksheetConfig {
  schoolName: string;
  gradeInfo: string;
  totalColumns: number;
  rowsPerColumn: number;
}
