import React from 'react';
import { MathProblem, WorksheetConfig } from '../types';

interface PaperProps {
  problems: MathProblem[];
  config: WorksheetConfig;
}

const Paper: React.FC<PaperProps> = ({ problems, config }) => {
  // Split problems into columns
  const problemsPerCol = config.rowsPerColumn;
  const columns: MathProblem[][] = [];
  
  for (let i = 0; i < config.totalColumns; i++) {
    columns.push(problems.slice(i * problemsPerCol, (i + 1) * problemsPerCol));
  }

  return (
    // w-[210mm] combined with shrink-0 ensures the browser never tries to squash it on mobile.
    // We reduce padding to p-6 to give columns more breathing room.
    <div id="worksheet-paper" className="bg-white shrink-0 w-[210mm] min-h-[296mm] mx-auto p-6 shadow-lg print:shadow-none print:w-full print:max-w-none print:min-w-0 print:min-h-0 print:m-0 print:p-6 font-serif text-gray-800 box-border">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wider mb-2">{config.schoolName}</h1>
        <div className="flex justify-between items-center text-sm md:text-base border-b-2 border-gray-800 pb-2 mt-4">
          <div className="flex gap-2">
            <span className="font-bold">班级:</span>
            <span className="border-b border-gray-400 w-24 inline-block text-center">{config.gradeInfo}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">姓名:</span>
            <span className="border-b border-gray-400 w-24 inline-block"></span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">学号:</span>
            <span className="border-b border-gray-400 w-16 inline-block"></span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">家长签名:</span>
            <span className="border-b border-gray-400 w-24 inline-block"></span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 text-sm md:text-base leading-loose">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3">
             <div className="text-center font-bold mb-2">第 {colIndex + 1} 组</div>
             {col.map((problem) => (
               // text-base (16px) ensures 3-step equations fit within the column width (~40mm)
               <div key={problem.id} className="whitespace-nowrap h-8 flex items-center font-sans text-base font-medium">
                 {problem.display}
               </div>
             ))}
             {/* Footer per column for errors */}
             <div className="mt-4 pt-2 text-xs text-gray-600">
                错 ( &nbsp;&nbsp; ) 题
             </div>
          </div>
        ))}
      </div>

      {/* Footer Notes (Optional based on image style) */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400 print:hidden">
        Generated with Math Master • A4 Print Ready
      </div>
    </div>
  );
};

export default Paper;