const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Supprimer les anciennes données (pour éviter les doublons)
  await prisma.application.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.academicProfile.deleteMany();
  await prisma.user.deleteMany();

  // Créer des bourses exemple
  const scholarships = [
    {
      title: "Bourse Eiffel Excellence",
      country: "France",
      university: "Université Paris Sciences et Lettres",
      degreeLevel: "Master",
      field: "Ingénierie",
      fundingType: "Fully Funded",
      amount: 25000,
      deadline: new Date("2025-01-15"),
      description: "Bourse d'excellence pour étudiants internationaux.",
      officialLink: "https://www.campusfrance.org/fr/bourse-eiffel",
      minGrade: 14,
      englishRequired: "B2",
      tags: ["France", "Master", "Excellence"]
    },
    {
      title: "MEXT Scholarship",
      country: "Japon",
      university: "Université de Tokyo",
      degreeLevel: "Master",
      field: "Recherche",
      fundingType: "Fully Funded",
      amount: 30000,
      deadline: new Date("2025-05-30"),
      description: "Bourse du gouvernement japonais.",
      minGrade: 13,
      englishRequired: "C1",
      tags: ["Japon", "Master", "Gouvernement"]
    },
    {
      title: "DAAD EPOS",
      country: "Allemagne",
      university: "Université Technique de Munich",
      degreeLevel: "Master",
      field: "Développement",
      fundingType: "Fully Funded",
      amount: 20000,
      deadline: new Date("2025-08-31"),
      description: "Bourse pour étudiants des pays en développement.",
      minGrade: 12,
      englishRequired: "B2",
      tags: ["Allemagne", "Master", "Développement"]
    }
  ];

  for (const s of scholarships) {
    await prisma.scholarship.create({ data: s });
  }

  console.log("✅ Base de données initialisée avec des bourses exemple.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());