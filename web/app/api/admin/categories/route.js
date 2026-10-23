import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/adminGuard';

// POST /api/admin/categories → créer une catégorie
export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, icon, color, description, order } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Nom et slug obligatoires' },
      { status: 400 }
    );
  }

  // Vérifier que le slug n'existe pas déjà
  const existing = await prisma.category.findUnique({
    where: { slug: slug.toLowerCase().trim() },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'Ce slug existe déjà' },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      icon: icon || '📦',
      color: color || '#a29bfe',
      description: description || null,
      order: order ? parseInt(order) : 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
