// Dans /app/api/matching/score/route.ts
function computeMatchScore(profile: any, scholarship: any): number {
  let score = 0;

  // 1. Niveau d'études (25 points)
  if (profile.currentLevel === scholarship.degreeLevel) {
    score += 25;
  } else if (
    (profile.currentLevel === 'Bachelor' && scholarship.degreeLevel === 'Master') ||
    (profile.currentLevel === 'Master' && scholarship.degreeLevel === 'PhD')
  ) {
    score += 15; // progression possible
  } else {
    score += 5;
  }

  // 2. Domaine d'études (20 points)
  if (profile.fieldOfStudy && scholarship.field) {
    const pField = profile.fieldOfStudy.toLowerCase();
    const sField = scholarship.field.toLowerCase();
    if (pField.includes(sField) || sField.includes(pField)) {
      score += 20;
    } else {
      score += 5;
    }
  } else {
    score += 10;
  }

  // 3. Note moyenne (20 points) – sur 20
  if (scholarship.minGrade && profile.averageGrade) {
    const ratio = profile.averageGrade / scholarship.minGrade;
    if (ratio >= 1.2) score += 20;
    else if (ratio >= 1.0) score += 18;
    else if (ratio >= 0.9) score += 14;
    else if (ratio >= 0.8) score += 10;
    else if (ratio >= 0.7) score += 5;
    else score += 2;
  } else {
    score += 10; // pas de condition, bonus moyen
  }

  // 4. Pays cibles (15 points)
  if (profile.targetCountries && profile.targetCountries.length > 0) {
    if (profile.targetCountries.includes(scholarship.country)) {
      score += 15;
    } else {
      score += 2;
    }
  } else {
    score += 5;
  }

  // 5. Niveau d'anglais (10 points)
  if (profile.englishLevel && scholarship.englishRequired) {
    const levels: Record<string, number> = { 'A1':1, 'A2':2, 'B1':3, 'B2':4, 'C1':5, 'C2':6 };
    const profileLevel = levels[profile.englishLevel.toUpperCase()] || 0;
    const requiredLevel = levels[scholarship.englishRequired.toUpperCase()] || 0;
    if (profileLevel >= requiredLevel) score += 10;
    else if (profileLevel >= requiredLevel - 1) score += 5;
    else score += 1;
  } else {
    score += 5;
  }

  // 6. Budget (10 points)
  if (profile.budget && scholarship.fundingType === 'Fully Funded') {
    // Si l'étudiant a un budget limité, une bourse full funded est très intéressante
    score += 10;
  } else if (scholarship.fundingType === 'Fully Funded') {
    score += 7;
  } else if (scholarship.fundingType === 'Partial') {
    score += 3;
  }

  // 7. Bonus tags (5 points)
  if (scholarship.tags && scholarship.tags.length > 0) {
    const profileLower = (profile.fieldOfStudy + ' ' + (profile.targetCountries || []).join(' ')).toLowerCase();
    let matchCount = 0;
    for (const tag of scholarship.tags) {
      if (profileLower.includes(tag.toLowerCase())) matchCount++;
    }
    const bonus = Math.min(5, Math.floor(matchCount * 2));
    score += bonus;
  }

  return Math.min(100, Math.round(score));
}