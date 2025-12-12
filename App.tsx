import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Printer, Download } from 'lucide-react';
import Paper from './components/Paper';
import { generateWorksheet, AllowedOperations } from './utils/generator';
import { MathProblem, WorksheetConfig } from './types';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare var html2pdf: any;

const App: React.FC = () => {
  // Initialize config with dynamic date
  const [config, setConfig] = useState<WorksheetConfig>(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return {
      schoolName: `数学口算练习 (${dateStr})`,
      gradeInfo: '',
      totalColumns: 5,
      rowsPerColumn: 20,
    };
  });

  const [operationOptions, setOperationOptions] = useState<AllowedOperations>({
    add: true,
    sub: true,
    mul: true,
    div: false,
  });

  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Tiny timeout to allow UI to show loading state if calculation was heavy
    setTimeout(() => {
      const total = config.totalColumns * config.rowsPerColumn;
      setProblems(generateWorksheet(total, operationOptions));
      setIsGenerating(false);
    }, 100);
  }, [config, operationOptions]);

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
      filename: `${config.schoolName.replace(/\s+/g, '_') || 'worksheet'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        scrollY: 0, 
        scrollX: 0,
        // The onclone callback allows us to modify the DOM that html2canvas sees
        // without changing the actual page. We use this to strip the centering margins
        // so the PDF aligns perfectly to the top-left.
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('worksheet-paper');
          if (clonedElement) {
            // Remove margin-auto centering to prevent left/right shifting
            clonedElement.style.margin = '0';
            // Ensure it's not flex-centered by parent in the clone
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

  // Helper for rendering buttons
  const OPS_CONFIG = [
    { key: 'add', label: '加法', symbol: '+' },
    { key: 'sub', label: '减法', symbol: '-' },
    { key: 'mul', label: '乘法', symbol: '×' },
    { key: 'div', label: '除法', symbol: '÷' },
  ];

  return (
    // Outer container: print:block and print:h-auto remove the screen height constraint
    <div className="min-h-screen bg-gray-200 print:bg-white flex flex-col font-sans print:block print:h-auto print:overflow-visible">
      
      {/* Control Bar - Hidden when printing */}
      <header className="bg-white border-b border-gray-300 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 shadow-sm print:hidden gap-4">
        <div className="text-center md:text-left flex flex-col gap-3 w-full md:w-auto">
          <h1 className="text-xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
            <span>📚</span> Math Worksheet Generator
          </h1>
          {/* Operation Options - Chip Style Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {OPS_CONFIG.map((op) => {
              const isActive = operationOptions[op.key as keyof AllowedOperations];
              return (
                <button
                  key={op.key}
                  onClick={() => toggleOption(op.key as keyof AllowedOperations)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all select-none
                    ${isActive 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }
                  `}
                >
                  <span className={`text-lg leading-none ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {op.symbol}
                  </span>
                  <span>{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
          {/* Config Inputs */}
          <div className="w-full md:w-auto">
             <input 
               type="text" 
               className="border rounded px-3 py-2 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
               value={config.schoolName}
               onChange={(e) => setConfig({...config, schoolName: e.target.value})}
               placeholder="School Name / Title"
             />
          </div>

          <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
            <button 
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors disabled:opacity-50 cursor-pointer text-sm font-medium flex-1 md:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
              Generate
            </button>
            
            <button 
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 text-sm font-medium flex-1 md:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              {isDownloading ? <RefreshCw size={16} className="animate-spin"/> : <Download size={16} />}
              PDF
            </button>

            <button 
              type="button"
              onClick={handlePrint}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-md shadow-sm transition-colors cursor-pointer text-sm font-medium flex-1 md:flex-none justify-center whitespace-nowrap active:scale-95 transform"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {/* print:overflow-visible ensures the browser sees all content, not just the scroll view */}
      {/* overflow-x-auto allows horizontal scrolling on mobile for the fixed-width A4 paper */}
      <main className="flex-1 p-4 md:p-8 overflow-x-auto print:p-0 print:overflow-visible print:block print:h-auto text-center md:text-left bg-gray-200">
        <div className="print:hidden mb-4 text-center text-gray-500 text-sm sticky left-0 right-0">
          在下方预览试卷，如”打印“点击无效，可下载PDF后打印。
        </div>
        
        {/* Paper Container Wrapper */}
        {/* Changed from flex justify-center to w-fit mx-auto. 
            w-fit ensures the div expands to the full width of the Paper (210mm).
            mx-auto centers it when the screen is larger.
            When the screen is smaller, standard block flow keeps it aligned left, allowing horizontal scroll.
        */}
        <div className="w-fit mx-auto print:block print:w-full print:h-auto">
           <Paper problems={problems} config={config} />
        </div>
      </main>

    </div>
  );
};

export default App;