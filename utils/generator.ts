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
 * Generates Multiplication Problem (1-9 tables, avoiding 0/1 for better difficulty)
 */
const generateMultiplication = (): MathProblem => {
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  return {
    id: generateId(),
    display: `${a} × ${b} =`,
    answer: (a * b).toString(),
    type: OperationType.MULTIPLICATION
  };
};

/**
 * Generates Division Problem (Inverse of 1-9 tables)
 */
const generateDivision = (): MathProblem => {
  const b = randomInt(2, 9);
  const result = randomInt(2, 9);
  const a = b * result;
  return {
    id: generateId(),
    display: `${a} ÷ ${b} =`,
    answer: result.toString(),
    type: OperationType.DIVISION
  };
};

/**
 * Generates Standard 2-digit Addition with Carry
 */
const generateAdditionCarry = (): MathProblem => {
  let a = randomInt(15, 85);
  let b = randomInt(15, 99 - a);
  // Force carrying (units sum >= 10)
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
};

/**
 * Generates Standard 2-digit Subtraction with Borrowing
 */
const generateSubtractionBorrow = (): MathProblem => {
  let a = randomInt(31, 99);
  let b = randomInt(15, a - 10);
  // Force borrowing (a's unit digit < b's unit digit)
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
};

/**
 * Generates Standard 2-digit Addition (fallback if carrying not required)
 */
const generateAddition = (): MathProblem => {
  const a = randomInt(10, 85);
  const b = randomInt(2, 99 - a);
  return {
    id: generateId(),
    display: `${a} + ${b} =`,
    answer: (a + b).toString(),
    type: OperationType.ADDITION
  };
};

/**
 * Generates Standard 2-digit Subtraction (fallback if borrowing not required)
 */
const generateSubtraction = (): MathProblem => {
  const a = randomInt(20, 99);
  const b = randomInt(2, a - 5);
  return {
    id: generateId(),
    display: `${a} - ${b} =`,
    answer: (a - b).toString(),
    type: OperationType.SUBTRACTION
  };
};

/**
 * Generates Division with Remainder (有余数的除法)
 */
const generateDivisionRemainder = (): MathProblem => {
  const b = randomInt(3, 9);
  const q = randomInt(2, 9);
  const r = randomInt(1, b - 1);
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
const generateBasicMix = (ops: AllowedOperations): MathProblem => {
  const availableGenerators: (() => MathProblem)[] = [];
  
  if (ops.add) availableGenerators.push(generateAdditionCarry);
  if (ops.sub) availableGenerators.push(generateSubtractionBorrow);
  if (ops.mul) availableGenerators.push(generateMultiplication);
  if (ops.div) availableGenerators.push(generateDivision);

  if (availableGenerators.length === 0) return generateAddition();

  const generator = availableGenerators[randomInt(0, availableGenerators.length - 1)];
  return generator();
};

/**
 * Missing Operand Addition/Subtraction (for standard customized columns)
 */
const generateMissingAddSub = (ops: AllowedOperations): MathProblem => {
  const types: ('add' | 'sub')[] = [];
  if (ops.add) types.push('add');
  if (ops.sub) types.push('sub');
  
  const type = types.length > 0 ? types[randomInt(0, types.length - 1)] : 'add';

  if (type === 'add') {
    const a = randomInt(10, 70);
    const b = randomInt(10, 95 - a);
    const sum = a + b;
    const missingFirst = Math.random() > 0.5;
    return {
      id: generateId(),
      display: missingFirst ? `▢ + ${b} = ${sum}` : `${a} + ▢ = ${sum}`,
      answer: missingFirst ? a.toString() : b.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else {
    const a = randomInt(25, 99);
    const b = randomInt(10, a - 10);
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
 * Row 15: 3-Step Addition with friendly trailing digit pairing
 * e.g., 26 + 35 + 29 = 90
 */
const generateFriendlyAddition = (): MathProblem => {
  // Let's pick a friendly pair that ends in 0 when added first (e.g. 26 + 29 + 35) or similar
  const sumPair = randomInt(4, 7) * 10; // 40, 50, 60, 70
  const a = randomInt(11, sumPair - 11);
  const b = sumPair - a;
  const c = randomInt(15, 99 - sumPair);
  // shuffle them
  const nums = [a, b, c].sort(() => Math.random() - 0.5);
  return {
    id: generateId(),
    display: `${nums[0]} + ${nums[1]} + ${nums[2]} =`,
    answer: (a + b + c).toString(),
    type: OperationType.MIXED_3_NUM
  };
};

/**
 * Row 16: 3-Step Subtraction with friendly numbers
 * e.g., 94 - 27 - 33 = 34 (since 27+33 = 60)
 */
const generateFriendlySubtraction = (): MathProblem => {
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
};

/**
 * Row 17: Mixed Add/Sub with friendly numbers
 * e.g., 42 + 38 - 25 = 55 (42+38 = 80)
 */
const generateFriendlyMixed = (): MathProblem => {
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
};

/**
 * Row 18: Combination Operation (Add/Sub with Mult/Div)
 */
const generateMixedOperationRow18 = (col: number, ops: AllowedOperations): MathProblem => {
  if (col === 0 && ops.add && ops.mul) {
    // a + b × c =
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
    // a - b ÷ c =
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
    // a × b + c =
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
    // a × b + c =
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
    // a + b ÷ c =
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
 * Row 22: Division with Remainder - Missing Value (用除法有余数填空)
 */
const generateMissingValueRemainder = (col: number): MathProblem => {
  const b = randomInt(3, 9);
  const q = randomInt(2, 9);
  const r = randomInt(1, b - 1);
  const a = b * q + r;

  if (col === 0 || col === 3) {
    // ▢ ÷ b = q …… r (missing dividend)
    return {
      id: generateId(),
      display: `▢ ÷ ${b} = ${q} …… ${r}`,
      answer: a.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else if (col === 1) {
    // a ÷ ▢ = q …… r (missing divisor)
    return {
      id: generateId(),
      display: `${a} ÷ ▢ = ${q} …… ${r}`,
      answer: b.toString(),
      type: OperationType.MISSING_OPERAND
    };
  } else if (col === 2) {
    // ▢ ÷ 2 = q …… ▢ (dividend and remainder missing, divisor restricted to 2)
    const divisor = 2;
    const quotient = randomInt(3, 9);
    const dividend = divisor * quotient + 1;
    return {
      id: generateId(),
      display: `▢ ÷ 2 = ${quotient} …… ▢`,
      answer: `左框: ${dividend}, 右框: 1`,
      type: OperationType.MISSING_OPERAND
    };
  } else {
    // col === 4
    // a ÷ ▢ = ▢ …… r
    // We choose numbers with neat divisor/quotient pairs
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
};

/**
 * Generate fully customized or structured worksheets
 */
export const generateWorksheet = (totalCount: number, ops: AllowedOperations): MathProblem[] => {
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
          probDetail = generateAdditionCarry();
        } else if (ops.sub) {
          probDetail = generateSubtractionBorrow();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 2 || rowNum === 4) {
        // Borrow Subtraction
        if (ops.sub) {
          probDetail = generateSubtractionBorrow();
        } else if (ops.add) {
          probDetail = generateAdditionCarry();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 6 || rowNum === 7 || rowNum === 8) {
        // Elementary Multiplication
        if (ops.mul) {
          probDetail = generateMultiplication();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 9 || rowNum === 10) {
        // Exact Division
        if (ops.div) {
          probDetail = generateDivision();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum >= 11 && rowNum <= 14) {
        // Division with Remainder
        if (ops.div) {
          probDetail = generateDivisionRemainder();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 15) {
        // 3-Num Addition
        if (ops.add) {
          probDetail = generateFriendlyAddition();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 16) {
        // 3-Num Subtraction
        if (ops.sub) {
          probDetail = generateFriendlySubtraction();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 17) {
        // Mixed 3-Num Add/Sub
        if (ops.add && ops.sub) {
          probDetail = generateFriendlyMixed();
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 18) {
        // Row 18: Mixed operation row (e.g., a + b * c)
        probDetail = generateMixedOperationRow18(c, ops);
      } else if (rowNum === 19) {
        // Row 19: Multiplication-Subtraction: a * b - c
        if (ops.mul && ops.sub) {
          const a = randomInt(3, 9);
          const b = randomInt(3, 9);
          const c = randomInt(4, a * b - 5);
          probDetail = {
            id: generateId(),
            display: `${a} × ${b} - ${c} =`,
            answer: (a * b - c).toString(),
            type: OperationType.MIXED_OP
          };
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 20) {
        // Row 20: Multiplication-Addition: a * b + c or a + b * c
        if (ops.mul && ops.add) {
          const usePattern2 = Math.random() > 0.5;
          if (usePattern2) {
            const b = randomInt(3, 9);
            const c = randomInt(3, 9);
            const a = randomInt(11, 45);
            probDetail = {
              id: generateId(),
              display: `${a} + ${b} × ${c} =`,
              answer: (a + b * c).toString(),
              type: OperationType.MIXED_OP
            };
          } else {
            const a = randomInt(3, 9);
            const b = randomInt(3, 9);
            const c = randomInt(11, 45);
            probDetail = {
              id: generateId(),
              display: `${a} × ${b} + ${c} =`,
              answer: (a * b + c).toString(),
              type: OperationType.MIXED_OP
            };
          }
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else if (rowNum === 21) {
        // Row 21: Division-Addition: a ÷ b + c
        if (ops.div && ops.add) {
          const b = randomInt(3, 9);
          const q = randomInt(3, 9);
          const a = b * q;
          const c = randomInt(11, 49);
          probDetail = {
            id: generateId(),
            display: `${a} ÷ ${b} + ${c} =`,
            answer: (q + c).toString(),
            type: OperationType.MIXED_OP
          };
        } else {
          probDetail = generateBasicMix(ops);
        }
      } else {
        // Row 22: Missing values in Division with Remainder (using box ▢ placeholder)
        if (ops.div) {
          probDetail = generateMissingValueRemainder(c);
        } else {
          probDetail = generateMissingAddSub(ops);
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
export const generateConceptExercises = (): ConceptSection => {
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

  // 1. 相邻的数 (3 problems)
  neighbors.push({
    id: generateId(),
    center: getUniqueCenter(102, 997),
    leftAnswer: '', // filled dynamically in state/answers
    rightAnswer: ''
  });
  neighbors.push({
    id: generateId(),
    center: getUniqueCenter(200, 990),
    leftAnswer: '',
    rightAnswer: ''
  });
  // Force one ending in 00 or 90 for higher challenge
  const challengeCenters = [200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const challengeCenter = challengeCenters[randomInt(0, challengeCenters.length - 1)];
  neighbors.push({
    id: generateId(),
    center: challengeCenter,
    leftAnswer: (challengeCenter - 1).toString(),
    rightAnswer: (challengeCenter + 1).toString()
  });
  // calculate answers for the first two as well
  neighbors[0].leftAnswer = (neighbors[0].center - 1).toString();
  neighbors[0].rightAnswer = (neighbors[0].center + 1).toString();
  neighbors[1].leftAnswer = (neighbors[1].center - 1).toString();
  neighbors[1].rightAnswer = (neighbors[1].center + 1).toString();

  // 2. 相邻整十数 (3 problems)
  const tens1 = getUniqueCenter(111, 989);
  const tens2 = getUniqueCenter(101, 999);
  const tens3 = getUniqueCenter(1001, 2999); // 4-digit challenge

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

  // 3. 相邻整百数 (3 problems)
  const hunds1 = getUniqueCenter(110, 990);
  const hunds2 = getUniqueCenter(1101, 9890); // 4-digit challenge
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

  return {
    neighbors: neighbors.sort(() => Math.random() - 0.5),
    neighborTens: neighborTens.sort(() => Math.random() - 0.5),
    neighborHundreds: neighborHundreds.sort(() => Math.random() - 0.5)
  };
};
