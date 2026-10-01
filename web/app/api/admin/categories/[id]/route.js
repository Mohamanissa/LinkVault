import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/adminGuard';

// DELETE /api/admin/categories/[id] → supprimer une catégorie
export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  // Vérifier si la catégorie contient des liens
  const linksCount = await prisma.link.count({
    where: { categoryId: id },
  });

  if (linksCount > 0) {
    return NextResponse.json(
      {
        error: `Impossible : cette catégorie contient ${linksCount} lien(s). Supprime d'abord les liens.`,
      },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
