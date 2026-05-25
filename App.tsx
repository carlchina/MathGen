import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Printer, Download, Eye, EyeOff } from 'lucide-react';
import Paper from './components/Paper';
import { generateWorksheet, generateConceptExercises, AllowedOperations } from './utils/generator';
import { MathProblem, WorksheetConfig, ConceptSection } from './types';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare var html2pdf: any;

const App: React.FC = () => {
  // Initialize config with dynamic date and default values matching image
  const [config, setConfig] = useState<WorksheetConfig>(() => {
    return {
      schoolName: '小学二年级下册口算练习',
      gradeInfo: '11', // default class 11 from the image
      totalColumns: 5,
      rowsPerColumn: 22, // update default to match the 22 rows in the image
      showAnswers: false,
    };
  });

  const [operationOptions, setOperationOptions] = useState<AllowedOperations>({
    add: true,
    sub: true,
    mul: true,
    div: true, // Turn division ON by default for 2nd Grade second term
  });

  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [conceptSection, setConceptSection] = useState<ConceptSection>(() => generateConceptExercises());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Tiny timeout to allow UI to show loading state if calculation is heavy
    setTimeout(() => {
      const total = config.totalColumns * config.rowsPerColumn;
      setProblems(generateWorksheet(total, operationOptions));
      setConceptSection(generateConceptExercises());
      setIsGenerating(false);
    }, 100);
  }, [config.totalColumns, config.rowsPerColumn, operationOptions]);

  // Initial generation
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('worksheet-paper');
    if (!element) return;

    setIsDownloading(true);

    // Configuration for consistent A4 generation
    const opt = {
      margin: 0,
      filename: `${config.schoolName.replace(/\s+/g, '_') || 'worksheet'}_二年级_第12周.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0,
        scrollX: 0,
        // Clone allows removing browser styling centering and margins
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('worksheet-paper');
          if (clonedElement) {
            clonedElement.style.margin = '0';
            if (clonedElement.parentElement) {
              clonedElement.parentElement.style.display = 'block';
              clonedElement.parentElement.style.padding = '0';
              clonedElement.parentElement.style.margin = '0';
            }
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };

    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(element).save()
        .then(() => {
          setIsDownloading(false);
        })
        .catch((err: any) => {
          console.error('PDF generation failed', err);
          setIsDownloading(false);
          alert('Could not generate PDF. Please try "Print" -> "Save as PDF".');
        });
    } else {
      console.error('html2pdf library not loaded');
      setIsDownloading(false);
      alert('PDF Library not loaded. Please wait or refresh.');
    }
  };

  const toggleOption = (key: keyof AllowedOperations) => {
    setOperationOptions(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      // Prevent unchecking all options
      if (!newState.add && !newState.sub && !newState.mul && !newState.div) {
        return prev;
      }
      return newState;
    });
  };

  // Helper for rendering chip buttons
  const OPS_CONFIG = [
    { key: 'add', label: '加法', symbol: '+' },
    { key: 'sub', label: '减法', symbol: '-' },
    { key: 'mul', label: '乘法', symbol: '×' },
    { key: 'div', label: '除法', symbol: '÷' },
  ];

  return (
    <div className="min-h-screen bg-gray-200 print:bg-white flex flex-col font-sans print:block print:h-auto print:min-h-0 print:overflow-visible">

      {/* Control Bar - Hidden when printing */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-4 flex flex-col lg:flex-row items-center justify-between sticky top-0 z-10 shadow-sm print:hidden gap-4">

        {/* Title and Ops switches */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto text-center sm:text-left justify-between lg:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight leading-none">
                口算练习生成器
              </h1>
              <p className="text-[11px] text-gray-500 mt-1">二年级二期口算标准 (含余数除法/连减连加/混合/相邻数)</p>
            </div>
          </div>

          <div className="h-4 w-px bg-gray-350 hidden sm:block"></div>

          {/* Operation Options - Chip Style Buttons */}
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {OPS_CONFIG.map((op) => {
              const isActive = operationOptions[op.key as keyof AllowedOperations];
              return (
                <button
                  key={op.key}
                  onClick={() => toggleOption(op.key as keyof AllowedOperations)}
                  className={`
                    flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all select-none cursor-pointer
                    ${isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-150 hover:border-gray-400'
                    }
                  `}
                >
                  <span className={`text-[13px] leading-none ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {op.symbol}
                  </span>
                  <span>{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs and actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {/* Config Inputs */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-56 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={config.schoolName}
              onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
              placeholder="试卷标题"
            />
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-24 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
              value={config.gradeInfo}
              onChange={(e) => setConfig({ ...config, gradeInfo: e.target.value })}
              placeholder="班级 (e.g. 11)"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
            {/* Show Answers toggle */}
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, showAnswers: !prev.showAnswers }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-sm transition-all text-xs font-bold cursor-pointer flex-1 sm:flex-none justify-center whitespace-nowrap active:scale-95 transform
                ${config.showAnswers
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {config.showAnswers ? <EyeOff size={14} /> : <Eye size={14} />}
              {config.showAnswers ? "隐藏答案" : "显示答案"}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors disabled:opacity-50 cursor-pointer text-xs font-bold flex-1 sm:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
              换一批题
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 text-xs font-bold flex-1 sm:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
              下载 PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-800 hover:bg-black text-white rounded-md shadow-sm transition-colors cursor-pointer text-xs font-bold flex-1 sm:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              <Printer size={14} />
              打印
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-x-auto print:p-0 print:overflow-visible print:block print:h-auto text-center md:text-left bg-gray-100">
        <div className="print:hidden mb-3 text-center text-gray-500 font-sans text-xs sticky left-0 right-0 tracking-wide">
          💡 在下方即时预览试卷。支持自适应完美A4尺寸设计，推荐直接点击右上角【打印】保存或输出纸制品。
        </div>

        {/* Paper Container Wrapper */}
        <div className="w-fit mx-auto print:block print:w-full print:h-auto pb-8 print:pb-0">
          <Paper problems={problems} config={config} conceptSection={conceptSection} />
        </div>
      </main>

    </div>
  );
};

export default App;
