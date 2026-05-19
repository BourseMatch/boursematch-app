import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const degreeLevel = searchParams.get('degreeLevel');
    const field = searchParams.get('field');

    // Construire les filtres
    const filters: any = {};
    if (country) filters.country = country;
    if (degreeLevel) filters.degreeLevel = degreeLevel;
    if (field) filters.field = { contains: field, mode: 'insensitive' };

    const scholarships = await prisma.scholarship.findMany({
      where: filters,
      orderBy: { deadline: 'asc' }, // les plus proches d'abord
    });

    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}