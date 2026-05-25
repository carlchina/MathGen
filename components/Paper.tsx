import React from 'react';
import { MathProblem, WorksheetConfig, ConceptSection } from '../types';

interface PaperProps {
  problems: MathProblem[];
  config: WorksheetConfig;
  conceptSection: ConceptSection;
}

const Paper: React.FC<PaperProps> = ({ problems, config, conceptSection }) => {
  // Split problems into columns
  const problemsPerCol = config.rowsPerColumn;
  const columns: MathProblem[][] = [];
  
  for (let i = 0; i < config.totalColumns; i++) {
    columns.push(problems.slice(i * problemsPerCol, (i + 1) * problemsPerCol));
  }

  const renderMathEquation = (problem: MathProblem, showAnswers: boolean) => {
    const text = problem.display;
    
    if (!text.includes('▢')) {
      return (
        <div className="flex items-center justify-between w-full h-[26px] print:h-[26px] border-b border-dashed border-gray-100 pb-0.5 z-0">
          <span className="text-gray-800 font-sans font-semibold text-[14.5px] print:text-[14px]">{text}</span>
          {showAnswers && (
            <span className="text-blue-600 font-handwriting font-bold text-[17.5px] print:text-[16px] tracking-wide ml-1 select-none transform -rotate-2">
              {problem.answer}
            </span>
          )}
        </div>
      );
    }

    // Box calculation logic for Row 22
    const parts = text.split('▢');
    
    let boxAnswers: string[] = [];
    if (showAnswers) {
      if (problem.answer.includes('右框') || problem.answer.includes('左框')) {
        const match = problem.answer.match(/\d+/g);
        if (match) boxAnswers = match;
      } else if (problem.answer.includes('和')) {
        const match = problem.answer.match(/\d+/g);
        if (match) boxAnswers = [match[0], match[1]];
      } else {
        boxAnswers = [problem.answer];
      }
    }

    let boxIndex = 0;

    return (
      <div className="flex items-center w-full h-[26px] print:h-[26px] border-b border-dashed border-gray-100 pb-0.5 text-gray-800 font-sans font-semibold text-[14.5px] print:text-[14px]">
        {parts.map((part, index) => {
          const renderBox = index > 0;
          const currentBoxAns = renderBox ? boxAnswers[boxIndex++] : '';
          
          return (
            <React.Fragment key={index}>
              {renderBox && (
                <span className="inline-flex items-center justify-center w-[28px] print:w-[26px] h-[20px] print:h-[18px] border border-gray-400 bg-gray-50/10 rounded mx-1 shrink-0 relative shadow-inner">
                  {showAnswers && currentBoxAns ? (
                    <span className="text-rose-600 font-handwriting font-extrabold text-[14.5px] print:text-[13.5px] select-none absolute">
                      {currentBoxAns}
                    </span>
                  ) : (
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  )}
                </span>
              )}
              <span>{part}</span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    // w-[210mm] combined with shrink-0 ensures the browser never tries to squash it on mobile.
    // print:h-auto and print:min-h-0 let the content dictate height, preventing forced overflow.
    // print:p-4 reduces padding to save vertical space.
    <div id="worksheet-paper" className="font-serif text-gray-800 box-border">
      
      {/* Header */}
      <div className="text-center mb-4 print:mb-4">
        <h1 className="text-2xl font-bold tracking-wider mb-2 font-serif text-gray-905">{config.schoolName}</h1>
        <div className="flex justify-between items-center text-sm border-b-2 border-gray-900 pb-2 mt-4 print:mt-3 print:pb-2 font-serif text-gray-750">
          <div>
            班级（ <span className="font-sans font-bold text-gray-900 px-1">二（{config.gradeInfo || '   '}）</span>班 ）
          </div>
          <div>
            姓名（ <span className="inline-block w-24"></span> ）
          </div>
          <div>
            学号（ <span className="inline-block w-16"></span> ）
          </div>
          <div>
            家长签名（ <span className="inline-block w-28"></span> ）
          </div>
        </div>
      </div>

      {/* Grid containing Columns of Math equations */}
      <div className="grid grid-cols-5 gap-3.5 print:gap-x-3.5 print:gap-y-0 text-sm leading-loose border-b-2 border-gray-900 pb-3 print:pb-3">
        {columns.map((col, colIndex) => {
          const chineseNumbers = ['--','一', '二', '三', '四', '五', '六', '七', '八', '九', '十']; // helper fallback fix offset
          const actualIndex = colIndex + 1;
          const groupTitle = `第 ${chineseNumbers[actualIndex] || actualIndex} 组`;
          return (
            // print:gap-y-[2.5px] optimizes the vertical space between questions in print mode
            // causing the total height to fill the A4 page beautifully.
            <div key={colIndex} className="flex flex-col gap-1.5 print:gap-y-[2.5px]">
              <div className="text-center font-bold mb-1 text-gray-800 border-b border-gray-300 pb-1 font-sans text-xs tracking-wide">
                {groupTitle}
              </div>
              {col.map((problem) => (
                <div key={problem.id} className="whitespace-nowrap h-[26px] print:h-[26px] flex items-center">
                  {renderMathEquation(problem, !!config.showAnswers)}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Concept & Application Section at the bottom */}
      <div className="mt-5 print:mt-6 font-sans text-[13px] print:text-[12px] leading-relaxed text-left">
        <div className="space-y-2.5 print:space-y-[8px] pl-0.5 text-gray-850">
          {/* Neighbors */}
          <div className="flex flex-wrap items-center gap-y-1.5">
            <span className="font-bold text-gray-800 mr-2 min-w-[85px] block sm:inline">相邻的数：</span>
            {conceptSection.neighbors.map((prob, i) => (
              <span key={prob.id} className="mr-5 whitespace-nowrap">
                {i === 0 ? '①' : i === 1 ? '②' : '③'}&nbsp;
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-blue-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.leftAnswer}</span>
                  ) : (
                    <span className="inline-block w-12 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                <span className="font-sans font-bold text-gray-900 mx-1.5 text-[14.5px] print:text-[13px]">, {prob.center}, </span>
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-blue-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.rightAnswer}</span>
                  ) : (
                    <span className="inline-block w-12 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                {i < 2 ? '； ' : '。'}
              </span>
            ))}
          </div>

          {/* Neighbor Tens */}
          <div className="flex flex-wrap items-center gap-y-1.5">
            <span className="font-bold text-gray-800 mr-2 min-w-[85px] block sm:inline">相邻整十数：</span>
            {conceptSection.neighborTens.map((prob, i) => (
              <span key={prob.id} className="mr-5 whitespace-nowrap">
                {i === 0 ? '①' : i === 1 ? '②' : '③'}&nbsp;
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-purple-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.leftAnswer}</span>
                  ) : (
                    <span className="inline-block w-12 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                <span className="font-sans font-bold text-gray-900 mx-1.5 text-[14.5px] print:text-[13px]">, {prob.center}, </span>
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-purple-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.rightAnswer}</span>
                  ) : (
                    <span className="inline-block w-12 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                {i < 2 ? '； ' : '。'}
              </span>
            ))}
          </div>

          {/* Neighbor Hundreds */}
          <div className="flex flex-wrap items-center gap-y-1.5">
            <span className="font-bold text-gray-800 mr-2 min-w-[85px] block sm:inline">相邻整百数：</span>
            {conceptSection.neighborHundreds.map((prob, i) => (
              <span key={prob.id} className="mr-5 whitespace-nowrap">
                {i === 0 ? '①' : i === 1 ? '②' : '③'}&nbsp;
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-teal-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.leftAnswer}</span>
                  ) : (
                    <span className="inline-block w-14 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                <span className="font-sans font-bold text-gray-900 mx-1.5 text-[14.5px] print:text-[13px]">, {prob.center}, </span>
                <span className="font-sans font-medium">
                  (&nbsp;
                  {config.showAnswers ? (
                    <span className="text-teal-600 font-handwriting font-bold text-[16px] print:text-[15px] tracking-wider select-none px-1 inline-block -rotate-1">{prob.rightAnswer}</span>
                  ) : (
                    <span className="inline-block w-14 border-b border-gray-400 h-3"></span>
                  )}
                  &nbsp;)
                </span>
                {i < 2 ? '； ' : '。'}
              </span>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Paper;
