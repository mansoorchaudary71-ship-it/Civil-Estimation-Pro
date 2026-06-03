import { useEffect } from 'react';
import { generateProfessionalPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

export function useGlobalPrint(getPrintData: () => any) {
  useEffect(() => {
    // Inject into window for generic PDF pullers (like Share menu)
    try {
       const data = getPrintData();
       if (data) {
          (window as any).__GLOBAL_PDF_PAYLOAD = data;
       }
    } catch(e) {}
    
    // Also listen for a direct print action just in case
    const handlePrint = async () => {
      try {
        const data = getPrintData();
        if (!data) return;
        const doc = await generateProfessionalPDF(data);
        doc.save(data.filename || 'Estimation_Report.pdf');
        toast.success('PDF generated successfully!');
      } catch (e) {
         console.error(e);
         toast.error('Failed to generate PDF');
      }
    };
    window.addEventListener('global-print-action', handlePrint);
    
    return () => {
       window.removeEventListener('global-print-action', handlePrint);
       delete (window as any).__GLOBAL_PDF_PAYLOAD;
    };
  }, [getPrintData]);
}
