import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Ici tu remettras plus tard la vraie logique (récupération en base)
  return NextResponse.json({
    id,
    message: "Scholarship API temporairement désactivée pour debug"
  });
}
