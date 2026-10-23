import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding LinkVault...');

  const categories = [
    { slug: 'anime', name: 'Animés', icon: '', color: '#ff6b9d', order: 1, description: 'Animés japonais et asiatiques' },
    { slug: 'movie', name: 'Films', icon: '', color: '#4ecdc4', order: 2, description: 'Films et séries' },
    { slug: 'game', name: 'Jeux vidéo', icon: '', color: '#95e1d3', order: 3, description: 'Jeux PC, console et mobile' },
    { slug: 'certification', name: 'Certifications', icon: '', color: '#f9ca24', order: 4, description: 'Certifications professionnelles par filière' },
    { slug: 'other', name: 'Autres', icon: '', color: '#a29bfe', order: 5, description: 'Divers' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const cats = await prisma.category.findMany();
  const getCat = (slug) => cats.find((c) => c.slug === slug);

  const demoLinks = [
    { title: 'Crunchyroll', url: 'https://www.crunchyroll.com', description: 'Streaming officiel d\'animés japonais.', categoryId: getCat('anime').id, platform: 'Web', isSecure: true, tags: 'streaming,officiel' },
    { title: 'ADN', url: 'https://animedigitalnetwork.fr', description: 'Streaming d\'animés en VF/VOSTFR, plateforme française légale.', categoryId: getCat('anime').id, platform: 'Web', isSecure: true, tags: 'streaming,vf' },
    { title: 'Netflix', url: 'https://www.netflix.com', description: 'Streaming légal de films et séries.', categoryId: getCat('movie').id, platform: 'Web', isSecure: true, tags: 'streaming,officiel' },
    { title: 'Prime Video', url: 'https://www.primevideo.com', description: 'Streaming Amazon films et séries.', categoryId: getCat('movie').id, platform: 'Web', isSecure: true, tags: 'streaming,amazon' },
    { title: 'Steam', url: 'https://store.steampowered.com', description: 'Boutique officielle jeux PC.', categoryId: getCat('game').id, platform: 'Web', isSecure: true, tags: 'boutique,officiel' },
    { title: 'Epic Games Store', url: 'https://store.epicgames.com', description: 'Boutique jeux PC, gratuits hebdo.', categoryId: getCat('game').id, platform: 'Web', isSecure: true, tags: 'boutique,gratuit' },
    { title: 'FreeCodeCamp', url: 'https://www.freecodecamp.org', description: 'Certifications gratuites en dev web.', categoryId: getCat('certification').id, platform: 'Web', isSecure: true, tags: 'certification,dev,gratuit' },
    { title: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com', description: 'Certifications Google marketing/data/dev.', categoryId: getCat('certification').id, platform: 'Web', isSecure: true, tags: 'certification,marketing,google' },
    { title: 'Coursera', url: 'https://www.coursera.org', description: 'Certifications universitaires en ligne.', categoryId: getCat('certification').id, platform: 'Web', isSecure: true, tags: 'certification,université' },
    { title: 'GitHub', url: 'https://github.com', description: 'Hébergement de code et collaboration.', categoryId: getCat('other').id, platform: 'Web', isSecure: true, tags: 'dev,code' },
  ];

  for (const link of demoLinks) {
    const exists = await prisma.link.findFirst({ where: { url: link.url } });
    if (!exists) await prisma.link.create({ data: link });
  }

  console.log('✅ Seed terminé !');
  console.log(`📦 ${categories.length} catégories`);
  console.log(`🔗 ${demoLinks.length} liens`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
