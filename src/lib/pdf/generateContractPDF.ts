import jsPDF from 'jspdf';

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

  // Signatures
  customerSignature?: string;
  customerSignatureDate?: string;
  contractorSignature?: string;
  contractorSignatureDate?: string;

  // Dates
  createdAt: string;
}

export function generateContractPDF(data: ContractPDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 5;

  let yPosition = 15;

  // Helper to check if we need a new page
  const checkPageBreak = (neededSpace: number = 20) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper to add wrapped text
  const addText = (text: string, fontSize: number = 9, isBold: boolean = false, isItalic: boolean = false) => {
    doc.setFontSize(fontSize);

    if (isBold && isItalic) {
      doc.setFont('helvetica', 'bolditalic');
    } else if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else if (isItalic) {
      doc.setFont('helvetica', 'italic');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    const lines = doc.splitTextToSize(text, contentWidth);

    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Helper for headings
  const addHeading = (text: string, fontSize: number = 11) => {
    checkPageBreak(15);
    yPosition += 3;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += lineHeight + 2;
  };

  // Helper for bullets
  const addBullet = (text: string) => {
    checkPageBreak();
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const bulletX = margin + 3;
    const textX = margin + 8;
    doc.text('•', bulletX, yPosition);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    lines.forEach((line: string, index: number) => {
      if (index > 0) checkPageBreak();
      doc.text(line, textX, yPosition);
      yPosition += lineHeight;
    });
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'To be determined';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ===== HEADER =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.contractorPhone, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += lineHeight + 5;

  // Customer Address
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.customerName, margin, yPosition);
  yPosition += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerAddress, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`${data.customerCity}, ${data.customerState}`, margin, yPosition);
  yPosition += lineHeight + 8;

  // Intro Message
  if (data.introMessage) {
    addText(data.introMessage, 9, false, true);
    yPosition += 5;
  }

  // ===== CONTRACT TITLE =====
  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Contractor Agreement', margin, yPosition);
  yPosition += lineHeight + 5;

  // Agreement Parties
  addText(`THIS AGREEMENT made by and between ${data.contractorCompany} hereinafter called the Contractor, and ${data.customerName}, hereinafter called the Owner.`, 10, true);
  yPosition += 2;

  addText('WITNESSETH that the Contractor and the Owner for the considerations named agree as follows:', 10);
  yPosition += 3;

  // ===== ARTICLE 1: SCOPE OF WORK =====
  addHeading('Article 1. Scope of the Work');
  addText(`The Contractor shall furnish all of the materials and perform all of the work shown on the Drawings and/or described in the Specifications entitled Exhibit A, as annexed hereto as it pertains to work to be performed on property at ${data.customerAddress}, ${data.customerCity}, ${data.customerState}.`);

  // ===== ARTICLE 2: TIME OF COMPLETION =====
  addHeading('Article 2. Time of Completion');
  addText(`The work to be performed under this Contract shall be commenced on or before ${formatDate(data.startDate)}, and shall be substantially completed on or before ${formatDate(data.completionDate)}. Time is of the essence. The following constitutes substantial completion of work pursuant to this proposal and contract: as indicated in Exhibit A.`);

  // ===== ARTICLE 3: CONTRACT PRICE =====
  addHeading('Article 3. The Contract Price');
  addText('The Owner shall pay the Contractor for the material and labor to be performed under the Contract and charged as SEE Exhibit A, subject to additions and deductions pursuant to authorized change orders.');

  // ===== ARTICLE 4: PROGRESS PAYMENTS =====
  addHeading('Article 4. Progress Payments');
  addText('Payments of the Contract Price shall be paid in the manner following: As stated in Exhibit A');

  // ===== ARTICLE 5: GENERAL PROVISIONS =====
  addHeading('Article 5. General Provisions');
  addText('Any alteration or deviation from the above specifications, including but not limited to any such alteration or deviation involving additional material and/or labor costs, will be executed only upon a written order for same, signed by Owner and Contractor, and if there is any charge for such alteration or deviation, the additional charge will be added to the contract price of this Contract.');
  yPosition += 2;

  addText('If payment is not made when due, Contractor may suspend work on the job until such time as all payments due have been made. A failure to make payment for a period in excess of 2 days from the due date of the payment shall be deemed a material breach of this Contract.');
  yPosition += 2;

  addText('In addition, the following general provisions apply:');
  yPosition += 2;

  addBullet('All work shall be completed in a workmanlike manner and in compliance with all building codes and other applicable laws.');
  addBullet('The Contractor shall furnish a description of the work to be done and description of the materials to be used and the equipment to be used or installed, and the agreed consideration for the work.');
  addBullet('To the extent required by law all work shall be performed by individuals duly licensed and authorized by law to perform said work.');
  addBullet('Contractor may at its discretion engage subcontractors to perform work hereunder, provided Contractor shall fully pay said subcontractor and in all instances remain responsible for the proper completion of this Contract.');
  addBullet('Contractor shall furnish Owner appropriate releases or waivers of lien for all work performed or materials provided at the time the next periodic payment shall be due.');
  addBullet('All change orders shall be in writing and signed both by Owner and Contractor, and shall be incorporated in, and become a part of the Contract.');
  addBullet('Owner shall at its own expense obtain all permits necessary for the work to be performed.');
  addBullet('Contractor agrees to leave the premises in broom clean condition and unless otherwise stated will leave garbage in 55 gallon bags on site.');
  addBullet('In the event Owner shall fail to pay any periodic or installment payment due hereunder, Contractor may cease work without breach pending payment or resolution of any dispute.');
  addBullet('All disputes hereunder shall be resolved by binding arbitration in accordance with rules of the American Arbitration Association.');
  addBullet('Contractor shall not be liable for any delay due to circumstances beyond its control including strikes, casualty or general unavailability of materials.');
  addBullet('Contractor warrants all work for a period of 12 months following completion.');

  // ===== ARTICLE 6: INDEMNIFICATION =====
  addHeading('Article 6. Indemnification');
  addText('To the fullest extent permitted by law, the Contractor shall indemnify, defend and hold harmless its agents and employees, from and against claims, damages, losses and expenses, including but not limited to attorney\'s fees, arising out of or resulting from performance of the work or providing of materials to the extent caused in whole or in part by negligent or wrongful acts or omissions of, or a breach of this agreement by, the Contractor, a subcontractor, anyone directly or indirectly employed by them or anyone whose acts they are legally responsible for.');

  // ===== ARTICLE 7: INSURANCE =====
  addHeading('Article 7. Insurance');
  addText('The Contractor represents that it has purchased and agrees that it will keep in force for the duration of the performance of the work or for such longer term as may be required by this agreement, in a company or companies lawfully authorized to do business in the State of Illinois, such insurance as will protect owner from claims for loss or injury, which might arise out of or result from the Contractor\'s operations under this project, whether such operations be by the Contractor or by a subcontractor or its subcontractors.');
  yPosition += 2;

  addText('The Contractor represents and agrees that said insurance is written for and shall be maintained in an amount not less than the limits of the liability specified below or required by law, whichever coverage is greater. The Contractor certifies that coverage written on a "claims made" form will be maintained without interruption from the commencement of work until the expiration of all applicable statutes of limitation.');
  yPosition += 2;

  addText('Prior to commencement of work, the Contractor shall file with the appropriate authorities all Certificates of Insurance naming the owner/person hiring the Contractor as additional insured, in duplicate, and acceptable to all parties, which shall contain a provision that coverage under the policies shall not be canceled or allowed to expire or permit material changes until at least 10 days written notice has been given to additional insured.');

  // ===== ARTICLE 8: ADDITIONAL TERMS =====
  addHeading('Article 8. Additional Terms');
  addText('Contract is not bound until contractor receives deposit. Flooring material should be delivered as early as possible allow for acclimation to site but no less than 48 hours prior to installation.');

  // ===== EXHIBIT A =====
  checkPageBreak(40);
  yPosition += 5;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin - 5, yPosition - 5, contentWidth + 10, 5, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Exhibit A - Scope of Work', margin, yPosition);
  yPosition += lineHeight + 3;

  if (data.workDescription) {
    addText(data.workDescription, 9);
    yPosition += 3;
  }

  addText('All work will be done in a workmanlike manner and completed in a professional timely manner.', 9);
  addText(`The estimated completion time is ${data.estimatedDays || '_____'} business days. Time is of the essence.`, 9);
  yPosition += 3;

  doc.setFont('helvetica', 'bold');
  addText('All Checks will be made payable to Jason Dixon or J. Dixon\'s Carpentry Services', 9, true);
  yPosition += 2;

  doc.setFontSize(11);
  doc.setTextColor(217, 119, 6);
  addText(`Cost of the total project is ${formatCurrency(data.estimatedCost)}`, 11, true);
  doc.setTextColor(0, 0, 0);
  yPosition += 2;

  const deposit = data.estimatedCost * 0.6;
  const midPayment = data.estimatedCost * 0.3;
  const finalPayment = data.estimatedCost * 0.1;

  addText(`Terms are 60% down (${formatCurrency(deposit)}), 30% due upon completion of the second coat (${formatCurrency(midPayment)}), and 10% due upon completion of the final coat (${formatCurrency(finalPayment)}).`, 9);
  yPosition += 2;

  addText('It is recommended that final coat be done after all other contractors are done.', 9);
  yPosition += 2;

  addText(`The total cost for the above stated work is ${formatCurrency(data.estimatedCost)}. All materials and labor quoted above are included. Any added work or material will be additional in cost.`, 9, true);

  // ===== SIGNATURES =====
  checkPageBreak(50);
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Use signature date if signed, otherwise today's date
  const contractDate = data.customerSignatureDate || data.contractorSignatureDate || new Date().toISOString();
  const formattedContractDate = new Date(contractDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  doc.text(`Agreed this day of ${formattedContractDate}.`, margin, yPosition);
  yPosition += 15;

  // Contractor Signature
  if (data.contractorSignature) {
    try {
      doc.addImage(data.contractorSignature, 'PNG', margin, yPosition, 50, 15);
    } catch (err) {
      console.error('Error adding contractor signature:', err);
    }
    yPosition += 17;
  } else {
    doc.line(margin, yPosition + 10, margin + 60, yPosition + 10);
    yPosition += 12;
  }

  doc.setFont('helvetica', 'bold');
  doc.text(data.contractorName, margin, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(data.contractorPhone, margin, yPosition);

  // Customer Signature (right side)
  const rightX = pageWidth - margin - 60;
  let customerY = yPosition - 22;

  if (data.customerSignature) {
    try {
      doc.addImage(data.customerSignature, 'PNG', rightX, customerY, 50, 15);
    } catch (err) {
      console.error('Error adding customer signature:', err);
    }
    customerY += 17;
  } else {
    doc.line(rightX, customerY + 10, rightX + 60, customerY + 10);
    customerY += 12;
  }

  doc.setFont('helvetica', 'bold');
  doc.text(data.customerName, rightX, customerY);

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
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
