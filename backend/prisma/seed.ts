// prisma/seed.ts
import { PrismaClient, Plan, Role, ListingType, PropertyType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco...');

  // 1) Usuário admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@crm.dev' },
    update: {},
    create: {
      email: 'admin@crm.dev',
      name: 'Admin',
      passwordHash,
    },
  });

  // 2) Time inicial
  const team = await prisma.team.upsert({
    where: { id: 'seed-team' },
    update: {},
    create: {
      id: 'seed-team',
      name: 'Time de Teste',
      plan: Plan.FREE,
    },
  });

  // 3) Membership (admin é dono do time)
  await prisma.membership.upsert({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: team.id,
      },
    },
    update: { role: Role.OWNER },
    create: {
      userId: user.id,
      teamId: team.id,
      role: Role.OWNER,
    },
  });

  // 4) Leads iniciais
  await prisma.lead.createMany({
    data: [
      {
        teamId: team.id,
        name: 'João Comprador',
        phone: '11988887777',
        email: 'joao@example.com',
        source: 'Indicação',
      },
      {
        teamId: team.id,
        name: 'Maria Cliente',
        phone: '11999996666',
        email: 'maria@example.com',
        source: 'OLX',
      },
    ],
    skipDuplicates: true,
  });

  // 5) Propriedade de exemplo (sem campos de endereço aqui)
  const property = await prisma.property.upsert({
    where: { id: 'seed-property' },
    update: {},
    create: {
      id: 'seed-property',
      teamId: team.id,
      title: 'Apartamento 2 Quartos - Centro',
      description: 'Apartamento bem localizado, perto do metrô.',
      price: 350000.0,
      listingType: ListingType.SALE,
      propertyType: PropertyType.RESIDENTIAL,
      bedrooms: 2,
      bathrooms: 1,
      areaM2: 65,
      isPublic: true,
    },
  });

  // 6) Endereço da propriedade (tabela separada)
  // Certifique-se de que em PropertyAddress o campo `propertyId` é @unique.
  await prisma.propertyAddress.upsert({
    where: { propertyId: property.id }, // unique
    update: {
      street: 'Rua Exemplo',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '01000-000',
      lat: -23.55052,
      lng: -46.633308,
      complement: 'Apto 12',
    },
    create: {
      propertyId: property.id,
      street: 'Rua Exemplo',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '01000-000',
      lat: -23.55052,
      lng: -46.633308,
      complement: 'Apto 12',
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
