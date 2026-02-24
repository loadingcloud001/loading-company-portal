import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

function formatHKD(amount: number): string {
  return `HK$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const quotation = await prisma.portalQuotation.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            contactName: true,
            companyName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        items: {
          include: {
            product: {
              select: { name: true, nameZh: true },
            },
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && quotation.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const itemsHtml = quotation.items
      .map(
        (item, i) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;text-align:center;color:#71717a;">${i + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;text-align:right;">${formatHKD(Number(item.unitPrice))}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;text-align:right;font-weight:500;">${formatHKD(Number(item.totalPrice))}</td>
        </tr>`
      )
      .join('');

    const bankDetails = quotation.bankDetails
      ? typeof quotation.bankDetails === 'string'
        ? quotation.bankDetails
        : JSON.stringify(quotation.bankDetails, null, 2)
      : '';

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotation ${escapeHtml(quotation.quotationNo)}</title>
  <style>
    @media print { body { margin: 0; } @page { margin: 1.5cm; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; margin: 0; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0078e6; }
    .logo { font-size: 24px; font-weight: 700; }
    .logo span { color: #0078e6; }
    .doc-info { text-align: right; }
    .doc-info h1 { font-size: 28px; color: #0078e6; margin: 0 0 8px 0; }
    .doc-info p { margin: 2px 0; font-size: 13px; color: #71717a; }
    .parties { display: flex; gap: 40px; margin-bottom: 32px; }
    .party { flex: 1; }
    .party h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; margin: 0 0 8px 0; }
    .party p { margin: 2px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { background: #f4f4f5; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; text-align: left; border-bottom: 2px solid #e4e4e7; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals-row.grand { font-size: 18px; font-weight: 700; padding-top: 10px; margin-top: 6px; border-top: 2px solid #18181b; }
    .section { margin-bottom: 24px; }
    .section h3 { font-size: 13px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; }
    .section p { font-size: 14px; margin: 0; white-space: pre-wrap; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-draft { background: #f4f4f5; color: #71717a; }
    .status-sent { background: #dbeafe; color: #1d4ed8; }
    .status-accepted { background: #dcfce7; color: #15803d; }
    .status-rejected { background: #fee2e2; color: #dc2626; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e4e4e7; text-align: center; font-size: 12px; color: #a1a1aa; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo"><span>Loading</span> Technology</div>
      <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Smart Construction Site Safety Solutions</p>
    </div>
    <div class="doc-info">
      <h1>QUOTATION</h1>
      <p><strong>${escapeHtml(quotation.quotationNo)}</strong></p>
      <p>Date: ${new Date(quotation.createdAt).toLocaleDateString('en-GB')}</p>
      ${quotation.validUntil ? `<p>Valid Until: ${new Date(quotation.validUntil).toLocaleDateString('en-GB')}</p>` : ''}
      <p><span class="status-badge status-${quotation.status}">${quotation.status}</span></p>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>From</h3>
      <p><strong>Loading Technology Company</strong></p>
      <p>Hong Kong</p>
      <p>info@loadingtechnology.com</p>
    </div>
    <div class="party">
      <h3>To</h3>
      ${quotation.customer.companyName ? `<p><strong>${escapeHtml(quotation.customer.companyName)}</strong></p>` : ''}
      <p>${escapeHtml(quotation.customer.contactName)}</p>
      <p>${escapeHtml(quotation.customer.email)}</p>
      ${quotation.customer.phone ? `<p>${escapeHtml(quotation.customer.phone)}</p>` : ''}
      ${quotation.customer.address ? `<p>${escapeHtml(quotation.customer.address)}</p>` : ''}
    </div>
  </div>

  ${quotation.title ? `<div class="section"><h3>Subject</h3><p>${escapeHtml(quotation.title)}</p></div>` : ''}

  <table>
    <thead>
      <tr>
        <th style="width:40px;text-align:center;">#</th>
        <th>Item</th>
        <th style="width:60px;text-align:center;">Qty</th>
        <th style="width:120px;text-align:right;">Unit Price</th>
        <th style="width:120px;text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${formatHKD(Number(quotation.subtotal))}</span>
      </div>
      ${Number(quotation.discount) > 0 ? `
      <div class="totals-row">
        <span>Discount</span>
        <span>- ${formatHKD(Number(quotation.discount))}</span>
      </div>` : ''}
      <div class="totals-row grand">
        <span>Total</span>
        <span>${formatHKD(Number(quotation.total))}</span>
      </div>
    </div>
  </div>

  ${bankDetails ? `
  <div class="section">
    <h3>Bank Transfer Details</h3>
    <p>${escapeHtml(bankDetails)}</p>
  </div>` : ''}

  ${quotation.notes ? `
  <div class="section">
    <h3>Notes</h3>
    <p>${escapeHtml(quotation.notes)}</p>
  </div>` : ''}

  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Loading Technology Company. All rights reserved.</p>
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
