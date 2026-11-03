import { PDFParse } from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Comprehensive skill catalog with canonical names and regex match patterns
const SKILL_CATALOG = [
  // Programming Languages
  { name: 'Python', regex: /\bpython\b/i },
  { name: 'JavaScript', regex: /\b(javascript|js|es6)\b/i },
  { name: 'TypeScript', regex: /\b(typescript|ts)\b/i },
  { name: 'Java', regex: /\bjava\b(?!\s*script)/i },
  { name: 'C++', regex: /\b(c\+\+|cpp)\b/i },
  { name: 'C#', regex: /\b(c#|csharp)\b/i },
  { name: 'C', regex: /\b(?<!\w)c(?!\w|\+|\#)/i },
  { name: 'Go', regex: /\b(golang|go)\b/i },
  { name: 'Rust', regex: /\brust\b/i },
  { name: 'Kotlin', regex: /\bkotlin\b/i },
  { name: 'Swift', regex: /\bswift\b/i },
  { name: 'PHP', regex: /\bphp\b/i },
  { name: 'Ruby', regex: /\bruby\b/i },
  { name: 'SQL', regex: /\bsql\b/i },

  // Web Development & Frameworks
  { name: 'React', regex: /\b(react|reactjs|react\.js)\b/i },
  { name: 'Next.js', regex: /\b(nextjs|next\.js)\b/i },
  { name: 'Node.js', regex: /\b(nodejs|node\.js|node)\b/i },
  { name: 'Express.js', regex: /\b(express|expressjs|express\.js)\b/i },
  { name: 'Vue.js', regex: /\b(vue|vuejs|vue\.js)\b/i },
  { name: 'Angular', regex: /\bangular\b/i },
  { name: 'Django', regex: /\bdjango\b/i },
  { name: 'Flask', regex: /\bflask\b/i },
  { name: 'FastAPI', regex: /\bfastapi\b/i },
  { name: 'Spring Boot', regex: /\b(spring boot|springboot|spring)\b/i },
  { name: 'HTML5', regex: /\b(html|html5)\b/i },
  { name: 'CSS3', regex: /\b(css|css3)\b/i },
  { name: 'Tailwind CSS', regex: /\b(tailwind|tailwindcss)\b/i },
  { name: 'Bootstrap', regex: /\bbootstrap\b/i },
  { name: 'REST API', regex: /\b(rest|restful|rest api|apis)\b/i },
  { name: 'GraphQL', regex: /\bgraphql\b/i },
  { name: 'Full-Stack', regex: /\b(full[\s-]?stack|web development)\b/i },

  // Databases & Storage
  { name: 'PostgreSQL', regex: /\b(postgres|postgresql)\b/i },
  { name: 'MySQL', regex: /\bmysql\b/i },
  { name: 'MongoDB', regex: /\b(mongo|mongodb)\b/i },
  { name: 'SQLite', regex: /\bsqlite\b/i },
  { name: 'Redis', regex: /\bredis\b/i },
  { name: 'Firebase', regex: /\bfirebase\b/i },
  { name: 'Supabase', regex: /\bsupabase\b/i },
  { name: 'Prisma', regex: /\bprisma\b/i },

  // Cloud & DevOps
  { name: 'Docker', regex: /\bdocker\b/i },
  { name: 'Kubernetes', regex: /\b(k8s|kubernetes)\b/i },
  { name: 'AWS', regex: /\b(aws|amazon web services)\b/i },
  { name: 'Azure', regex: /\b(azure|microsoft azure)\b/i },
  { name: 'Google Cloud (GCP)', regex: /\b(gcp|google cloud)\b/i },
  { name: 'Git & GitHub', regex: /\b(git|github|gitlab)\b/i },
  { name: 'CI/CD', regex: /\b(ci\/cd|github actions|jenkins)\b/i },
  { name: 'Linux', regex: /\b(linux|ubuntu|debian|unix)\b/i },
  { name: 'Bash', regex: /\b(bash|shell scripting|shell)\b/i },

  // AI, Data Science & Machine Learning
  { name: 'Machine Learning', regex: /\b(machine learning|ml)\b/i },
  { name: 'Deep Learning', regex: /\b(deep learning|dl|neural networks)\b/i },
  { name: 'Artificial Intelligence', regex: /\b(artificial intelligence|ai)\b/i },
  { name: 'TensorFlow', regex: /\btensorflow\b/i },
  { name: 'PyTorch', regex: /\bpytorch\b/i },
  { name: 'Scikit-learn', regex: /\b(scikit[\s-]?learn|sklearn)\b/i },
  { name: 'Pandas', regex: /\bpandas\b/i },
  { name: 'NumPy', regex: /\bnumpy\b/i },
  { name: 'Computer Vision', regex: /\b(computer vision|opencv)\b/i },
  { name: 'NLP', regex: /\b(natural language processing|nlp)\b/i },
  { name: 'Large Language Models (LLM)', regex: /\b(llm|large language model|generative ai|genai)\b/i },
  { name: 'Data Analytics', regex: /\b(data analytics|data analysis|power bi|tableau)\b/i },

  // Cybersecurity
  { name: 'Cybersecurity', regex: /\b(cybersecurity|cyber security|infosec|information security)\b/i },
  { name: 'Ethical Hacking', regex: /\b(ethical hacking|penetration testing|pen testing)\b/i },
  { name: 'Network Security', regex: /\b(network security|firewall|wireshark)\b/i },
  { name: 'Cryptography', regex: /\b(cryptography|encryption)\b/i },
  { name: 'OWASP & AppSec', regex: /\b(owasp|application security|appsec)\b/i },
  { name: 'CTF (Capture The Flag)', regex: /\b(ctf|capture the flag)\b/i },
  { name: 'Threat Intelligence', regex: /\b(threat intelligence|soc|siem|incident response)\b/i },

  // Hardware, Robotics & IoT
  { name: 'Robotics', regex: /\brobotics\b/i },
  { name: 'IoT', regex: /\b(iot|internet of things)\b/i },
  { name: 'Arduino', regex: /\barduino\b/i },
  { name: 'Raspberry Pi', regex: /\braspberry pi\b/i },
  { name: 'Embedded Systems', regex: /\b(embedded systems|microcontroller|arm|stm32)\b/i },
  { name: 'Circuit Design & VLSI', regex: /\b(vlsi|circuit design|pcb|verilog|vhdl|matlab)\b/i },
  { name: '3D Printing & CAD', regex: /\b(3d printing|cad|autocad|solidworks)\b/i },

  // Entrepreneurship & Management
  { name: 'Entrepreneurship', regex: /\b(entrepreneurship|entrepreneur|founder)\b/i },
  { name: 'Startup Incubation', regex: /\b(startup|startups|incubation|mvp)\b/i },
  { name: 'Pitching & Business Modeling', regex: /\b(pitch deck|pitching|business model|venture capital)\b/i },
  { name: 'Product Management', regex: /\b(product management|agile|scrum)\b/i },
  { name: 'Marketing & Growth', regex: /\b(marketing|growth hacking|seo|sales)\b/i },

  // Design & Media
  { name: 'UI/UX Design', regex: /\b(ui\/ux|ui design|ux design|user experience)\b/i },
  { name: 'Figma', regex: /\bfigma\b/i },
  { name: 'Graphic Design', regex: /\b(graphic design|photoshop|illustrator)\b/i },
  { name: 'Video Editing', regex: /\b(video editing|premiere pro|after effects)\b/i },
  { name: 'Public Speaking', regex: /\b(public speaking|anchoring|communication skills)\b/i }
];

// Club Domain keyword weighting for smart matching
const CLUB_KEYWORDS = {
  'The Byte Club': [
    'react', 'next.js', 'node.js', 'express.js', 'javascript', 'typescript', 'full-stack',
    'html5', 'css3', 'tailwind css', 'bootstrap', 'rest api', 'graphql', 'git & github',
    'python', 'mongodb', 'postgresql', 'c++', 'java', 'web development', 'hackathon'
  ],
  'OWASP NIE Student Chapter': [
    'cybersecurity', 'ethical hacking', 'network security', 'cryptography', 'owasp & appsec',
    'ctf (capture the flag)', 'linux', 'bash', 'git & github', 'python', 'c'
  ],
  'ISSA Cyber-Tech Club': [
    'cybersecurity', 'network security', 'threat intelligence', 'cloud & devops', 'aws',
    'azure', 'docker', 'kubernetes', 'linux', 'bash', 'ci/cd', 'information security'
  ],
  'ONYX E-Cell (Entrepreneurship Cell)': [
    'entrepreneurship', 'startup incubation', 'pitching & business modeling', 'product management',
    'marketing & growth', 'public speaking', 'leadership', 'business'
  ],
  'Alpha Club': [
    'robotics', 'iot', 'arduino', 'raspberry pi', 'embedded systems', '3d printing & cad',
    'circuit design & vlsi', 'c', 'c++', 'python', 'hardware'
  ],
  'NIE IEEE Student Branch (NISB)': [
    'artificial intelligence', 'machine learning', 'deep learning', 'python', 'tensorflow',
    'pytorch', 'circuit design & vlsi', 'embedded systems', 'data analytics', 'research',
    'c++', 'matlab', 'computer vision'
  ],
  'The 4th Wall': [
    'ui/ux design', 'figma', 'graphic design', 'video editing', 'public speaking',
    'creative', 'media', 'scriptwriting', 'directing'
  ]
};

/**
 * Extract plain text from PDF buffer using pdf-parse v2
 */
export async function parsePdfBuffer(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (error) {
    console.error('Error parsing PDF buffer with PDFParse:', error);
    // Fallback: try raw string extraction if simple text stream
    return buffer.toString('utf-8');
  }
}

/**
 * Extract technical skills from text using catalog
 */
export function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const extracted = new Set();

  for (const item of SKILL_CATALOG) {
    if (item.regex.test(text)) {
      extracted.add(item.name);
    }
  }

  return Array.from(extracted);
}

/**
 * Match a set of user skills to all clubs in database
 */
export async function matchClubsForSkills(userSkills = []) {
  const clubs = await prisma.club.findMany({
    include: {
      facultyCoordinator: { select: { name: true, email: true } },
      _count: { select: { members: true, events: true } }
    }
  });

  if (!userSkills || userSkills.length === 0) {
    // Return standard ranking if no skills detected yet
    return clubs.map(club => ({
      club,
      matchScore: 60,
      matchedSkills: [],
      reason: 'General campus club recommendation. Upload your resume for tailored percentage matching!'
    }));
  }

  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

  const scoredClubs = clubs.map(club => {
    const clubName = club.name;
    const knownKeywords = (CLUB_KEYWORDS[clubName] || []).map(k => k.toLowerCase());
    
    // Also extract keywords dynamically from description & socialLinks
    let clubText = (club.description || '').toLowerCase();
    try {
      if (club.socialLinks) {
        const meta = JSON.parse(club.socialLinks);
        clubText += ' ' + (meta.domain || '').toLowerCase();
        clubText += ' ' + (meta.mission || '').toLowerCase();
        if (meta.initiatives) {
          clubText += ' ' + meta.initiatives.map(i => `${i.title} ${i.desc}`).join(' ').toLowerCase();
        }
      }
    } catch (_) {}

    const matchedSkills = [];

    userSkills.forEach((skill, index) => {
      const lower = normalizedUserSkills[index];
      // Check if skill is in known keywords or appears in club profile text
      const isKnown = knownKeywords.some(kw => kw.includes(lower) || lower.includes(kw));
      const inText = clubText.includes(lower);

      if (isKnown || inText) {
        matchedSkills.push(skill);
      }
    });

    // Score calculation
    let matchScore = 0;
    if (matchedSkills.length > 0) {
      // Base score on proportion of matched skills + bonuses
      const matchRatio = matchedSkills.length / Math.min(Math.max(userSkills.length, 3), 8);
      matchScore = Math.min(Math.round(65 + (matchRatio * 34)), 99);
    } else {
      // Base minimal alignment
      matchScore = Math.floor(Math.random() * 15) + 35;
    }

    let reason = '';
    if (matchedSkills.length > 0) {
      reason = `Matched ${matchedSkills.length} key skill${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.slice(0, 4).join(', ')}${matchedSkills.length > 4 ? '...' : ''} with ${club.name}'s activities.`;
    } else {
      reason = `Great entry point to expand your portfolio and learn new competencies at ${club.name}.`;
    }

    return {
      club,
      matchScore,
      matchedSkills,
      reason
    };
  });

  // Sort descending by matchScore
  scoredClubs.sort((a, b) => b.matchScore - a.matchScore);

  return scoredClubs;
}
