import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: params.id },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Bourse non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ scholarship });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}