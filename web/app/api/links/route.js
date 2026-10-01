import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const search = searchParams.get('q');

  const where = {
    isActive: true,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const links = await prisma.link.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }],
    include: { category: true },
  });

  return NextResponse.json(links);
}
