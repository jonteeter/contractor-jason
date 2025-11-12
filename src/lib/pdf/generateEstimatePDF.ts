import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Room {
  name: string;
  length: number;
  width: number;
  sqft: number;
}

interface EstimatePDFData {
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

  // Dates
  createdAt: string;
}

export function generateEstimatePDF(data: EstimatePDFData): jsPDF {
  const doc = new jsPDF();

  let yPosition = 20;

  // Header - Company Name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.contractorCompany, 105, yPosition, { align: 'center' });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractorName, 105, yPosition, { align: 'center' });

  yPosition += 5;
  doc.text(data.contractorPhone, 105, yPosition, { align: 'center' });

  if (data.contractorEmail) {
    yPosition += 5;
    doc.text(data.contractorEmail, 105, yPosition, { align: 'center' });
  }

  yPosition += 15;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTIMATE', 105, yPosition, { align: 'center' });

  yPosition += 10;

  // Estimate Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const estimateDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Date: ${estimateDate}`, 105, yPosition, { align: 'center' });

  yPosition += 15;

  // Customer Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER INFORMATION', 20, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.customerName}`, 20, yPosition);

  yPosition += 5;
  doc.text(`Email: ${data.customerEmail}`, 20, yPosition);

  yPosition += 5;
  doc.text(`Phone: ${data.customerPhone}`, 20, yPosition);

  yPosition += 5;
  const fullAddress = `${data.customerAddress}, ${data.customerCity}, ${data.customerState} ${data.customerZip}`;
  doc.text(`Address: ${fullAddress}`, 20, yPosition);

  yPosition += 12;

  // Floor Specifications
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FLOOR SPECIFICATIONS', 20, yPosition);

  yPosition += 2;

  autoTable(doc, {
    startY: yPosition,
    head: [['Specification', 'Details']],
    body: [
      ['Floor Type', data.floorType],
      ['Size', data.floorSize],
      ['Finish', data.finishType],
      ...(data.stainType ? [['Stain', data.stainType]] : []),
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Measurements
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('MEASUREMENTS', 20, yPosition);

  yPosition += 2;

  // Rooms table
  if (data.rooms.length > 0) {
    const roomRows = data.rooms.map(room => [
      room.name,
      `${room.length} ft`,
      `${room.width} ft`,
      `${room.sqft} sq ft`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Room', 'Length', 'Width', 'Square Feet']],
      body: roomRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;
  }

  // Stairs
  if ((data.stairTreads && data.stairTreads > 0) || (data.stairRisers && data.stairRisers > 0)) {
    const stairRows = [];
    if (data.stairTreads && data.stairTreads > 0) {
      stairRows.push(['Stair Treads', data.stairTreads.toString()]);
    }
    if (data.stairRisers && data.stairRisers > 0) {
      stairRows.push(['Stair Risers', data.stairRisers.toString()]);
    }

    autoTable(doc, {
      startY: yPosition,
      head: [['Stair Component', 'Quantity']],
      body: stairRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;
  }

  // Total Square Footage
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Square Footage: ${data.totalSquareFeet} sq ft`, 20, yPosition);

  yPosition += 15;

  // Total Cost
  doc.setFillColor(240, 253, 244); // Light green background
  doc.rect(20, yPosition - 7, 170, 15, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // Dark green text
  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.estimatedCost);
  doc.text(`TOTAL ESTIMATE: ${formattedCost}`, 105, yPosition, { align: 'center' });

  doc.setTextColor(0, 0, 0); // Reset to black

  yPosition += 20;

  // Footer note
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This estimate is valid for 30 days from the date above.', 105, yPosition, { align: 'center' });

  yPosition += 5;
  doc.text('Please contact us with any questions or to proceed with this project.', 105, yPosition, { align: 'center' });

  // Page number
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadEstimatePDF(data: EstimatePDFData, filename?: string): void {
  const doc = generateEstimatePDF(data);
  const defaultFilename = `Estimate_${data.customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
}
