import { NextRequest, NextResponse } from 'next/server';
import { generateVCardString } from '@/lib/vcard';
import { initialVCard } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get('username') || 'creator';

  const vcardText = generateVCardString(initialVCard);

  return new NextResponse(vcardText, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${username}_contact.vcf"`,
    },
  });
}
