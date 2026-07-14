import { MathProblem, OperationType, ConceptSection, ConceptProblem } from '../types';

// Helper to get random int between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

export type AllowedOperations = {
  add: boolean;
  sub: boolean;
  mul: boolean;
  div: boolean;
};

/**
 * Generates Multiplication Problem
 */
const generateMultiplication = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  let a = 2, b = 2;
  if (difficulty === 'easy') {
    a = randomInt(1, 5);
    b = randomInt(1, 5);
  } else if (difficulty === 'hard') {
    a = randomInt(11, 25);
    b = randomInt(2, 9);
  } else {
    // medium
    a = randomInt(2, 9);
    b = randomInt(2, 9);
  }
  return {
    id: generateId(),
    display: `${a} × ${b} =`,
    answer: (a * b).toString(),
    type: OperationType.MULTIPLICATION
  };
};

/**
 * Generates Division Problem
 */
const generateDivision = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  let b = 2, result = 2;
  if (difficulty === 'easy') {
    b = randomInt(1, 5);
    result = randomInt(1, 5);
  } else if (difficulty === 'hard') {
    b = randomInt(2, 9);
    result = randomInt(11, 99);
  } else {
    // medium
    b = randomInt(2, 9);
    result = randomInt(2, 9);
  }
  const a = b * result;
  return {
    id: generateId(),
    display: `${a} ÷ ${b} =`,
    answer: result.toString(),
    type: OperationType.DIVISION
  };
};

/**
 * Generates Standard Addition with Carry
 */
const generateAdditionCarry = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    let a = randomInt(2, 9);
    let b = randomInt(2, 9);
    while (a + b <= 10) {
      a = randomInt(2, 9);
      b = randomInt(2, 9);
    }
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  } else if (difficulty === 'hard') {
    let a = randomInt(105, 895);
    let b = randomInt(105, 999 - a);
    let count = 0;
    while ((a % 10) + (b % 10) < 10 && (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) < 10 && count < 30) {
      a = randomInt(105, 895);
      b = randomInt(105, 999 - a);
      count++;
    }
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  } else {
    // medium
    let a = randomInt(15, 85);
    let b = randomInt(15, 99 - a);
    let count = 0;
    while ((a % 10) + (b % 10) < 10 && count < 30) {
      a = randomInt(15, 85);
      b = randomInt(15, 99 - a);
      count++;
    }
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  }
};

/**
 * Generates Subtraction with Borrowing
 */
const generateSubtractionBorrow = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    let a = randomInt(11, 18);
    let b = randomInt(2, 9);
    while (a % 10 >= b) {
      a = randomInt(11, 18);
      b = randomInt(2, 9);
    }
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  } else if (difficulty === 'hard') {
    let a = randomInt(205, 999);
    let b = randomInt(105, a - 10);
    let count = 0;
    while (a % 10 >= b % 10 && count < 30) {
      a = randomInt(205, 999);
      b = randomInt(105, a - 10);
      count++;
    }
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  } else {
    // medium
    let a = randomInt(31, 99);
    let b = randomInt(15, a - 10);
    let count = 0;
    while (a % 10 >= b % 10 && count < 30) {
      a = randomInt(31, 99);
      b = randomInt(15, a - 10);
      count++;
    }
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  }
};

/**
 * Generates Standard Addition (fallback if carrying not required)
 */
const generateAddition = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    const a = randomInt(1, 8);
    const b = randomInt(1, 10 - a);
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  } else if (difficulty === 'hard') {
    let a = randomInt(100, 800);
    let b = randomInt(100, 999 - a);
    while ((a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10) {
      a = randomInt(100, 800);
      b = randomInt(100, 999 - a);
    }
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  } else {
    // medium
    const a = randomInt(10, 85);
    const b = randomInt(2, 99 - a);
    return {
      id: generateId(),
      display: `${a} + ${b} =`,
      answer: (a + b).toString(),
      type: OperationType.ADDITION
    };
  }
};

/**
 * Generates Standard Subtraction (fallback if borrowing not required)
 */
const generateSubtraction = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    const a = randomInt(2, 10);
    const b = randomInt(1, a - 1);
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  } else if (difficulty === 'hard') {
    let a = randomInt(200, 999);
    let b = randomInt(100, a - 100);
    while (a % 10 < b % 10 || (Math.floor(a / 10) % 10) < (Math.floor(b / 10) % 10)) {
      a = randomInt(200, 999);
      b = randomInt(100, a - 100);
    }
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  } else {
    // medium
    const a = randomInt(20, 99);
    const b = randomInt(2, a - 5);
    return {
      id: generateId(),
      display: `${a} - ${b} =`,
      answer: (a - b).toString(),
      type: OperationType.SUBTRACTION
    };
  }
};

/**
 * Generates Division with Remainder (有余数的除法)
 */
const generateDivisionRemainder = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  let b = 3, q = 2, r = 1;
  if (difficulty === 'easy') {
    b = randomInt(2, 5);
    q = randomInt(1, 4);
    r = randomInt(1, b - 1);
  } else if (difficulty === 'hard') {
    b = randomInt(4, 12);
    q = randomInt(10, 50);
    r = randomInt(1, b - 1);
  } else {
    // medium
    b = randomInt(3, 9);
    q = randomInt(2, 9);
    r = randomInt(1, b - 1);
  }
  const a = b * q + r;
  return {
    id: generateId(),
    display: `${a} ÷ ${b} =`,
    answer: `${q} …… ${r}`,
    type: OperationType.REMAINDER_DIVISION
  };
};

/**
 * Generate generic basic random mix based on allowed options
 */
const generateBasicMix = (ops: AllowedOperations, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  const availableGenerators: ((diff: 'easy' | 'medium' | 'hard') => MathProblem)[] = [];
  
  if (ops.add) availableGenerators.push(generateAdditionCarry);
  if (ops.sub) availableGenerators.push(generateSubtractionBorrow);
  if (ops.mul) availableGenerators.push(generateMultiplication);
  if (ops.div) availableGenerators.push(generateDivision);

  if (availableGenerators.length === 0) return generateAddition(difficulty);

  const generator = availableGenerators[randomInt(0, availableGenerators.length - 1)];
  return generator(difficulty);
};

/**
 * Missing Operand Addition/Subtraction
 */
const generateMissingAddSub = (ops: AllowedOperations, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  const types: ('add' | 'sub')[] = [];
  if (ops.add) types.push('add');
  if (ops.sub) types.push('sub');
  
  const type = types.length > 0 ? types[randomInt(0, types.length - 1)] : 'add';

  if (type === 'add') {
    let a = 10, b = 10;
    if (difficulty === 'easy') {
      a = randomInt(1, 8);
      b = randomInt(1, 10 - a);
    } else if (difficulty === 'hard') {
      a = randomInt(100, 500);
      b = randomInt(100, 900 - a);
    } else {
      // medium
      a = randomInt(10, 70);
      b = randomInt(10, 95 - a);
    }
    const sum = a + b;
    const missingFirst = Math.random() > 0.5;
    return {
      id: generateId(),
      display: missingFirst ? `▢ + ${b} = ${sum}` : `${a} + ▢ = ${sum}`,
      answer: missingFirst ? a.toString() : b.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else {
    let a = 25, b = 10;
    if (difficulty === 'easy') {
      a = randomInt(2, 10);
      b = randomInt(1, a - 1);
    } else if (difficulty === 'hard') {
      a = randomInt(200, 999);
      b = randomInt(100, a - 100);
    } else {
      // medium
      a = randomInt(25, 99);
      b = randomInt(10, a - 10);
    }
    const res = a - b;
    const missingFirst = Math.random() > 0.5;
    return {
      id: generateId(),
      display: missingFirst ? `▢ - ${b} = ${res}` : `${a} - ▢ = ${res}`,
      answer: missingFirst ? a.toString() : b.toString(),
      type: OperationType.MISSING_OPERAND
    };
  }
};

/**
 * Row 15: 3-Step Addition
 */
const generateFriendlyAddition = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    const a = randomInt(1, 5);
    const b = randomInt(1, 5);
    const c = randomInt(1, 8);
    const nums = [a, b, c].sort(() => Math.random() - 0.5);
    return {
      id: generateId(),
      display: `${nums[0]} + ${nums[1]} + ${nums[2]} =`,
      answer: (a + b + c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else if (difficulty === 'hard') {
    const sumPair = randomInt(20, 50) * 10; // 200 to 500
    const a = randomInt(51, sumPair - 51);
    const b = sumPair - a;
    const c = randomInt(50, 999 - sumPair);
    const nums = [a, b, c].sort(() => Math.random() - 0.5);
    return {
      id: generateId(),
      display: `${nums[0]} + ${nums[1]} + ${nums[2]} =`,
      answer: (a + b + c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else {
    // medium
    const sumPair = randomInt(4, 7) * 10; // 40, 50, 60, 70
    const a = randomInt(11, sumPair - 11);
    const b = sumPair - a;
    const c = randomInt(15, 99 - sumPair);
    const nums = [a, b, c].sort(() => Math.random() - 0.5);
    return {
      id: generateId(),
      display: `${nums[0]} + ${nums[1]} + ${nums[2]} =`,
      answer: (a + b + c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  }
};

/**
 * Row 16: 3-Step Subtraction
 */
const generateFriendlySubtraction = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    const a = randomInt(10, 20);
    const b = randomInt(1, 5);
    const c = randomInt(1, a - b - 1);
    return {
      id: generateId(),
      display: `${a} - ${b} - ${c} =`,
      answer: (a - b - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else if (difficulty === 'hard') {
    const sumSub = randomInt(20, 50) * 10; // 200 to 500
    const b = randomInt(51, sumSub - 51);
    const c = sumSub - b;
    const a = randomInt(sumSub + 100, 999);
    return {
      id: generateId(),
      display: `${a} - ${b} - ${c} =`,
      answer: (a - b - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else {
    // medium
    const sumSub = randomInt(4, 7) * 10; // 40, 50, 60, 70
    const b = randomInt(11, sumSub - 11);
    const c = sumSub - b;
    const a = randomInt(sumSub + 10, 99);
    return {
      id: generateId(),
      display: `${a} - ${b} - ${c} =`,
      answer: (a - b - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  }
};

/**
 * Row 17: Mixed Add/Sub
 */
const generateFriendlyMixed = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'easy') {
    const a = randomInt(2, 8);
    const b = randomInt(2, 7);
    const c = randomInt(1, a + b - 1);
    return {
      id: generateId(),
      display: `${a} + ${b} - ${c} =`,
      answer: (a + b - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else if (difficulty === 'hard') {
    const sumAB = randomInt(20, 50) * 10;
    const a = randomInt(51, sumAB - 51);
    const b = sumAB - a;
    const c = randomInt(51, sumAB - 50);
    return {
      id: generateId(),
      display: `${a} + ${b} - ${c} =`,
      answer: (sumAB - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  } else {
    // medium
    const sumAB = randomInt(4, 8) * 10; // 40, 50, 60, 70, 80
    const a = randomInt(11, sumAB - 11);
    const b = sumAB - a;
    const c = randomInt(11, sumAB - 10);
    return {
      id: generateId(),
      display: `${a} + ${b} - ${c} =`,
      answer: (sumAB - c).toString(),
      type: OperationType.MIXED_3_NUM
    };
  }
};

/**
 * Generate parenthesised mixed operations (Easy to read, robust, hard-mode specific)
 */
const generateParenthesesOperation = (): MathProblem => {
  const type = randomInt(0, 3);
  if (type === 0) {
    // (a + b) × c
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    const c = randomInt(2, 9);
    return {
      id: generateId(),
      display: `(${a} + ${b}) × ${c} =`,
      answer: ((a + b) * c).toString(),
      type: OperationType.MIXED_OP
    };
  } else if (type === 1) {
    // (a - b) ÷ c
    const c = randomInt(2, 9);
    const q = randomInt(2, 9);
    const b = randomInt(2, 9);
    const a = c * q + b;
    return {
      id: generateId(),
      display: `(${a} - ${b}) ÷ ${c} =`,
      answer: q.toString(),
      type: OperationType.MIXED_OP
    };
  } else if (type === 2) {
    // a × (b - c)
    const a = randomInt(2, 9);
    const c = randomInt(2, 9);
    const diff = randomInt(2, 9);
    const b = c + diff;
    return {
      id: generateId(),
      display: `${a} × (${b} - ${c}) =`,
      answer: (a * diff).toString(),
      type: OperationType.MIXED_OP
    };
  } else {
    // a ÷ (b + c)
    const sum = randomInt(2, 9);
    const q = randomInt(2, 9);
    const a = sum * q;
    const b = randomInt(1, sum - 1);
    const c = sum - b;
    return {
      id: generateId(),
      display: `${a} ÷ (${b} + ${c}) =`,
      answer: q.toString(),
      type: OperationType.MIXED_OP
    };
  }
};

/**
 * Row 18: Combination Operation (Add/Sub with Mult/Div)
 */
const generateMixedOperationRow18 = (col: number, ops: AllowedOperations, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  if (difficulty === 'hard') {
    return generateParenthesesOperation();
  }

  if (difficulty === 'easy') {
    if (col === 0 && ops.add && ops.mul) {
      const b = randomInt(1, 4);
      const c = randomInt(1, 4);
      const a = randomInt(1, 5);
      return {
        id: generateId(),
        display: `${a} + ${b} × ${c} =`,
        answer: (a + b * c).toString(),
        type: OperationType.MIXED_OP
      };
    }
    if (col === 1 && ops.sub && ops.div) {
      const c = randomInt(1, 4);
      const q = randomInt(1, 4);
      const b = c * q;
      const a = randomInt(q + 1, q + 5);
      return {
        id: generateId(),
        display: `${a} - ${b} ÷ ${c} =`,
        answer: (a - q).toString(),
        type: OperationType.MIXED_OP
      };
    }
    if ((col === 2 || col === 3) && ops.mul && ops.add) {
      const a = randomInt(1, 4);
      const b = randomInt(1, 4);
      const c = randomInt(1, 5);
      return {
        id: generateId(),
        display: `${a} × ${b} + ${c} =`,
        answer: (a * b + c).toString(),
        type: OperationType.MIXED_OP
      };
    }
    if (col === 4 && ops.add && ops.div) {
      const c = randomInt(1, 4);
      const q = randomInt(1, 4);
      const b = c * q;
      const a = randomInt(1, 5);
      return {
        id: generateId(),
        display: `${a} + ${b} ÷ ${c} =`,
        answer: (a + q).toString(),
        type: OperationType.MIXED_OP
      };
    }
    return generateBasicMix(ops, 'easy');
  }

  // medium
  if (col === 0 && ops.add && ops.mul) {
    const b = randomInt(3, 9);
    const c = randomInt(3, 9);
    const a = randomInt(11, 49);
    return {
      id: generateId(),
      display: `${a} + ${b} × ${c} =`,
      answer: (a + b * c).toString(),
      type: OperationType.MIXED_OP
    };
  }
  if (col === 1 && ops.sub && ops.div) {
    const c = randomInt(3, 9);
    const q = randomInt(2, 9);
    const b = c * q;
    const a = randomInt(q + 15, 99);
    return {
      id: generateId(),
      display: `${a} - ${b} ÷ ${c} =`,
      answer: (a - q).toString(),
      type: OperationType.MIXED_OP
    };
  }
  if (col === 2 && ops.mul && ops.add) {
    const a = randomInt(3, 9);
    const b = randomInt(3, 9);
    const c = randomInt(11, 49);
    return {
      id: generateId(),
      display: `${a} × ${b} + ${c} =`,
      answer: (a * b + c).toString(),
      type: OperationType.MIXED_OP
    };
  }
  if (col === 3 && ops.mul && ops.add) {
    const a = randomInt(3, 9);
    const b = randomInt(3, 9);
    const c = randomInt(11, 49);
    return {
      id: generateId(),
      display: `${a} × ${b} + ${c} =`,
      answer: (a * b + c).toString(),
      type: OperationType.MIXED_OP
    };
  }
  if (col === 4 && ops.add && ops.div) {
    const c = randomInt(3, 9);
    const q = randomInt(2, 9);
    const b = c * q;
    const a = randomInt(11, 49);
    return {
      id: generateId(),
      display: `${a} + ${b} ÷ ${c} =`,
      answer: (a + q).toString(),
      type: OperationType.MIXED_OP
    };
  }
  return generateBasicMix(ops);
};

/**
 * Row 22: Division with Remainder - Missing Value
 */
const generateMissingValueRemainder = (col: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem => {
  let b = 3, q = 2, r = 1;
  if (difficulty === 'easy') {
    b = randomInt(2, 4);
    q = randomInt(1, 4);
    r = randomInt(1, b - 1);
  } else if (difficulty === 'hard') {
    b = randomInt(5, 12);
    q = randomInt(10, 30);
    r = randomInt(1, b - 1);
  } else {
    // medium
    b = randomInt(3, 9);
    q = randomInt(2, 9);
    r = randomInt(1, b - 1);
  }
  const a = b * q + r;

  if (col === 0 || col === 3) {
    return {
      id: generateId(),
      display: `▢ ÷ ${b} = ${q} …… ${r}`,
      answer: a.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else if (col === 1) {
    return {
      id: generateId(),
      display: `${a} ÷ ▢ = ${q} …… ${r}`,
      answer: b.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else if (col === 2) {
    const divisor = difficulty === 'hard' ? randomInt(3, 5) : 2;
    const quotient = difficulty === 'hard' ? randomInt(10, 30) : randomInt(3, 9);
    const dividend = divisor * quotient + 1;
    return {
      id: generateId(),
      display: `▢ ÷ ${divisor} = ${quotient} …… ▢`,
      answer: `左框: ${dividend}, 右框: 1`,
      type: OperationType.MISSING_OPERAND
    };
  } else {
    // col === 4
    if (difficulty === 'hard') {
      const options = [
        { a: 147, r: 3, ans: '12 和 12 (或 9 和 16, 等)' },
        { a: 201, r: 5, ans: '14 和 14 (或 7 和 28, 等)' },
        { a: 115, r: 7, ans: '9 和 12 (或 12 和 9, 等)' },
        { a: 251, r: 6, ans: '7 和 35 (或 35 和 7, 等)' }
      ];
      const item = options[randomInt(0, options.length - 1)];
      return {
        id: generateId(),
        display: `${item.a} ÷ ▢ = ▢ …… ${item.r}`,
        answer: item.ans,
        type: OperationType.MISSING_OPERAND
      };
    } else if (difficulty === 'easy') {
      const options = [
        { a: 5, r: 1, ans: '2 和 2 (或 4 和 1)' },
        { a: 7, r: 1, ans: '2 和 3 (或 3 和 2)' },
        { a: 10, r: 2, ans: '4 和 2 (或 8 和 1)' }
      ];
      const item = options[randomInt(0, options.length - 1)];
      return {
        id: generateId(),
        display: `${item.a} ÷ ▢ = ▢ …… ${item.r}`,
        answer: item.ans,
        type: OperationType.MISSING_OPERAND
      };
    } else {
      const options = [
        { a: 29, r: 2, ans: '3 和 9 (或 9 和 3)' },
        { a: 38, r: 3, ans: '5 和 7 (或 7 和 5)' },
        { a: 26, r: 2, ans: '3 和 8 (或 8 和 3, 4 和 6, 6 和 4)' },
        { a: 44, r: 4, ans: '5 和 8 (或 8 和 5)' }
      ];
      const item = options[randomInt(0, options.length - 1)];
      return {
        id: generateId(),
        display: `${item.a} ÷ ▢ = ▢ …… ${item.r}`,
        answer: item.ans,
        type: OperationType.MISSING_OPERAND
      };
    }
  }
};

/**
 * Generate fully customized or structured worksheets
 */
export const generateWorksheet = (totalCount: number, ops: AllowedOperations, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): MathProblem[] => {
  const problems: MathProblem[] = [];
  const rowsPerColumn = 22; // Hardcode to 22 for the Huisi Primary standard
  const numColumns = Math.ceil(totalCount / rowsPerColumn);

  for (let c = 0; c < numColumns; c++) {
    for (let r = 0; r < rowsPerColumn; r++) {
      const rowNum = r + 1; // 1 to 22
      let probDetail: MathProblem;

      if (rowNum === 1 || rowNum === 3 || rowNum === 5) {
        // Carry Addition
        if (ops.add) {
          probDetail = generateAdditionCarry(difficulty);
        } else if (ops.sub) {
          probDetail = generateSubtractionBorrow(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 2 || rowNum === 4) {
        // Borrow Subtraction
        if (ops.sub) {
          probDetail = generateSubtractionBorrow(difficulty);
        } else if (ops.add) {
          probDetail = generateAdditionCarry(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 6 || rowNum === 7 || rowNum === 8) {
        // Elementary Multiplication
        if (ops.mul) {
          probDetail = generateMultiplication(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 9 || rowNum === 10) {
        // Exact Division
        if (ops.div) {
          probDetail = generateDivision(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum >= 11 && rowNum <= 14) {
        // Division with Remainder
        if (ops.div) {
          probDetail = generateDivisionRemainder(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 15) {
        // 3-Num Addition
        if (ops.add) {
          probDetail = generateFriendlyAddition(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 16) {
        // 3-Num Subtraction
        if (ops.sub) {
          probDetail = generateFriendlySubtraction(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 17) {
        // Mixed 3-Num Add/Sub
        if (ops.add && ops.sub) {
          probDetail = generateFriendlyMixed(difficulty);
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 18) {
        // Row 18: Mixed operation row (e.g., a + b * c)
        probDetail = generateMixedOperationRow18(c, ops, difficulty);
      } else if (rowNum === 19) {
        // Row 19: Multiplication-Subtraction: a * b - c (or parentheses in hard)
        if (difficulty === 'hard') {
          probDetail = generateParenthesesOperation();
        } else if (ops.mul && ops.sub) {
          const a = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
          const b = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
          const c = difficulty === 'easy' ? randomInt(1, a * b - 1) : randomInt(4, a * b - 5);
          probDetail = {
            id: generateId(),
            display: `${a} × ${b} - ${c} =`,
            answer: (a * b - c).toString(),
            type: OperationType.MIXED_OP
          };
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 20) {
        // Row 20: Multiplication-Addition: a * b + c or a + b * c
        if (difficulty === 'hard') {
          probDetail = generateParenthesesOperation();
        } else if (ops.mul && ops.add) {
          const usePattern2 = Math.random() > 0.5;
          if (usePattern2) {
            const b = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
            const c = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
            const a = difficulty === 'easy' ? randomInt(1, 5) : randomInt(11, 45);
            probDetail = {
              id: generateId(),
              display: `${a} + ${b} × ${c} =`,
              answer: (a + b * c).toString(),
              type: OperationType.MIXED_OP
            };
          } else {
            const a = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
            const b = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
            const c = difficulty === 'easy' ? randomInt(1, 5) : randomInt(11, 45);
            probDetail = {
              id: generateId(),
              display: `${a} × ${b} + ${c} =`,
              answer: (a * b + c).toString(),
              type: OperationType.MIXED_OP
            };
          }
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else if (rowNum === 21) {
        // Row 21: Division-Addition: a ÷ b + c
        if (difficulty === 'hard') {
          probDetail = generateParenthesesOperation();
        } else if (ops.div && ops.add) {
          const b = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
          const q = difficulty === 'easy' ? randomInt(1, 4) : randomInt(3, 9);
          const a = b * q;
          const c = difficulty === 'easy' ? randomInt(1, 5) : randomInt(11, 49);
          probDetail = {
            id: generateId(),
            display: `${a} ÷ ${b} + ${c} =`,
            answer: (q + c).toString(),
            type: OperationType.MIXED_OP
          };
        } else {
          probDetail = generateBasicMix(ops, difficulty);
        }
      } else {
        // Row 22: Missing values in Division with Remainder (using box ▢ placeholder)
        if (ops.div) {
          probDetail = generateMissingValueRemainder(c, difficulty);
        } else {
          probDetail = generateMissingAddSub(ops, difficulty);
        }
      }

      problems.push(probDetail);
    }
  }

  return problems.slice(0, totalCount);
};

/**
 * Generate bottom concept section ("相邻的数", "相邻整十数", "相邻整百数")
 */
export const generateConceptExercises = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): ConceptSection => {
  const neighbors: ConceptProblem[] = [];
  const neighborTens: ConceptProblem[] = [];
  const neighborHundreds: ConceptProblem[] = [];

  // Helper to check duplicate center numbers
  const usedCenters = new Set<number>();
  const getUniqueCenter = (min: number, max: number): number => {
    let num = randomInt(min, max);
    while (usedCenters.has(num)) {
      num = randomInt(min, max);
    }
    usedCenters.add(num);
    return num;
  };

  if (difficulty === 'easy') {
    // 1. 相邻的数 (3 problems) - 2-digit numbers
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(11, 89),
      leftAnswer: '',
      rightAnswer: ''
    });
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(15, 95),
      leftAnswer: '',
      rightAnswer: ''
    });
    const challengeCenters = [20, 30, 40, 50, 60, 70, 80, 90];
    const challengeCenter = challengeCenters[randomInt(0, challengeCenters.length - 1)];
    neighbors.push({
      id: generateId(),
      center: challengeCenter,
      leftAnswer: (challengeCenter - 1).toString(),
      rightAnswer: (challengeCenter + 1).toString()
    });
    neighbors[0].leftAnswer = (neighbors[0].center - 1).toString();
    neighbors[0].rightAnswer = (neighbors[0].center + 1).toString();
    neighbors[1].leftAnswer = (neighbors[1].center - 1).toString();
    neighbors[1].rightAnswer = (neighbors[1].center + 1).toString();

    // 2. 相邻整十数 (3 problems) - centers in 11 to 99
    const tens1 = getUniqueCenter(11, 89);
    const tens2 = getUniqueCenter(15, 95);
    const tens3 = getUniqueCenter(21, 98);

    [tens1, tens2, tens3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 10) * 10;
      const rightAns = Math.ceil((center + 1) / 10) * 10;
      neighborTens.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });

    // 3. 相邻整百数 (3 problems) - simple centers between 101 and 299
    const hunds1 = getUniqueCenter(101, 199);
    const hunds2 = getUniqueCenter(105, 295);
    const hunds3 = getUniqueCenter(150, 250);

    [hunds1, hunds2, hunds3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 100) * 100;
      const rightAns = Math.ceil((center + 1) / 100) * 100;
      neighborHundreds.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });
  } else if (difficulty === 'hard') {
    // 1. 相邻的数 (3 problems) - 4-digit numbers
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(1002, 9997),
      leftAnswer: '',
      rightAnswer: ''
    });
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(1100, 9900),
      leftAnswer: '',
      rightAnswer: ''
    });
    const challengeCenters = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
    const challengeCenter = challengeCenters[randomInt(0, challengeCenters.length - 1)];
    neighbors.push({
      id: generateId(),
      center: challengeCenter,
      leftAnswer: (challengeCenter - 1).toString(),
      rightAnswer: (challengeCenter + 1).toString()
    });
    neighbors[0].leftAnswer = (neighbors[0].center - 1).toString();
    neighbors[0].rightAnswer = (neighbors[0].center + 1).toString();
    neighbors[1].leftAnswer = (neighbors[1].center - 1).toString();
    neighbors[1].rightAnswer = (neighbors[1].center + 1).toString();

    // 2. 相邻整十数 (3 problems) - center in 1001 to 9999
    const tens1 = getUniqueCenter(1005, 9995);
    const tens2 = getUniqueCenter(1101, 9899);
    const tens3 = getUniqueCenter(2001, 8999);

    [tens1, tens2, tens3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 10) * 10;
      const rightAns = Math.ceil((center + 1) / 10) * 10;
      neighborTens.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });

    // 3. 相邻整百数 (3 problems) - center in 1001 to 9999
    const hunds1 = getUniqueCenter(1010, 9900);
    const hunds2 = getUniqueCenter(2001, 9899);
    const hunds3 = getUniqueCenter(1501, 8999);

    [hunds1, hunds2, hunds3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 100) * 100;
      const rightAns = Math.ceil((center + 1) / 100) * 100;
      neighborHundreds.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });
  } else {
    // medium
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(102, 997),
      leftAnswer: '',
      rightAnswer: ''
    });
    neighbors.push({
      id: generateId(),
      center: getUniqueCenter(200, 990),
      leftAnswer: '',
      rightAnswer: ''
    });
    const challengeCenters = [200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const challengeCenter = challengeCenters[randomInt(0, challengeCenters.length - 1)];
    neighbors.push({
      id: generateId(),
      center: challengeCenter,
      leftAnswer: (challengeCenter - 1).toString(),
      rightAnswer: (challengeCenter + 1).toString()
    });
    neighbors[0].leftAnswer = (neighbors[0].center - 1).toString();
    neighbors[0].rightAnswer = (neighbors[0].center + 1).toString();
    neighbors[1].leftAnswer = (neighbors[1].center - 1).toString();
    neighbors[1].rightAnswer = (neighbors[1].center + 1).toString();

    const tens1 = getUniqueCenter(111, 989);
    const tens2 = getUniqueCenter(101, 999);
    const tens3 = getUniqueCenter(1001, 2999);

    [tens1, tens2, tens3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 10) * 10;
      const rightAns = Math.ceil((center + 1) / 10) * 10;
      neighborTens.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });

    const hunds1 = getUniqueCenter(110, 990);
    const hunds2 = getUniqueCenter(1101, 9890);
    const hunds3 = getUniqueCenter(201, 9980);

    [hunds1, hunds2, hunds3].forEach(center => {
      const leftAns = Math.floor((center - 1) / 100) * 100;
      const rightAns = Math.ceil((center + 1) / 100) * 100;
      neighborHundreds.push({
        id: generateId(),
        center,
        leftAnswer: leftAns.toString(),
        rightAnswer: rightAns.toString()
      });
    });
  }

  return {
    neighbors: neighbors.sort(() => Math.random() - 0.5),
    neighborTens: neighborTens.sort(() => Math.random() - 0.5),
    neighborHundreds: neighborHundreds.sort(() => Math.random() - 0.5)
  };
};
