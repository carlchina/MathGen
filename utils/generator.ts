import { MathProblem, OperationType } from '../types';

// Helper to get random int between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Non-breaking space string for brackets to ensure they don't collapse
const BRACKET_SPACE = '\u00A0\u00A0\u00A0\u00A0\u00A0'; 

export type AllowedOperations = {
  add: boolean;
  sub: boolean;
  mul: boolean;
  div: boolean;
};

/**
 * Generates Multiplication Problem (1-9 tables)
 */
const generateMultiplication = (): MathProblem => {
  const a = randomInt(1, 9);
  const b = randomInt(1, 9);
  return {
    id: generateId(),
    display: `${a} × ${b} =`,
    answer: a * b,
    type: OperationType.MULTIPLICATION
  };
};

/**
 * Generates Division Problem (Inverse of 1-9 tables)
 */
const generateDivision = (): MathProblem => {
  const b = randomInt(1, 9);
  const result = randomInt(1, 9);
  const a = b * result;
  return {
    id: generateId(),
    display: `${a} ÷ ${b} =`,
    answer: result,
    type: OperationType.DIVISION
  };
};

/**
 * Generates Standard 2-digit Addition
 */
const generateAddition = (): MathProblem => {
  const a = randomInt(10, 85);
  const b = randomInt(2, 99 - a);
  return {
    id: generateId(),
    display: `${a} + ${b} =`,
    answer: a + b,
    type: OperationType.ADDITION
  };
};

/**
 * Generates Standard 2-digit Subtraction
 */
const generateSubtraction = (): MathProblem => {
  const a = randomInt(20, 99);
  const b = randomInt(2, a - 5);
  return {
    id: generateId(),
    display: `${a} - ${b} =`,
    answer: a - b,
    type: OperationType.SUBTRACTION
  };
};

/**
 * Row 1-15: Basic Mix based on allowed operations
 */
const generateBasicMix = (ops: AllowedOperations): MathProblem => {
  const availableGenerators: (() => MathProblem)[] = [];
  
  if (ops.add) availableGenerators.push(generateAddition);
  if (ops.sub) availableGenerators.push(generateSubtraction);
  if (ops.mul) availableGenerators.push(generateMultiplication);
  if (ops.div) availableGenerators.push(generateDivision);

  // Fallback to addition if nothing selected (should be prevented in UI)
  if (availableGenerators.length === 0) return generateAddition();

  const generator = availableGenerators[randomInt(0, availableGenerators.length - 1)];
  return generator();
};

/**
 * Row 16: Missing Factor Multiplication
 * e.g., ( ) x 6 = 42
 */
const generateMissingFactor = (): MathProblem => {
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  const product = a * b;
  // 50% chance missing first or second
  const missingFirst = Math.random() > 0.5;

  return {
    id: generateId(),
    display: missingFirst ? `( ${BRACKET_SPACE} ) × ${b} = ${product}` : `${a} × ( ${BRACKET_SPACE} ) = ${product}`,
    answer: missingFirst ? a : b,
    type: OperationType.MISSING_OPERAND
  };
};

/**
 * Row 17: Missing Operand Addition/Subtraction
 * e.g., 72 - ( ) = 35
 */
const generateMissingAddSub = (ops: AllowedOperations): MathProblem => {
  const types: ('add' | 'sub')[] = [];
  if (ops.add) types.push('add');
  if (ops.sub) types.push('sub');
  
  // If neither selected but this function is called, force one? 
  // But logic in main loop should prevent this. Default to add.
  const type = types.length > 0 ? types[randomInt(0, types.length - 1)] : 'add';

  if (type === 'add') {
    // ( ) + b = sum OR a + ( ) = sum
    const a = randomInt(10, 70);
    const b = randomInt(10, 95 - a);
    const sum = a + b;
    return {
      id: generateId(),
      display: Math.random() > 0.5 ? `( ${BRACKET_SPACE} ) + ${b} = ${sum}` : `${a} + ( ${BRACKET_SPACE} ) = ${sum}`,
      answer: Math.random() > 0.5 ? a : b,
      type: OperationType.MISSING_OPERAND
    };
  } else {
    // a - ( ) = res OR ( ) - b = res
    const a = randomInt(25, 99);
    const b = randomInt(10, a - 10);
    const res = a - b;
    const missingFirst = Math.random() > 0.3; // Slight bias
    return {
      id: generateId(),
      display: missingFirst ? `( ${BRACKET_SPACE} ) - ${b} = ${res}` : `${a} - ( ${BRACKET_SPACE} ) = ${res}`,
      answer: missingFirst ? a : b,
      type: OperationType.MISSING_OPERAND
    };
  }
};

/**
 * Row 18: 3-Step Addition with "Friendly Numbers" logic
 * e.g., 25 + 36 + 14 (36+14=50)
 */
const generateFriendlyAddition = (): MathProblem => {
  const targetTail = 0; 
  const pairSum = randomInt(3, 8) * 10; 

  const num1 = randomInt(11, pairSum - 11);
  const num2 = pairSum - num1; 
  
  const num3 = randomInt(10, 95 - pairSum);
  
  const nums = [num1, num2, num3].sort(() => Math.random() - 0.5);
  
  return {
    id: generateId(),
    display: `${nums[0]} + ${nums[1]} + ${nums[2]} =`,
    answer: num1 + num2 + num3,
    type: OperationType.MIXED_3_NUM
  };
};

/**
 * Row 19: 3-Step Subtraction with "Friendly Numbers" logic
 * e.g., 91 - 23 - 37 (23+37=60, 91-60=31)
 */
const generateFriendlySubtraction = (): MathProblem => {
  const subSum = randomInt(3, 7) * 10; 
  const b = randomInt(11, subSum - 11);
  const c = subSum - b;
  const a = randomInt(subSum + 5, 99);

  return {
    id: generateId(),
    display: `${a} - ${b} - ${c} =`,
    answer: a - b - c,
    type: OperationType.MIXED_3_NUM
  };
};

/**
 * Row 20: Mixed Add/Sub with "Friendly Numbers"
 * e.g., 58 + 22 - 39 (58+22=80)
 */
const generateFriendlyMixed = (): MathProblem => {
  const sumAB = randomInt(4, 9) * 10; 
  const a = randomInt(15, sumAB - 15);
  const b = sumAB - a;
  const c = randomInt(10, sumAB - 10); 

  return {
    id: generateId(),
    display: `${a} + ${b} - ${c} =`,
    answer: a + b - c,
    type: OperationType.MIXED_3_NUM
  };
};


export const generateWorksheet = (totalCount: number, ops: AllowedOperations): MathProblem[] => {
  const problems: MathProblem[] = [];
  const rowsPerColumn = 20; 
  const numColumns = Math.ceil(totalCount / rowsPerColumn);

  for (let c = 0; c < numColumns; c++) {
    // 1. Rows 1-15: Basic Mix from allowed types
    for (let i = 0; i < 15; i++) {
        problems.push(generateBasicMix(ops));
    }

    // 2. Row 16: Missing Factor (Mult)
    // Only if Multiplication is allowed
    if (ops.mul) {
      problems.push(generateMissingFactor());
    } else {
      problems.push(generateBasicMix(ops));
    }

    // 3. Row 17: Missing Operand (Add/Sub)
    // Only if Addition OR Subtraction is allowed
    if (ops.add || ops.sub) {
      problems.push(generateMissingAddSub(ops));
    } else {
      problems.push(generateBasicMix(ops));
    }

    // 4. Row 18: 3-Num Addition (Friendly)
    // Only if Addition is allowed
    if (ops.add) {
      problems.push(generateFriendlyAddition());
    } else {
      problems.push(generateBasicMix(ops));
    }
    
    // 5. Row 19: 3-Num Subtraction (Friendly)
    // Only if Subtraction is allowed
    if (ops.sub) {
      problems.push(generateFriendlySubtraction());
    } else {
      problems.push(generateBasicMix(ops));
    }

    // 6. Row 20: Mixed 3-Num (Friendly)
    // Only if BOTH Add and Sub are allowed
    if (ops.add && ops.sub) {
      problems.push(generateFriendlyMixed());
    } else {
      problems.push(generateBasicMix(ops));
    }
  }

  return problems.slice(0, totalCount);
};
