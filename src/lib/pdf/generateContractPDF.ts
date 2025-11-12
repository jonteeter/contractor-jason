import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Room {
  name: string;
  length: number;
  width: number;
  sqft: number;
}

interface ContractPDFData {
  // Contractor info
  contractorName: string;
  contractorCompany: string;
  contractorPhone: string;
  contractorEmail?: string;

  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerZip: string;

  // Project info
  projectName: string;
  floorType: string;
  floorSize: string;
  finishType: string;
  stainType?: string;

  // Measurements
  rooms: Room[];
  stairTreads?: number;
  stairRisers?: number;
  totalSquareFeet: number;

  // Pricing
  estimatedCost: number;

  // Contract details
  introMessage?: string;
  workDescription?: string;
  estimatedDays?: number;
  startDate?: string;
  completionDate?: string;

  // Signatures (will be added in Part 3)
  customerSignature?: string; // base64 image
  customerSignatureDate?: string;
  contractorSignature?: string; // base64 image
  contractorSignatureDate?: string;

  // Dates
  createdAt: string;
}

export function generateContractPDF(data: ContractPDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let yPosition = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.4)); // Return new Y position
  };

  // Header - Company Name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.contractorCompany, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractorName, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 5;
  doc.text(data.contractorPhone, pageWidth / 2, yPosition, { align: 'center' });

  if (data.contractorEmail) {
    yPosition += 5;
    doc.text(data.contractorEmail, pageWidth / 2, yPosition, { align: 'center' });
  }

  yPosition += 15;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FLOORING CONTRACT', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 12;

  // Intro Message
  if (data.introMessage) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(data.introMessage, margin, yPosition, contentWidth);
    yPosition += 10;
  }

  // Parties Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTIES TO THIS AGREEMENT', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Contractor: ${data.contractorName} (${data.contractorCompany})`, margin, yPosition);

  yPosition += 5;
  const fullAddress = `${data.customerAddress}, ${data.customerCity}, ${data.customerState} ${data.customerZip}`;
  doc.text(`Customer: ${data.customerName}`, margin, yPosition);

  yPosition += 5;
  doc.text(`Project Address: ${fullAddress}`, margin, yPosition);

  yPosition += 12;

  // Work Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SCOPE OF WORK', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (data.workDescription) {
    yPosition = addWrappedText(data.workDescription, margin, yPosition, contentWidth);
    yPosition += 5;
  }

  // Floor Specifications
  autoTable(doc, {
    startY: yPosition,
    head: [['Floor Specifications', 'Details']],
    body: [
      ['Floor Type', data.floorType],
      ['Size', data.floorSize],
      ['Finish', data.finishType],
      ...(data.stainType ? [['Stain', data.stainType]] : []),
      ['Total Square Feet', `${data.totalSquareFeet} sq ft`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Timeline
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT TIMELINE', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (data.startDate) {
    const formattedStart = new Date(data.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Start Date: ${formattedStart}`, margin, yPosition);
    yPosition += 5;
  }

  if (data.completionDate) {
    const formattedCompletion = new Date(data.completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Estimated Completion: ${formattedCompletion}`, margin, yPosition);
    yPosition += 5;
  }

  if (data.estimatedDays) {
    doc.text(`Estimated Duration: ${data.estimatedDays} days`, margin, yPosition);
    yPosition += 5;
  }

  yPosition += 10;

  // Payment Terms
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT TERMS', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const totalCost = data.estimatedCost;
  const deposit = totalCost * 0.6;
  const midPayment = totalCost * 0.3;
  const finalPayment = totalCost * 0.1;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  doc.text(`Total Contract Amount: ${formatCurrency(totalCost)}`, margin, yPosition);
  yPosition += 6;
  doc.text(`• 60% Deposit (Due upon signing): ${formatCurrency(deposit)}`, margin + 5, yPosition);
  yPosition += 5;
  doc.text(`• 30% Mid-project Payment: ${formatCurrency(midPayment)}`, margin + 5, yPosition);
  yPosition += 5;
  doc.text(`• 10% Final Payment (Upon completion): ${formatCurrency(finalPayment)}`, margin + 5, yPosition);

  yPosition += 15;

  // Check if we need a new page for signatures
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  // Signatures Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES', margin, yPosition);

  yPosition += 10;

  // Customer Signature
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (data.customerSignature) {
    // Add signature image
    try {
      doc.addImage(data.customerSignature, 'PNG', margin, yPosition, 60, 20);
    } catch (err) {
      console.error('Error adding customer signature:', err);
    }
    yPosition += 22;
  } else {
    // Signature line
    doc.line(margin, yPosition + 15, margin + 80, yPosition + 15);
    yPosition += 17;
  }

  doc.text(`Customer: ${data.customerName}`, margin, yPosition);
  yPosition += 5;

  if (data.customerSignatureDate) {
    const formattedDate = new Date(data.customerSignatureDate).toLocaleDateString('en-US');
    doc.text(`Date: ${formattedDate}`, margin, yPosition);
  } else {
    doc.text('Date: _______________', margin, yPosition);
  }

  yPosition += 15;

  // Contractor Signature
  if (data.contractorSignature) {
    // Add signature image
    try {
      doc.addImage(data.contractorSignature, 'PNG', margin, yPosition, 60, 20);
    } catch (err) {
      console.error('Error adding contractor signature:', err);
    }
    yPosition += 22;
  } else {
    // Signature line
    doc.line(margin, yPosition + 15, margin + 80, yPosition + 15);
    yPosition += 17;
  }

  doc.text(`Contractor: ${data.contractorName}`, margin, yPosition);
  yPosition += 5;

  if (data.contractorSignatureDate) {
    const formattedDate = new Date(data.contractorSignatureDate).toLocaleDateString('en-US');
    doc.text(`Date: ${formattedDate}`, margin, yPosition);
  } else {
    doc.text('Date: _______________', margin, yPosition);
  }

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadContractPDF(data: ContractPDFData, filename?: string): void {
  const doc = generateContractPDF(data);
  const defaultFilename = `Contract_${data.customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
}
