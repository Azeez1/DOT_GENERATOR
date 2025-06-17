import React, { useState } from 'react';
import DataInputForm, { CompanyInfo, InputData } from './components/DataInputForm';
import DashboardView from './components/DashboardView';
import PDFExporter from './components/PDFExporter';

export default function App() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [inputData, setInputData] = useState<InputData | null>(null);
  const [aiSections, setAiSections] = useState<{ title: string; markdown: string }[]>([]);

  const handleGenerate = (
    company: CompanyInfo,
    input: InputData,
    sections: { title: string; markdown: string }[]
  ) => {
    setCompanyInfo(company);
    setInputData(input);
    setAiSections(sections);
  };

  return (
    <div className="container mx-auto p-4">
      <DataInputForm onGenerate={handleGenerate} />
      {aiSections.length > 0 && companyInfo && inputData && (
        <>
          <DashboardView companyInfo={companyInfo} inputData={inputData} aiSections={aiSections} />
          <PDFExporter />
        </>
      )}
    </div>
  );
}
