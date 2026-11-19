/**
 * documentViewerHelper.js
 * ─────────────────────────────────────────────────────────────
 * Utility functions to open attachments, invoices, and bank passbooks
 * in a new browser tab with clean rendering for both live files and mock records.
 */

/**
 * Open any attachment (PDF, image, job sheet) in a new browser tab.
 */
export const openAttachmentInNewTab = (attachment, claim = {}) => {
  if (!attachment) return

  // 1. If it's a real uploaded File object
  if (attachment.rawFile instanceof File) {
    const fileUrl = URL.createObjectURL(attachment.rawFile)
    const win = window.open(fileUrl, '_blank')
    if (win) win.focus()
    return
  }

  // 2. If it already has a direct previewUrl or url
  if (attachment.previewUrl) {
    const win = window.open(attachment.previewUrl, '_blank')
    if (win) win.focus()
    return
  }
  if (attachment.url) {
    const win = window.open(attachment.url, '_blank')
    if (win) win.focus()
    return
  }

  // 3. For mock files (e.g. Apex_Invoice_9921.pdf, Damaged_Busbar_Photo.jpg),
  // generate a realistic high-definition viewer in a new tab using a Blob HTML URL
  const fileName = attachment.fileName || 'Document.pdf'
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName) || attachment.type === 'Photo'

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileName} - Document Preview</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #334155; min-height: 100vh; display: flex; flex-direction: column; }
    .top-bar { background: #1e293b; color: #f8fafc; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 50; }
    .file-info { display: flex; align-items: center; gap: 12px; }
    .file-icon { font-size: 24px; }
    .file-name { font-weight: 700; font-size: 15px; color: #fff; }
    .file-meta { font-size: 12px; color: #94a3b8; }
    .actions { display: flex; gap: 10px; }
    .btn { background: #15803d; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
    .btn:hover { background: #166534; }
    .btn-secondary { background: #334155; }
    .btn-secondary:hover { background: #475569; }
    .content-area { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px 16px; }
    .doc-card { background: white; width: 100%; max-width: 850px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); overflow: hidden; border: 1px solid #e2e8f0; }
    .doc-header { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
    .verified-stamp { border: 2px solid #16a34a; color: #16a34a; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase; }
    .doc-body { padding: 36px 32px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    .table th, .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .table th { background: #f1f5f9; color: #475569; font-weight: 700; }
    .photo-preview { width: 100%; border-radius: 8px; max-height: 550px; object-fit: cover; background: #e2e8f0; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; margin-bottom: 24px; }
    .meta-item span { display: block; }
    .meta-label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; }
    .meta-value { color: #0f172a; font-weight: 700; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="file-info">
      <span class="file-icon">${isImage ? '🖼️' : '📄'}</span>
      <div>
        <div class="file-name">${fileName}</div>
        <div class="file-meta">${attachment.type || 'Supporting Document'} • ${attachment.size || '1.4 MB'} • Verified Non-PO Emergency Proof</div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="window.print()">🖨️ Print</button>
      <button class="btn" onclick="window.close()">✕ Close Tab</button>
    </div>
  </div>

  <div class="content-area">
    <div class="doc-card">
      <div class="doc-header">
        <div>
          <h2 style="font-size: 18px; color: #0f172a; font-weight: 800;">${isImage ? 'SITE EMERGENCY PHOTOGRAPHIC EVIDENCE' : 'COMMERCIAL TAX INVOICE & PROOF'}</h2>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Associated Claim Ref: <strong>${claim.claimId || 'NPO-2026-CLAIM'}</strong></p>
        </div>
        <div class="verified-stamp">✓ VERIFIED ATTACHMENT</div>
      </div>

      <div class="doc-body">
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Operational Site</span>
            <span class="meta-value">${claim.siteName || 'Godrej One - Vikhroli, Mumbai'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Cost Centre / Division</span>
            <span class="meta-value">${claim.costCentre || 'CC-MH01-OPS'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Beneficiary / Payee</span>
            <span class="meta-value">${claim.accountHolderName || 'Apex Power Controls & Services'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Document File Details</span>
            <span class="meta-value">${fileName} (${attachment.size || '1.4 MB'})</span>
          </div>
        </div>

        ${
          isImage
            ? `
          <div style="text-align: center; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px;">
            <svg width="100%" height="320" viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style="max-height: 400px;">
              <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e293b"/>
                  <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
              </defs>
              <rect width="700" height="320" fill="url(#bg)" rx="10"/>
              <g stroke="#38bdf8" stroke-width="1.5" opacity="0.25">
                <line x1="0" y1="80" x2="700" y2="80"/>
                <line x1="0" y1="160" x2="700" y2="160"/>
                <line x1="0" y1="240" x2="700" y2="240"/>
                <line x1="175" y1="0" x2="175" y2="320"/>
                <line x1="350" y1="0" x2="350" y2="320"/>
                <line x1="525" y1="0" x2="525" y2="320"/>
              </g>
              <circle cx="350" cy="140" r="50" fill="#ef4444" opacity="0.3"/>
              <circle cx="350" cy="140" r="30" fill="#ef4444" opacity="0.6"/>
              <circle cx="350" cy="140" r="10" fill="#f87171"/>
              <text x="350" y="225" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f8fafc" text-anchor="middle">INCIDENT DAMAGE & REPAIR SITE PHOTO</text>
              <text x="350" y="248" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">File: ${fileName} • Timestamp: 14-Nov-2026 • Verified by Site Team</text>
              <rect x="250" y="265" width="200" height="28" rx="6" fill="#16a34a"/>
              <text x="350" y="284" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">GEO-TAGGED & VERIFIED</text>
            </svg>
          </div>
          `
            : `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <table class="table">
              <thead>
                <tr>
                  <th>Item / Description</th>
                  <th style="width: 80px;">Qty</th>
                  <th style="width: 120px; text-align: right;">Rate (₹)</th>
                  <th style="width: 140px; text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Emergency Breakdown Service & Immediate Part Replacement</strong>
                    <div style="font-size: 11px; color: #64748b;">Mobilized under emergency Non-PO protocol for site safety</div>
                  </td>
                  <td>1 Lot</td>
                  <td style="text-align: right;">${claim.amountRequested ? Number(claim.amountRequested * 0.85).toFixed(2) : '32,625.00'}</td>
                  <td style="text-align: right; font-weight: 600;">${claim.amountRequested ? Number(claim.amountRequested * 0.85).toFixed(2) : '32,625.00'}</td>
                </tr>
                <tr>
                  <td><strong>GST / State Tax (18%)</strong></td>
                  <td>18%</td>
                  <td style="text-align: right;">—</td>
                  <td style="text-align: right; font-weight: 600;">${claim.amountRequested ? Number(claim.amountRequested * 0.15).toFixed(2) : '5,875.00'}</td>
                </tr>
                <tr style="background: #f8fafc; font-size: 14px;">
                  <td colspan="3" style="font-weight: 800; text-align: right; color: #0f172a;">Total Invoice Value:</td>
                  <td style="text-align: right; font-weight: 800; color: #15803d;">₹${claim.amountRequested ? Number(claim.amountRequested).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '38,500.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          `
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
          <div>Verified with Accounts & Billing ERP Module Non-PO System</div>
          <div style="font-weight: 600; color: #1e293b;">ELECTRONIC COPY - SYSTEM GENERATED</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  const win = window.open(blobUrl, '_blank')
  if (win) win.focus()
}

/**
 * Open Bank Passbook / Cancelled Cheque proof in full view in a new tab.
 */
export const openPassbookInNewTab = (claim = {}) => {
  if (!claim) return

  // 1. If live previewUrl exists
  if (claim.passbookImage?.previewUrl) {
    const win = window.open(claim.passbookImage.previewUrl, '_blank')
    if (win) win.focus()
    return
  }
  if (claim.passbookImage?.rawFile instanceof File) {
    const fileUrl = URL.createObjectURL(claim.passbookImage.rawFile)
    const win = window.open(fileUrl, '_blank')
    if (win) win.focus()
    return
  }

  // 2. High-definition Full View in new tab
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bank Passbook & Cancelled Cheque - ${claim.accountHolderName || 'Beneficiary'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
    .top-bar { background: #1e293b; color: #f8fafc; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 50; }
    .title-group { display: flex; align-items: center; gap: 12px; }
    .title-group h1 { font-size: 16px; font-weight: 700; color: #fff; }
    .title-group p { font-size: 12px; color: #94a3b8; }
    .actions { display: flex; gap: 10px; }
    .btn { background: #15803d; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
    .btn:hover { background: #166534; }
    .btn-secondary { background: #334155; }
    .btn-secondary:hover { background: #475569; }
    .container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
    .cheque-card { background: linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #f0f9ff 100%); width: 100%; max-width: 900px; border-radius: 16px; border: 2px solid #cbd5e1; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); padding: 36px 40px; position: relative; overflow: hidden; }
    .cancelled-watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; opacity: 0.18; }
    .cancelled-watermark span { font-size: 96px; font-weight: 900; color: #b91c1c; border: 6px solid #b91c1c; padding: 12px 48px; border-radius: 20px; transform: rotate(-24deg); letter-spacing: 12px; }
    .bank-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 24px; }
    .bank-title { font-size: 20px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
    .bank-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
    .bank-sub strong { color: #0f172a; font-family: monospace; font-size: 14px; }
    .date-box { border: 1.5px solid #94a3b8; border-radius: 6px; padding: 6px 14px; font-family: monospace; font-size: 13px; color: #475569; background: white; }
    .line-row { display: flex; align-items: baseline; border-bottom: 1px dotted #94a3b8; padding-bottom: 8px; margin-bottom: 20px; font-size: 14px; }
    .line-label { font-weight: 700; color: #64748b; width: 100px; text-transform: uppercase; font-size: 12px; }
    .line-value { font-weight: 800; color: #0f172a; flex: 1; font-size: 16px; }
    .account-strip { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; }
    .acc-number-box { border: 2.5px solid #334155; border-radius: 10px; background: white; padding: 10px 20px; font-family: monospace; font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: 2px; }
    .sig-area { text-align: right; color: #64748b; font-size: 12px; font-weight: 600; padding-top: 30px; border-top: 1px dashed #cbd5e1; width: 220px; }
    .micr-band { margin-top: 40px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-family: monospace; text-align: center; color: #64748b; font-size: 14px; letter-spacing: 4px; background: #f1f5f9; border-radius: 6px; padding: 8px; }
    .details-panel { width: 100%; max-width: 900px; background: #1e293b; border-radius: 12px; margin-top: 20px; padding: 18px 24px; color: #f8fafc; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; font-size: 13px; border: 1px solid #334155; }
    .detail-item span { display: block; }
    .detail-label { color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 600; }
    .detail-val { font-weight: 700; color: #fff; margin-top: 2px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="title-group">
      <span style="font-size: 24px;">🏦</span>
      <div>
        <h1>Bank Passbook / Cancelled Cheque Full View</h1>
        <p>Verified Disbursement Proof for Claim: <strong>${claim.claimId || 'NPO-CLAIM'}</strong></p>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="window.print()">🖨️ Print Proof</button>
      <button class="btn" onclick="window.close()">✕ Close Tab</button>
    </div>
  </div>

  <div class="container">
    <div class="cheque-card">
      <div class="cancelled-watermark">
        <span>CANCELLED</span>
      </div>

      <div class="bank-header">
        <div>
          <div class="bank-title">${claim.bankName || 'HDFC BANK LIMITED'}</div>
          <div class="bank-sub">
            RTGS / NEFT IFSC CODE: <strong>${claim.ifscCode || 'HDFC0000123'}</strong>
          </div>
        </div>
        <div class="date-box">
          DATE: VALID DISBURSEMENT
        </div>
      </div>

      <div class="line-row">
        <span class="line-label">PAY:</span>
        <span class="line-value">${claim.accountHolderName || 'Apex Power Controls & Services'}</span>
        <span style="color: #94a3b8; font-size: 12px;">OR BEARER</span>
      </div>

      <div class="line-row">
        <span class="line-label">RUPEES:</span>
        <span class="line-value" style="font-size: 14px; font-weight: 600; color: #334155; font-style: italic;">
          Verified Site Emergency Non-PO Disbursement Proof
        </span>
      </div>

      <div class="account-strip">
        <div class="acc-number-box">
          A/C NO: ${claim.bankAccountNo || '50200012345678'}
        </div>

        <div class="sig-area">
          AUTHORIZED BENEFICIARY SIGNATORY
        </div>
      </div>

      <div class="micr-band">
        ⑈ 004123 ⑈  400240012 ⑆  000456 ⑈  31
      </div>
    </div>

    <div class="details-panel">
      <div class="detail-item">
        <span class="detail-label">Beneficiary Name</span>
        <span class="detail-val">${claim.accountHolderName || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Bank & Branch</span>
        <span class="detail-val">${claim.bankName || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Bank Account Number</span>
        <span class="detail-val" style="font-family: monospace; color: #4ade80;">${claim.bankAccountNo || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">IFSC Code</span>
        <span class="detail-val" style="font-family: monospace;">${claim.ifscCode || '—'}</span>
      </div>
    </div>
  </div>
</body>
</html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  const win = window.open(blobUrl, '_blank')
  if (win) win.focus()
}
