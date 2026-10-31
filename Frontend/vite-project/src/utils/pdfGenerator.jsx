import jsPDF from 'jspdf';

export const generateReceipt = (donation, userName) => {
  const doc = new jsPDF();

  // ── Color palette ───────────────────────────────────────
  const emerald      = [5, 150, 105];   // emerald-600
  const emeraldLight = [16, 185, 129];  // emerald-500
  const gold         = [217, 119, 6];   // amber-600
  const white        = [255, 255, 255];
  const lightBg      = [236, 253, 245]; // emerald-50
  const darkText     = [17, 24, 39];    // gray-900
  const mutedText    = [107, 114, 128]; // gray-500

  // ── Header Banner ────────────────────────────────────────
  doc.setFillColor(...emerald);
  doc.rect(0, 0, 210, 52, 'F');

  // Gold accent strip
  doc.setFillColor(...gold);
  doc.rect(0, 52, 210, 3, 'F');

  // Org name & title
  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ZakatCare', 105, 18, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('ZakatCare Foundation — Official Donation Receipt', 105, 28, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208); // emerald-200
  doc.text('Har Donation Qubool Ho — Ameen', 105, 38, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('DONATION RECEIPT', 105, 47, { align: 'center' });

  // ── Receipt metadata ─────────────────────────────────────
  doc.setTextColor(...darkText);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text(`Receipt No:`, 20, 68);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${donation.transactionId?.toUpperCase() || 'N/A'}`, 52, 68);

  const date = new Date(donation.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text(`Issue Date:`, 130, 68);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  doc.text(date, 158, 68);

  // ── Donor Section ─────────────────────────────────────────
  doc.setFillColor(...lightBg);
  doc.roundedRect(18, 76, 174, 22, 3, 3, 'F');
  doc.setDrawColor(...emeraldLight);
  doc.setLineWidth(0.4);
  doc.roundedRect(18, 76, 174, 22, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text('DONOR', 24, 84);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text(userName || 'N/A', 24, 93);

  // ── Contribution Details ──────────────────────────────────
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text('CONTRIBUTION DETAILS', 20, 115);

  doc.setDrawColor(...emerald);
  doc.setLineWidth(0.6);
  doc.line(20, 119, 190, 119);

  const details = [
    ['Donation Type', donation.type || 'N/A'],
    ['Category',      donation.category || 'N/A'],
    ['Payment Method', donation.paymentMethod || 'N/A'],
    ['Verification Status', donation.status || 'Pending'],
    ['Campaign / Fund', donation.campaign?.title || 'ZakatCare General Relief Fund'],
  ];

  const startY = 128;
  const gap = 11;

  details.forEach((item, i) => {
    const y = startY + i * gap;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...mutedText);
    doc.text(item[0] + ':', 24, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(String(item[1]), 90, y);
  });

  // ── Amount Box ────────────────────────────────────────────
  doc.setFillColor(...emerald);
  doc.roundedRect(18, 190, 174, 36, 5, 5, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Contribution Amount', 105, 202, { align: 'center' });

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`PKR ${donation.amount?.toLocaleString() || '0'}`, 105, 218, { align: 'center' });

  // ── Dua / Quote ───────────────────────────────────────────
  doc.setTextColor(...mutedText);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(
    '"May Allah accept your generous contribution and grant you barakah in abundance."',
    105, 242, { align: 'center', maxWidth: 160 }
  );

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This is a digitally generated receipt. No physical signature required.',
    105, 256, { align: 'center' }
  );

  // ── Footer strip ──────────────────────────────────────────
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.line(60, 264, 150, 264);

  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text(
    'ZakatCare Foundation • Karachi, Pakistan • info@zakatcare.org • www.zakatcare.org',
    105, 272, { align: 'center' }
  );

  // ── Save ──────────────────────────────────────────────────
  const filename = `ZakatCare_Receipt_${(donation.transactionId || 'receipt').toUpperCase()}.pdf`;
  doc.save(filename);
};
