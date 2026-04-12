import PDFDocument from 'pdfkit';
import type { ScenarioReport } from '../engine/scenarioTypes.js';

// Colors
const DARK = '#1E2D3D';
const INDIGO = '#6366F1';
const MUTED = '#64748B';
const RED = '#EF4444';
const AMBER = '#F59E0B';
const GREEN = '#10B981';
const BG_LIGHT = '#F8F7F4';

function scoreColor(value: number): string {
  if (value >= 70) return GREEN;
  if (value >= 50) return AMBER;
  return RED;
}

function severityColor(severity: 'low' | 'medium' | 'high'): string {
  if (severity === 'high') return RED;
  if (severity === 'medium') return AMBER;
  return GREEN;
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export function generatePDFReport(report: ScenarioReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100; // accounting for margins

    // ── HEADER ────────────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill(DARK);
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
      .text('Pathwise', 50, 22);
    doc.fillColor('#94A3B8').fontSize(11).font('Helvetica')
      .text('Executive Coaching Simulation Report', 50, 50);

    // Date top-right
    doc.fillColor('#94A3B8').fontSize(9)
      .text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        0, 32, { align: 'right' });

    doc.moveDown(3);

    // ── SCENARIO TITLE ────────────────────────────────────────────────────────
    doc.fillColor(DARK).fontSize(18).font('Helvetica-Bold')
      .text(report.scenarioName, 50, 100);

    const outcomeLabel = report.outcome.charAt(0).toUpperCase() + report.outcome.slice(1).replace('_', ' ');
    const outcomeColor = report.outcome === 'success' ? GREEN : report.outcome === 'failure' ? RED : AMBER;

    doc.roundedRect(50, 125, 120, 22, 4).fill(outcomeColor);
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
      .text(outcomeLabel, 50, 131, { width: 120, align: 'center' });

    doc.fillColor(MUTED).fontSize(10).font('Helvetica')
      .text(`Duration: ${formatDuration(report.duration)}   ·   Exchanges: ${report.turnCount}`, 180, 131);

    doc.moveDown(4);

    // ── SCORES SECTION ────────────────────────────────────────────────────────
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Performance Scores', 50, 165);

    doc.moveTo(50, 183).lineTo(50 + pageWidth, 183).strokeColor('#E2E8F0').stroke();

    const metrics = [
      { label: 'Psychological Safety', icon: '🧠', value: report.finalMetrics.psychologicalSafety },
      { label: 'Legal Compliance', icon: '⚖️', value: report.finalMetrics.legalCompliance },
      { label: 'Clarity of Feedback', icon: '🎯', value: report.finalMetrics.clarityOfFeedback },
    ];

    const cardW = (pageWidth - 20) / 3;
    metrics.forEach((m, i) => {
      const x = 50 + i * (cardW + 10);
      const y = 192;

      doc.rect(x, y, cardW, 70).fill(BG_LIGHT);
      doc.fillColor(MUTED).fontSize(9).font('Helvetica')
        .text(m.label, x + 10, y + 10, { width: cardW - 20 });
      doc.fillColor(scoreColor(m.value)).fontSize(26).font('Helvetica-Bold')
        .text(`${Math.round(m.value)}`, x + 10, y + 26);
      doc.fillColor(MUTED).fontSize(8).font('Helvetica')
        .text('/ 100', x + 10 + 36, y + 34);

      // Mini bar
      const barY = y + 58;
      doc.rect(x + 10, barY, cardW - 20, 5).fill('#E2E8F0');
      doc.rect(x + 10, barY, (cardW - 20) * (m.value / 100), 5).fill(scoreColor(m.value));
    });

    doc.moveDown(6);

    // ── BEHAVIOURAL ANALYSIS ──────────────────────────────────────────────────
    const bY = 280;
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Behavioural Analysis', 50, bY);
    doc.moveTo(50, bY + 18).lineTo(50 + pageWidth, bY + 18).strokeColor('#E2E8F0').stroke();

    const ba = report.behavioralAnalysis;
    const trendColor = ba.overallTrend === 'improving' ? GREEN : ba.overallTrend === 'stable' ? AMBER : RED;
    const trendLabel = ba.overallTrend.charAt(0).toUpperCase() + ba.overallTrend.slice(1);

    doc.rect(50, bY + 26, pageWidth, 50).fill(BG_LIGHT);
    doc.fillColor(MUTED).fontSize(9).font('Helvetica')
      .text('Calm exchanges', 60, bY + 34)
      .text('High-tension moments', 200, bY + 34)
      .text('Overall trend', 360, bY + 34);

    doc.fillColor(GREEN).fontSize(20).font('Helvetica-Bold')
      .text(`${ba.calmMoments}`, 60, bY + 46);
    doc.fillColor(RED).fontSize(20).font('Helvetica-Bold')
      .text(`${ba.triggeredMoments}`, 200, bY + 46);
    doc.fillColor(trendColor).fontSize(20).font('Helvetica-Bold')
      .text(trendLabel, 360, bY + 46);

    // ── THE CRINGE LIST ───────────────────────────────────────────────────────
    const clY = bY + 100;
    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('The Cringe List', 50, clY);
    doc.fillColor(MUTED).fontSize(9).font('Helvetica')
      .text('Top moments that could have gone better', 50, clY + 18);
    doc.moveTo(50, clY + 32).lineTo(50 + pageWidth, clY + 32).strokeColor('#E2E8F0').stroke();

    if (report.topIssues.length === 0) {
      doc.rect(50, clY + 40, pageWidth, 40).fill(BG_LIGHT);
      doc.fillColor(GREEN).fontSize(11).font('Helvetica-Bold')
        .text('No significant issues detected. Clean session!', 50, clY + 54, { width: pageWidth, align: 'center' });
    } else {
      let issueY = clY + 40;
      report.topIssues.forEach((issue, i) => {
        const rowH = 52;
        doc.rect(50, issueY, pageWidth, rowH).fill(i % 2 === 0 ? BG_LIGHT : 'white');

        // Severity pill
        doc.roundedRect(58, issueY + 8, 50, 16, 3).fill(severityColor(issue.severity));
        doc.fillColor('white').fontSize(8).font('Helvetica-Bold')
          .text(issue.severity.toUpperCase(), 58, issueY + 13, { width: 50, align: 'center' });

        // Statement
        doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold')
          .text('Statement:', 120, issueY + 8);
        doc.fillColor(DARK).fontSize(9).font('Helvetica')
          .text(`"${issue.managerStatement}"`, 175, issueY + 8, { width: pageWidth - 130, ellipsis: true });

        // Issue
        doc.fillColor(MUTED).fontSize(8).font('Helvetica')
          .text(`Issue: ${issue.issue}`, 120, issueY + 26, { width: pageWidth - 130 });

        issueY += rowH + 4;
      });
    }

    // ── COACHING RECOMMENDATIONS ──────────────────────────────────────────────
    const recY = doc.y + 20;

    // Check if we need a new page
    if (recY > doc.page.height - 200) {
      doc.addPage();
      doc.y = 50;
    }

    const recStart = recY > doc.page.height - 200 ? 50 : recY;

    doc.fillColor(DARK).fontSize(14).font('Helvetica-Bold')
      .text('Coaching Recommendations', 50, recStart);
    doc.moveTo(50, recStart + 18).lineTo(50 + pageWidth, recStart + 18).strokeColor('#E2E8F0').stroke();

    let recLineY = recStart + 28;
    report.recommendations.forEach((rec, i) => {
      doc.rect(50, recLineY, 6, 6).fill(INDIGO);
      doc.fillColor(DARK).fontSize(10).font('Helvetica')
        .text(rec, 66, recLineY, { width: pageWidth - 20 });
      recLineY += 28;
    });

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 40;
    doc.moveTo(50, footerY).lineTo(50 + pageWidth, footerY).strokeColor('#E2E8F0').stroke();
    doc.fillColor(MUTED).fontSize(8).font('Helvetica')
      .text('Generated by Pathwise · AI Executive Coaching Platform · Confidential', 50, footerY + 8,
        { width: pageWidth, align: 'center' });

    doc.end();
  });
}
