import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/adminGuard';

export async function GET(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  const link = await prisma.link.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!link) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function PUT(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.url) {
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
    }
  }

  const link = await prisma.link.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(link);
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.link.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
