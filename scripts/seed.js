// scripts/seed.js
// Run with: node scripts/seed.js
// Requires: npm install firebase-admin
// Place serviceAccountKey.json in project root before running

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }         from 'firebase-admin/firestore';
import { readFileSync }         from 'fs';
import { fileURLToPath }        from 'url';
import { dirname, join }        from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ── Helper ──────────────────────────────────────────
async function set(col, docId, data) {
  await db.collection(col).doc(docId).set(data);
  console.log(`✔  ${col}/${docId}`);
}

async function add(col, data) {
  const ref = await db.collection(col).add(data);
  console.log(`✔  ${col}/${ref.id}`);
}

// ── SEED ────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Seeding Firestore…\n');

  // Profile
  await set('profile', 'main', {
    name: 'Virendra Gadekar',
    tagline: 'Open source by conviction, full stack by craft',
    bio: 'BCA student at Dr. D.Y. Patil School of Science and Technology, Pune. Java Full Stack Developer who believes the best code serves real people. Merged contributions to the Jenkins CI/CD ecosystem as an undergraduate — because open source is not a hobby, it\'s a conviction.',
    photo_url: '',
    email: 'contact@virendragadekar.dev',
    phone: '+91-7414968840',
    location: 'Pune, Maharashtra',
    github: 'https://github.com/viru0909-dev',
    linkedin: 'https://www.linkedin.com/in/virendragadekar/',
    resume_url: '',
    education: [
      {
        institution: 'Dr. D.Y. Patil School of Science and Technology',
        degree: 'Bachelor of Computer Applications (BCA)',
        year_range: '2024 – 2027',
        semesters: [
          { sem: 'Semester 1', cgpa: '9.27' },
          { sem: 'Semester 2', cgpa: '8.91' },
          { sem: 'Semester 3', cgpa: '9.27' },
        ],
        overall_cgpa: '9.09',
      },
    ],
  });

  // Skills
  const skillCategories = [
    { category: 'Languages',        order: 1, items: ['Java', 'JavaScript', 'SQL', 'C++', 'Python'] },
    { category: 'Frameworks & Web', order: 2, items: ['Spring Boot', 'React', 'REST APIs', 'Hibernate', 'Maven', 'HTML', 'CSS'] },
    { category: 'Tools & DevOps',   order: 3, items: ['Git', 'GitHub', 'Docker', 'Jenkins', 'Firebase', 'Postman', 'IntelliJ IDEA'] },
    { category: 'CS Fundamentals',  order: 4, items: ['System Design', 'Data Structures', 'Algorithms', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks'] },
    { category: 'Soft Skills',      order: 5, items: ['Open Source Contribution', 'Problem Solving', 'Technical Writing', 'Team Collaboration', 'Communication'] },
  ];
  for (const cat of skillCategories) await add('skills', cat);

  // Open Source
  await add('opensource', {
    repo: 'Jenkins / plugin-modernizer-tool',
    pr_number: 'PR #1428',
    pr_url: 'https://github.com/jenkinsci/plugin-modernizer-tool/pull/1428',
    description: 'Implemented idempotent PR creation logic to prevent API 422 errors on repeated runs. Designed a configurable Strategy Pattern (SKIP, UPDATE, IGNORE) selectable via CLI flags. Added Mockito unit tests covering all three strategies and edge cases.',
    tags: ['Java', 'Jenkins', 'Strategy Pattern', 'Mockito', 'CI/CD'],
    merged: true,
    date: '2025-11',
    order: 1,
  });

  await add('opensource', {
    repo: 'Jenkins / rpm-packaging',
    pr_number: 'PR #544',
    pr_url: 'https://github.com/jenkinsci/rpm-packaging/pull/544',
    description: 'Fixed RPM packaging spec file to resolve build failures in the Jenkins CI pipeline. Ensured compatibility with updated dependency versions and corrected file permission mappings for systemd service files.',
    tags: ['RPM', 'Jenkins', 'Linux', 'Build Systems', 'DevOps'],
    merged: true,
    date: '2025-09',
    order: 2,
  });

  // Projects
  await add('projects', {
    name: 'Nyay-Saarthi',
    subtitle: 'Digital Judiciary Platform',
    description: 'Fine-tuned and orchestrated multiple LLMs (Gemini, Groq/Llama-3) with task-specific routing. Built custom NLP pipeline using Kanoon API for Indian legal queries. Real-time AI avatar with lip-sync. Multi-Indian language support. Cryptographic document vault using SHA-256. Face recognition login + JWT RBAC.',
    tech: ['Spring Boot', 'React', 'Groq AI', 'Gemini', 'NLP', 'WebRTC', 'SHA-256', 'JWT', 'OpenCV'],
    github_url: 'https://github.com/viru0909-dev/nyay-setu-working',
    live_url: 'https://nyaysetu-lovat.vercel.app/',
    vision: 'Accessible legal guidance for every Indian citizen regardless of language or literacy.',
    status: 'Active',
    featured: true,
    contribution_guide: 'We welcome contributions!\n\n1. Fork the repository\n2. Clone locally: git clone https://github.com/viru0909-dev/nyay-setu-working\n3. Set up the backend: cd backend && mvn spring-boot:run\n4. Set up the frontend: cd frontend && npm install && npm run dev\n5. Create a feature branch: git checkout -b feature/your-feature\n6. Make your changes with clear commit messages\n7. Open a Pull Request with a detailed description\n\nPlease check open issues labeled "good first issue" for beginner-friendly starting points.',
    cover_url: '',
    order: 1,
  });

  await add('projects', {
    name: 'SmartCampus AI',
    subtitle: 'Intelligent Campus Management System',
    description: 'AI-powered campus management platform with real-time attendance tracking via face recognition, smart scheduling, and predictive analytics for student performance. Integrated chatbot for student queries using NLP.',
    tech: ['Java', 'Spring Boot', 'Python', 'OpenCV', 'React', 'MySQL'],
    github_url: 'https://github.com/viru0909-dev',
    live_url: '',
    vision: '',
    status: 'In Progress',
    featured: false,
    contribution_guide: '',
    cover_url: '',
    order: 2,
  });

  // Achievements
  const achievements = [
    { title: 'VOIS for Tech Innovation Marathon 2.0',         org: 'Vodafone Intelligent Solutions', result: 'Hackathon Finalist',     date: '2025', order: 1 },
    { title: 'E-Summit 2026 — Innovate4Impact Buildathon',    org: 'Pune Zonals',                    result: '2nd Place',             date: '2026', order: 2 },
    { title: 'Smart India Hackathon (SIH) 2025',              org: 'Government of India',             result: 'College Winner',       date: '2025', order: 3 },
    { title: 'E-Summit 2026 — Hack4Impact 24hr',              org: 'IIIT Delhi',                     result: 'Participant',          date: '2026', order: 4 },
    { title: 'GSSoC (GirlScript Summer of Code)',             org: 'GirlScript Foundation',          result: 'Applied & Contributing', date: '2025', order: 5 },
    { title: 'DTO Hackathon',                                  org: 'Government of India',             result: 'Applied',              date: '2025', order: 6 },
  ];
  for (const a of achievements) await add('achievements', a);

  // Blog (placeholder posts, unpublished)
  await add('blog', {
    title: 'How I got a PR merged into Jenkins as a BCA student',
    slug: 'jenkins-pr-merged-bca',
    content: '',
    cover_url: '',
    tags: ['Jenkins', 'Open Source', 'Java', 'Career'],
    published: false,
    created_at: '2025-11-15T00:00:00Z',
    video_url: '',
  });

  await add('blog', {
    title: 'Strategy Pattern in the real world — lessons from Jenkins codebase',
    slug: 'strategy-pattern-jenkins-real-world',
    content: '',
    cover_url: '',
    tags: ['Design Patterns', 'Java', 'Jenkins'],
    published: false,
    created_at: '2026-01-10T00:00:00Z',
    video_url: '',
  });

  console.log('\n✅  Seed complete!\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
});
