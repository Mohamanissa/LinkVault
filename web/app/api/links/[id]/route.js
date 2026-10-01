import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;

  const link = await prisma.link.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!link || !link.isActive) {
    return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 });
  }

  await prisma.link.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.json(link);
}
