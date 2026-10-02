import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/adminGuard';
import { isUrlSafe } from '@/lib/safeBrowsing';

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { title, url, description, categoryId, tags, platform, isSecure } = body;

  if (!title || !url || !categoryId) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: 'Seuls les protocoles HTTP et HTTPS sont autorisés' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
  }

  const check = await isUrlSafe(url);
  if (!check.safe) {
    return NextResponse.json(
      {
        error: `Ce lien a été identifié comme dangereux par Google Safe Browsing. Menaces : ${check.threats?.join(', ')}`,
      },
      { status: 400 }
    );
  }

  const link = await prisma.link.create({
    data: {
      title,
      url,
      description: description || null,
      categoryId,
      tags: tags || '',
      platform: platform || 'Web',
      isSecure: isSecure ?? true,
    },
  });

  return NextResponse.json(link, { status: 201 });
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return NextResponse.json(links);
}
