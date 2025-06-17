import html2pdf from 'html2pdf.js';

export default function PDFExporter() {
  const handleExport = () => {
    const el = document.getElementById('full-report');
    if (!el) return;
    html2pdf()
      .set({ margin: 0.5, filename: 'DOT_Report.pdf', html2canvas: { scale: 2 } })
      .from(el)
      .save();
  };

  return (
    <button onClick={handleExport} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
      Export PDF
    </button>
  );
}
