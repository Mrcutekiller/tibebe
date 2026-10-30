import { jsPDF } from 'jspdf';
import { Exam } from '@/lib/seed-data';
import { User } from '@/context/AuthContext';

export interface WatermarkOptions {
  exam: Exam;
  student?: User | null;
}

export function generateWatermarkedExamPDF({ exam, student }: WatermarkOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const studentName = student?.name || 'Tibeb Registered Student';
  const studentContact = student?.phone || student?.email || '+251 99 721 895';
  const licenseId = `TB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Helper to draw watermark on current page
  const applyWatermark = () => {
    doc.saveGraphicsState();
    
    // Diagonal security watermark
    doc.setTextColor(220, 225, 230); // Very light grey
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    
    const watermarkText = `TIBEB EXAMS  •  ${studentName.toUpperCase()}`;
    const subWatermark = `${studentContact}  •  ${licenseId}`;

    // Rotate and place diagonally across page center
    doc.text(watermarkText, pageWidth / 2, pageHeight / 2 - 20, {
      align: 'center',
      angle: 45,
    });
    doc.setFontSize(16);
    doc.text(subWatermark, pageWidth / 2, pageHeight / 2 + 5, {
      align: 'center',
      angle: 45,
    });
    doc.setFontSize(10);
    doc.text('LICENSED STUDENT COPY  •  UNAUTHORIZED DISTRIBUTION PROHIBITED', pageWidth / 2, pageHeight / 2 + 25, {
      align: 'center',
      angle: 45,
    });

    doc.restoreGraphicsState();

    // Top security header banner
    doc.setFillColor(8, 61, 40); // Dark emerald #083D28
    doc.rect(margin, 10, contentWidth, 7, 'F');
    doc.setTextColor(245, 197, 24); // Gold #F5C518
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`TIBEB SECURE EXAM ARCHIVE  |  STUDENT: ${studentName.toUpperCase()}  |  ID: ${licenseId}`, margin + 3, 15);

    // Page footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 150, 160);
    doc.text(`Tibeb Higher Education Platform  •  Printed on ${issueDate}`, margin, pageHeight - 8);
    doc.text(`Licensed to: ${studentName} (${studentContact})`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // =========================================================================
  // PAGE 1: EXAM COVER & HEADER
  // =========================================================================
  applyWatermark();

  let y = 26;

  // University & Exam Title Block
  doc.setTextColor(11, 93, 59); // Green #0B5D3B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(exam.university || 'Addis Ababa University', margin, y);
  y += 6;

  doc.setTextColor(20, 24, 33);
  doc.setFontSize(13);
  doc.text(exam.title, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 120);
  doc.text(`Course: ${exam.code}  |  Department: ${exam.department}  |  Term: ${exam.exam_type} ${exam.year}`, margin, y);
  y += 4;
  doc.text(`Duration: ${exam.duration_minutes || 60} Minutes  |  Total Questions: ${exam.questions?.length || 0}`, margin, y);
  y += 7;

  // Divider
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Student License Badge Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(8, 61, 40);
  doc.text('OFFICIAL VERIFIED STUDENT WATERMARK', margin + 4, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Licensed student: ${studentName}  |  Phone: ${studentContact}  |  Security Code: ${licenseId}`, margin + 4, y + 10.5);
  y += 20;

  // Questions loop
  const questions = exam.questions || [];

  if (questions.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Full original handwritten/scanned paper pages available in viewer.', margin, y);
  } else {
    questions.forEach((q, idx) => {
      // Check for page overflow
      if (y > pageHeight - 35) {
        doc.addPage();
        applyWatermark();
        y = 26;
      }

      // Question header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const qNumText = `Q${q.question_number || idx + 1}. `;
      const qText = `${qNumText}${q.question_text || ''}`;
      const splitQText = doc.splitTextToSize(qText, contentWidth);
      doc.text(splitQText, margin, y);
      y += splitQText.length * 4.5 + 2;

      // Options if multiple choice
      if (q.options && q.options.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        q.options.forEach((opt) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            applyWatermark();
            y = 26;
          }
          const optLine = `${opt.key}) ${opt.text}`;
          const splitOpt = doc.splitTextToSize(optLine, contentWidth - 6);
          doc.text(splitOpt, margin + 4, y);
          y += splitOpt.length * 4 + 1.5;
        });
      }

      // Answer / Explanation if available
      if (q.explanation) {
        if (y > pageHeight - 25) {
          doc.addPage();
          applyWatermark();
          y = 26;
        }

        doc.setFillColor(240, 253, 244); // light green bg
        doc.setDrawColor(187, 247, 208);
        const explText = `Explanation: ${q.explanation}`;
        const splitExpl = doc.splitTextToSize(explText, contentWidth - 8);
        const boxHeight = splitExpl.length * 3.8 + 5;

        doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(22, 101, 52);
        doc.text(splitExpl, margin + 4, y + 4);
        y += boxHeight + 4;
      } else {
        y += 4;
      }
    });
  }

  // Save the PDF with student and exam title in filename
  const cleanTitle = (exam.code || exam.title).replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Tibeb_${cleanTitle}_Watermarked_${studentName.replace(/\s+/g, '_')}.pdf`);
}
