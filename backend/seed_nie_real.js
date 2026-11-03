import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Synchronizing Exact NIE Campus Clubs from Official PDF...');

  const defaultPassword = await bcrypt.hash('faculty123', 10);

  // 1. Official Faculty Coordinators from PDF
  const facultyMembers = [
    {
      name: 'Dr. C. K. Vanamala',
      email: 'vanamala.ck@nie.ac.in',
      department: 'Computer Science and Engineering',
      role: 'FACULTY',
      bio: 'SPOC Clubs NIE North & Cultural SPOC'
    },
    {
      name: 'Dr. Narender M',
      email: 'narender.m@nie.ac.in',
      department: 'Information Science and Engineering',
      role: 'FACULTY',
      bio: 'Associate Professor, Department of ISE'
    },
    {
      name: 'Prof. Gowtham',
      email: 'gowtham@nie.ac.in',
      department: 'Computer Science and Engineering',
      role: 'FACULTY',
      bio: 'Faculty Coordinator - ONYX E-Cell'
    },
    {
      name: 'Prof. B. S. Jayashri',
      email: 'jayashri.bs@nie.ac.in',
      department: 'Information Science and Engineering',
      role: 'FACULTY',
      bio: 'Faculty Advisor - OWASP NIE Student Chapter'
    },
    {
      name: 'Dr. Rashmi M. R.',
      email: 'rashmi.mr@nie.ac.in',
      department: 'Computer Science and Engineering',
      role: 'FACULTY',
      bio: 'Faculty Coordinator - ISSA Cyber-Tech Club'
    },
    {
      name: 'Dr. Narendra',
      email: 'narendra@nie.ac.in',
      department: 'Electronics and Communication Engineering',
      role: 'FACULTY',
      bio: 'Branch Counselor - NIE IEEE Student Branch (NISB)'
    },
    {
      name: 'Dr. Balaji',
      email: 'balaji@nie.ac.in',
      department: 'Mechanical Engineering',
      role: 'FACULTY',
      bio: 'Faculty Lead - Alpha Club (Alpha Innovation & Tinker\'s Lab)'
    },
    {
      name: 'Dr. Lakshmiranganath',
      email: 'lakshmiranganath@nie.ac.in',
      department: 'Civil Engineering',
      role: 'FACULTY',
      bio: 'Faculty Coordinator - The 4th Wall'
    }
  ];

  const facultyMap = {};
  for (const f of facultyMembers) {
    let user = await prisma.user.findUnique({ where: { email: f.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          ...f,
          password: defaultPassword
        }
      });
    } else {
      user = await prisma.user.update({
        where: { email: f.email },
        data: {
          name: f.name,
          department: f.department,
          role: f.role,
          bio: f.bio
        }
      });
    }
    facultyMap[f.name] = user.id;
  }

  // 2. The 8 Exact Clubs Defined in NIE_Student_Clubs_List.pdf
  const clubsData = [
    {
      name: 'The Byte Club',
      description: 'The premier technical club of NIE North under CSE and ISE departments. Focused on Full-Stack Development, React, Node.js, Emerging Tech, Hackathons & Practical Engineering.',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. C. K. Vanamala'],
      socialLinks: JSON.stringify({
        motto: 'Build Your Technical Expertise — Build. Break. Innovate. Beyond The Ordinary.',
        studentLead: 'Mayank Rai (Dept of CSE/ISE)',
        campus: 'NIE North Campus',
        domain: 'Full-Stack Development, Emerging Tech, Hackathons & Practical Engineering',
        mission: 'Empowering students through hands-on development experiences and peer collaboration to bridge the theoretical-practical gap — aspiring to become a premier hub of innovation and technical excellence in computer science.',
        initiatives: [
          { title: 'HACKFORGE', desc: 'Flagship National-Level Hackathon where innovators collaborate, prototype, and build solutions in a high-energy competitive environment.' },
          { title: 'Searching For The Upside Down', desc: 'A campus-wide tech treasure hunt involving algorithmic puzzles, code breaking, lockboxes, and clues.' },
          { title: 'Beyond The Labs', desc: 'Practical experimentation with next-generation developer tooling (Google Labs, Opal, Stitch).' },
          { title: 'Hands-on Experience Sessions', desc: 'Stepping beyond textbooks to explore hardware interfaces, cloud deployments, and industry-grade architectures.' }
        ]
      })
    },
    {
      name: 'ONYX E-Cell (Entrepreneurship Cell)',
      description: 'The official Entrepreneurship Cell of NIE North. Dedicated to Startup Incubation, Business Modeling, Pitch Decks, Venture Capital, and Connecting Student Founders with Industry Leaders.',
      logo: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Prof. Gowtham'],
      socialLinks: JSON.stringify({
        motto: 'BUILD. PITCH. LEAD. — Join The Builder\'s Room',
        studentLead: 'Ayush Das',
        campus: 'NIE North Campus',
        domain: 'Entrepreneurship, Business Incubation, Startup Pitches & Venture Building',
        mission: 'Where ideas meet execution, and students learn to think, build, and lead like entrepreneurs. A student-led launchpad designed for campus builders and innovators.',
        initiatives: [
          { title: 'The 4-Stage Builder Pipeline', desc: 'Structured incubation process: IDEA → VALIDATE → BUILD → SCALE.' },
          { title: 'Ideathon Competitions', desc: 'Formal pitch platforms where student founders present MVPs and business plans to panels of angel investors and faculty.' },
          { title: 'Product Hackathons & Startup Challenges', desc: 'Fast-paced weekend development sprints tackling consumer and B2B market gaps.' },
          { title: 'Founder Sessions & Industrial Visits', desc: 'Exclusive executive Q&As and offsite company tours (e.g., Skanray Technologies) with 900+ community members.' }
        ]
      })
    },
    {
      name: 'OWASP NIE Student Chapter',
      description: 'The official Open Web Application Security Project chapter at NIE. Specializing in Cybersecurity, Ethical Hacking, Application Security, Web Defense, and Capture The Flag (CTF) challenges.',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Prof. B. S. Jayashri'],
      socialLinks: JSON.stringify({
        motto: 'Discover. Learn. Connect.',
        studentLead: 'Priyanshu Raj',
        campus: 'NIE North Campus',
        domain: 'Cybersecurity, Ethical Hacking, Application Security & Open-Source Tools',
        mission: 'To foster an open, practical cybersecurity culture empowering students with defensive and offensive security skills, network defense, and industry-standard vulnerability assessments.',
        initiatives: [
          { title: 'GitGud Series', desc: 'Comprehensive masterclasses in Git and GitHub version control, collaborative workflows, and open-source contribution.' },
          { title: 'Commanding the Command Line', desc: 'Linux operating system architecture, bash shell scripting, server administration, and automation tools.' },
          { title: 'Flag Fury CTF', desc: 'High-stakes Capture The Flag competitions testing reverse engineering, cryptography, web exploitation, and forensics.' },
          { title: 'Placement & Corporate Mentorship', desc: 'Guided preparation for security roles, hackathons, and interviews with alumni at Fidelity Investments, J.P. Morgan, and National Instruments.' }
        ]
      })
    },
    {
      name: 'ISSA Cyber-Tech Club (Info Systems Security Association)',
      description: 'Information Systems Security Association student chapter at NIE North. Focused on Enterprise IT Infrastructure, Cloud Security, Threat Intelligence, and System Administration.',
      logo: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. Rashmi M. R.'],
      socialLinks: JSON.stringify({
        motto: 'Learn. Build. Compete. Connect. (Founded 2019)',
        studentLead: 'Nishan K',
        campus: 'NIE North Campus',
        domain: 'Information Systems Security, IT Infrastructure & Corporate Readiness',
        mission: 'Connecting engineering students directly with enterprise information security standards, professional networking, and real-world system resilience.',
        initiatives: [
          { title: 'Technical Exposure', desc: 'Practical training on cloud infrastructure security, endpoint protection, and contemporary enterprise attack vectors.' },
          { title: 'Corporate & Industrial Connect', desc: 'Organized corporate visits to leading software technology giants (including Amazon corporate facilities).' },
          { title: 'Tech Talks & Industry Seminars', desc: 'Inviting practicing security analysts, threat intelligence specialists, and infrastructure architects.' },
          { title: 'Career & Portfolio Development', desc: 'Structured resume clinics, competitive coding preparation, and project guidance for technical placements.' }
        ]
      })
    },
    {
      name: 'NIE IEEE Student Branch (NISB)',
      description: 'The largest technical professional society branch in Karnataka. Encompassing Robotics, Circuits & Systems, Space Research, Electronics & Computing.',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. Narendra'],
      socialLinks: JSON.stringify({
        motto: 'The Hub of Innovation, Technology, and Knowledge',
        studentLead: 'Sagar Kumar Singh & Abhay Hegde',
        campus: 'NIE South Campus',
        domain: 'Robotics, Circuits & Systems, Space Research, Electronics & Computing',
        mission: 'One of Karnataka\'s most active IEEE student communities, driven by a hands-on philosophy of learning through doing and linking students to global technical advancements.',
        initiatives: [
          { title: 'Multi-Chapter Ecosystem', desc: 'Houses IEEE Computer Society, Circuits and Systems Society (CAS), Robotics & Automation Society (RAS), Geoscience & Remote Sensing (GRSS), and Women in Engineering (WIE).' },
          { title: 'Prestigious Industrial Visits', desc: 'Educational expeditions to premier national institutions including IIST & VSSC (Thiruvananthapuram), NIGST & IIIT (Hyderabad), and KSRSAC & KSNDMC (Bangalore).' },
          { title: 'Awards & Laurels', desc: 'Winner of the Outstanding Large Student Branch Award (2023) and the Outstanding Student Branch Chapter Award (2025).' },
          { title: 'Workshops & Publications', desc: 'Regular research paper mentoring, embedded system workshops, hardware hackathons, and international conference participation.' }
        ]
      })
    },
    {
      name: 'The 4th Wall (Film & Storytelling Club)',
      description: 'The premier student filmmaking, cinema, and visual storytelling club of NIE North. Focused on Screenplay Writing, Direction, Cinematography, Video Editing, and Short Film Production.',
      logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. Lakshmiranganath'],
      socialLinks: JSON.stringify({
        motto: 'Imagine. Create. Shoot. Inspire.',
        studentLead: 'Renuka',
        campus: 'NIE North Campus',
        domain: 'Filmmaking, Scriptwriting, Cinematography, Acting & Visual Storytelling',
        mission: 'Providing an open cinematic canvas for student creators, storytellers, and directors to express original concepts, produce short films, and master visual media arts.',
        initiatives: [
          { title: 'TAKE ONE Filmmaking Challenge', desc: 'Signature flagship event where 20+ teams spin a genre wheel, write a screenplay in 30 minutes, and shoot + edit a complete short film within 1.5 hours.' },
          { title: 'Cinematic Production', desc: 'Hands-on exposure to DSLR/cine cameras, gimbals, multi-track audio recording, lighting techniques, and post-production editing.' },
          { title: 'Storyboarding & Direction', desc: 'Interactive workshops breaking down narrative arcs, visual symbolism, pacing, character development, and casting.' },
          { title: 'Campus Film Festivals', desc: 'Screenings of student-produced documentaries, drama pieces, and promotional college shorts on social media platforms.' }
        ]
      })
    },
    {
      name: 'Alpha Club (Alpha Innovation & Tinker\'s Lab)',
      description: 'The makerspace and rapid prototyping hub of NIE North. Specializing in IoT, Microcontrollers, Embedded Hardware, 3D Fabrication, Robotics, and Patent Development.',
      logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. Balaji'],
      socialLinks: JSON.stringify({
        motto: 'Hands-on Innovation, Hardware Tinkering & Rapid Prototyping',
        studentLead: 'Vaishnavi D',
        campus: 'NIE North Campus',
        domain: 'IoT, Microcontrollers, Embedded Hardware, 3D Fabrication & Product Design',
        mission: 'Democratizing hardware innovation by providing students with tools, components, and mentorship to transform academic ideas into functional physical products.',
        initiatives: [
          { title: 'Makerspace Culture', desc: 'Practical labs equipped with microcontrollers (ESP32, Arduino, Raspberry Pi), sensor suites, soldering stations, and diagnostic gear.' },
          { title: 'Interdisciplinary Engineering', desc: 'Fostering cross-departmental collaboration between CSE, ISE, ECE, and Mechanical students.' },
          { title: 'Product Development & Patents', desc: 'Assisting students in converting coursework mini-projects into competition-worthy prototypes and patent submissions.' },
          { title: 'Tinkering Sprints', desc: 'Weekly challenge sessions where members build automated IoT devices, smart campus prototypes, and robotics modules.' }
        ]
      })
    },
    {
      name: 'Kalasamhitha Cultural Club',
      description: 'The official Cultural and Fine Arts Club of NIE North. Celebrating Indian Heritage, Classical & Contemporary Music, Dance, Theater, Fine Arts, and Cultural Festivals.',
      logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000',
      facultyCoordinatorId: facultyMap['Dr. C. K. Vanamala'],
      socialLinks: JSON.stringify({
        motto: 'Celebrating Tradition, Performing Arts & Creative Expression',
        studentLead: 'Cultural Core Leads',
        campus: 'NIE North Campus',
        domain: 'Classical & Contemporary Music, Dance, Theater, Fine Arts & Cultural Fests',
        mission: 'Enriching collegiate campus life by nurturing artistic talent, preserving classical cultural heritage, and providing a dynamic platform for creative student expression.',
        initiatives: [
          { title: 'Campus Cultural Festivals', desc: 'Planning, coordinating, and executing large-scale annual cultural fests, intramural talent rounds, and celebratory events.' },
          { title: 'Performing Arts Ensembles', desc: 'Organizing dedicated classical and Western music bands, classical and contemporary dance troupes, and theatrical drama teams.' },
          { title: 'University Representation', desc: 'Selecting and coaching student representatives for inter-collegiate fests, state-level youth competitions, and VTU cultural festivals.' },
          { title: 'Artistic Harmony', desc: 'Providing balance to rigorous engineering curricula through creative workshops, open-mic evenings, and fine-arts exhibitions.' }
        ]
      })
    }
  ];

  const allowedNames = clubsData.map(c => c.name);

  // 3. Remove any obsolete clubs that are NOT in the official PDF
  // First, find any old events and memberships associated with non-PDF clubs
  const obsoleteClubs = await prisma.club.findMany({
    where: {
      name: { notIn: allowedNames }
    }
  });

  for (const oc of obsoleteClubs) {
    console.log(`Removing non-PDF obsolete club: ${oc.name}`);
    await prisma.eventRegistration.deleteMany({ where: { event: { clubId: oc.id } } });
    await prisma.event.deleteMany({ where: { clubId: oc.id } });
    await prisma.clubMember.deleteMany({ where: { clubId: oc.id } });
    await prisma.openPosition.deleteMany({ where: { clubId: oc.id } });
    await prisma.club.delete({ where: { id: oc.id } });
  }

  // 4. Upsert the 8 exact PDF clubs
  const clubMap = {};
  for (const c of clubsData) {
    const club = await prisma.club.upsert({
      where: { name: c.name },
      update: c,
      create: c
    });
    clubMap[c.name] = club.id;
  }

  // 5. Flagship Events aligned with the PDF Signature Initiatives
  const eventsData = [
    {
      title: 'HACKFORGE 2026: National Hackathon',
      description: 'Flagship 24-hour National-Level Hackathon by The Byte Club where innovators collaborate, prototype, and build solutions in high-energy competitive tracks with mentorship and prizes.',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      venue: 'Sir M.V. Auditorium, North Campus',
      capacity: 250,
      posters: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000',
      clubId: clubMap['The Byte Club']
    },
    {
      title: 'Flag Fury: Campus CTF Challenge',
      description: 'High-stakes Capture The Flag competition organized by OWASP NIE Chapter testing reverse engineering, cryptography, web exploitation, and forensics skills.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Computing Lab 3, North Campus',
      capacity: 120,
      posters: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000',
      clubId: clubMap['OWASP NIE Student Chapter']
    },
    {
      title: 'TAKE ONE: 2-Hour Filmmaking Sprint',
      description: 'Signature filmmaking sprint by The 4th Wall where 20+ teams spin a genre wheel, write a screenplay in 30 minutes, and shoot + edit an entire short film within 1.5 hours.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      venue: 'NIE Amphitheatre & Campus Lawns',
      capacity: 150,
      posters: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
      clubId: clubMap['The 4th Wall (Film & Storytelling Club)']
    },
    {
      title: 'NIE Campus Ideathon & Pitch Battle',
      description: 'Formal startup pitch platform by ONYX E-Cell where student founders present MVPs, business plans, and pitch decks before panels of angel investors and faculty.',
      date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      venue: 'Seminar Hall 1, North Campus',
      capacity: 100,
      posters: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1000',
      clubId: clubMap['ONYX E-Cell (Entrepreneurship Cell)']
    }
  ];

  for (const e of eventsData) {
    const existing = await prisma.event.findFirst({ where: { title: e.title } });
    if (!existing) {
      await prisma.event.create({ data: e });
    } else {
      await prisma.event.update({
        where: { id: existing.id },
        data: e
      });
    }
  }

  console.log(`Successfully synced all 8 official PDF clubs and initiatives! Total clubs: ${Object.keys(clubMap).length}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
