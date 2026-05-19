import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();
    const {
      country,
      currentLevel,
      fieldOfStudy,
      averageGrade,
      englishLevel,
      budget,
      targetCountries,
      fundingType,
    } = body;

    // Validation basique
    if (!country || !currentLevel || !fieldOfStudy || !averageGrade || !englishLevel) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis' }, { status: 400 });
    }

    // Mettre à jour ou créer le profil académique
    const academicProfile = await prisma.academicProfile.upsert({
      where: { userId: decoded.userId },
      update: {
        country,
        currentLevel,
        fieldOfStudy,
        averageGrade: parseFloat(averageGrade),
        englishLevel,
        budget: budget ? parseFloat(budget) : null,
        targetCountries: targetCountries || [],
        fundingType: fundingType || null,
      },
      create: {
        userId: decoded.userId,
        country,
        currentLevel,
        fieldOfStudy,
        averageGrade: parseFloat(averageGrade),
        englishLevel,
        budget: budget ? parseFloat(budget) : null,
        targetCountries: targetCountries || [],
        fundingType: fundingType || null,
      },
    });

    return NextResponse.json({ success: true, profile: academicProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}